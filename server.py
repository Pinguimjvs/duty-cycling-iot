#!/usr/bin/env python3
"""
Servidor Web e API REST para a Porta 5375 do VM do Curso (andromeda.lasdpc.icmc.usp.br).
Tema 21: IoT Duty Cycling & Políticas de Transmissão (Grupo 21 - ICMC-USP).

Funcionalidades:
1. Serve o build estático de produção do React (pasta dist/)
2. Fornece endpoints REST ao vivo (/api/health, /api/estado, /api/runs, /api/summary, /api/analytics, /api/trace/S01)
3. Lê dados diretamente do sistema de arquivos da VM (~/t21/data/runs.csv, journal.jsonl)
4. Faz proxy do estado do orquestrador local (http://127.0.0.1:5275/estado.json)
5. Zero dependências externas (roda com o Python 3 padrão do Ubuntu 24.04 da VM)
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import http.server
import json
import mimetypes
import os
import pathlib
import socket
import sys
import urllib.error
import urllib.request

PORT_DEFAULT = 5375

class VMBackendHandler(http.server.BaseHTTPRequestHandler):
    dist_dir: pathlib.Path
    data_dir: pathlib.Path
    results_dir: pathlib.Path
    fallback_data_dir: pathlib.Path

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def send_json(self, data: any, status: int = 200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?")[0]

        # ---------------------------------------------------------
        # API Routes
        # ---------------------------------------------------------
        if path == "/api/health":
            hostname = socket.gethostname()
            info = {
                "status": "online",
                "vm": "andromeda.lasdpc.icmc.usp.br",
                "hostname": hostname,
                "port": self.server.server_port,
                "ports_grupo21": {
                    "ssh": 23175,
                    "mqtt_broker": 5175,
                    "t21lab_orchestrator": 5275,
                    "web_dashboard": self.server.server_port
                },
                "time": dt.datetime.now(dt.timezone.utc).isoformat(),
                "mode": "live_vm"
            }
            self.send_json(info)
            return

        if path == "/api/estado":
            # Tenta consultar o serviço t21lab na porta 5275 da VM
            try:
                req = urllib.request.Request("http://127.0.0.1:5275/estado.json")
                # Se autenticação básica for necessária, o t21lab pode pedir token
                with urllib.request.urlopen(req, timeout=2.0) as resp:
                    if resp.status == 200:
                        data = json.loads(resp.read().decode("utf-8"))
                        self.send_json({"fonte": "t21lab_5275", "status": "online", **data})
                        return
            except Exception:
                pass

            # Fallback se t21lab estiver pausado ou concluído
            self.send_json({
                "fonte": "snapshot_estatico",
                "status": "concluido",
                "agora": int(dt.datetime.now().timestamp() * 1000),
                "fim_do_plano": True,
                "pausado": False,
                "placa": {"estado": "pronta", "pronta": True, "reset": "power-on"},
                "total": 59,
                "validas": 59,
                "invalidas_seguidas": 0
            })
            return

        if path == "/api/runs":
            # 1. Procura runs.csv na pasta de dados da VM
            runs_csv = self.data_dir / "runs.csv"
            if not runs_csv.is_file():
                # Tenta caminhos alternativos
                alt = pathlib.Path.home() / "t21" / "data" / "runs.csv"
                if alt.is_file():
                    runs_csv = alt
                else:
                    alt2 = self.fallback_data_dir / "runs_table.json"
                    if alt2.is_file():
                        with open(alt2, "r", encoding="utf-8") as f:
                            self.send_json(json.load(f))
                        return

            try:
                rows = []
                with open(runs_csv, "r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    for r in reader:
                        rows.append(r)
                self.send_json(rows)
                return
            except Exception as e:
                self.send_json({"error": f"Erro lendo runs.csv: {e}"}, status=500)
                return

        if path == "/api/summary":
            summary_path = self.results_dir / "resultados.json"
            if not summary_path.is_file():
                summary_path = self.fallback_data_dir / "summary_results.json"
            
            try:
                with open(summary_path, "r", encoding="utf-8") as f:
                    self.send_json(json.load(f))
                return
            except Exception as e:
                self.send_json({"error": f"Erro lendo summary: {e}"}, status=500)
                return

        if path == "/api/analytics":
            analytics_path = self.fallback_data_dir / "cp4_detailed_analytics.json"
            try:
                with open(analytics_path, "r", encoding="utf-8") as f:
                    self.send_json(json.load(f))
                return
            except Exception as e:
                self.send_json({"error": f"Erro lendo analytics: {e}"}, status=500)
                return

        if path in ("/api/trace", "/api/trace/S01"):
            trace_path = self.fallback_data_dir / "s01_trace.json"
            try:
                with open(trace_path, "r", encoding="utf-8") as f:
                    self.send_json(json.load(f))
                return
            except Exception as e:
                self.send_json({"error": f"Erro lendo trace: {e}"}, status=500)
                return

        # ---------------------------------------------------------
        # Static Files & SPA Routing
        # ---------------------------------------------------------
        rel_path = path.lstrip("/")
        if not rel_path:
            rel_path = "index.html"

        target_file = self.dist_dir / rel_path
        if not target_file.is_file():
            # Fallback SPA (React Router / single-page application)
            target_file = self.dist_dir / "index.html"

        if not target_file.is_file():
            self.send_response(404)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"404 Not Found: static build not found. Execute 'npm run build' primeiro.")
            return

        # Determina o MIME type
        ctype, _ = mimetypes.guess_type(str(target_file))
        if not ctype:
            ctype = "application/octet-stream"

        try:
            with open(target_file, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(content)))
            self.send_cors_headers()
            if rel_path.startswith("assets/"):
                # Cache longo para arquivos com hash no nome
                self.send_header("Cache-Control", "public, max-age=31536000, immutable")
            else:
                self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(f"Erro servindo arquivo: {e}".encode("utf-8"))

    def log_message(self, format, *args):
        # Log sucinto com timestamp ISO
        ts = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        sys.stderr.write(f"[{ts}] {self.address_string()} - {format % args}\n")


def run_server(port: int, dist_dir: str, data_dir: str, results_dir: str, fallback_data_dir: str):
    VMBackendHandler.dist_dir = pathlib.Path(dist_dir).resolve()
    VMBackendHandler.data_dir = pathlib.Path(data_dir).resolve()
    VMBackendHandler.results_dir = pathlib.Path(results_dir).resolve()
    VMBackendHandler.fallback_data_dir = pathlib.Path(fallback_data_dir).resolve()

    server_address = ("0.0.0.0", port)
    httpd = http.server.ThreadingHTTPServer(server_address, VMBackendHandler)
    print(f"==================================================================")
    print(f" Servidor Web & API REST Tema 21 iniciado na porta {port}")
    print(f" URL Externa: http://andromeda.lasdpc.icmc.usp.br:{port}")
    print(f" Pasta estática dist: {VMBackendHandler.dist_dir}")
    print(f" Pasta dados VM:      {VMBackendHandler.data_dir}")
    print(f"==================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando servidor...")
        httpd.server_close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Servidor Web & API Tema 21 na VM")
    parser.add_argument("--port", type=int, default=PORT_DEFAULT, help=f"Porta HTTP (padrão: {PORT_DEFAULT})")
    parser.add_argument("--dist", type=str, default="./dist", help="Caminho para a pasta dist do frontend")
    parser.add_argument("--data", type=str, default=str(pathlib.Path.home() / "t21" / "data"), help="Pasta de dados da VM")
    parser.add_argument("--results", type=str, default=str(pathlib.Path.home() / "t21" / "current" / "results" / "cp4"), help="Pasta de resultados da VM")
    parser.add_argument("--fallback-data", type=str, default="./src/data", help="Pasta com dados de fallback")
    args = parser.parse_args()

    run_server(args.port, args.dist, args.data, args.results, args.fallback_data)
