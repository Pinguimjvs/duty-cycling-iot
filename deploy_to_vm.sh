#!/usr/bin/env bash
# Deploy do Frontend React & Servidor REST para a VM do LaSDPC (ICMC-USP)
# Host: andromeda.lasdpc.icmc.usp.br
# Porta SSH: 23175
# Usuário: giotgrad21
# Porta Web Designada: 5375
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VM_HOST="${T21_VM_HOST:-andromeda.lasdpc.icmc.usp.br}"
VM_USER="${T21_VM_USER:-giotgrad21}"
VM_PORT="${T21_VM_PORT:-23175}"
WEB_PORT="${T21_WEB_PORT:-5375}"

echo "=================================================================="
echo " 🚀 Deploy do Frontend na VM: $VM_USER@$VM_HOST (Porta Web: $WEB_PORT)"
echo "=================================================================="

# 1. Compilação do build de produção
echo "==> 1. Compilando o build de produção do React (Vite)..."
npm run build

# 2. Criar diretório remoto na VM
echo "==> 2. Preparando diretório ~/t21/frontend na VM..."
ssh -p "$VM_PORT" "$VM_USER@$VM_HOST" "mkdir -p ~/t21/frontend/dist ~/t21/logs"

# 3. Sincronizar arquivos para a VM via rsync (ou scp)
echo "==> 3. Enviando build (dist/) e servidor Python (server.py)..."
rsync -avz --delete -e "ssh -p $VM_PORT" dist/ "$VM_USER@$VM_HOST:~/t21/frontend/dist/"
rsync -avz -e "ssh -p $VM_PORT" server.py "$VM_USER@$VM_HOST:~/t21/frontend/server.py"

# Copiar dados de fallback caso a VM precise de dados adicionais
rsync -avz -e "ssh -p $VM_PORT" src/data/ "$VM_USER@$VM_HOST:~/t21/frontend/fallback_data/"

# 4. Iniciar ou reiniciar o serviço na porta 5375
echo "==> 4. Reiniciando servidor na porta $WEB_PORT na VM..."
ssh -p "$VM_PORT" "$VM_USER@$VM_HOST" bash << 'EOF'
  PORT=5375
  # Encerra qualquer instância anterior na porta 5375
  PID=$(lsof -ti:$PORT 2>/dev/null || ss -lptn "sport = :$PORT" 2>/dev/null | grep -oP 'pid=\K[0-9]+' || true)
  if [ -n "$PID" ]; then
    echo "Parando processo anterior PID $PID..."
    kill -TERM "$PID" 2>/dev/null || true
    sleep 1
  fi

  # Inicia em background via nohup usando o Python da VM
  echo "Iniciando novo servidor na porta $PORT..."
  nohup python3 ~/t21/frontend/server.py \
    --port $PORT \
    --dist ~/t21/frontend/dist \
    --data ~/t21/data \
    --results ~/t21/current/results/cp4 \
    --fallback-data ~/t21/frontend/fallback_data \
    > ~/t21/logs/frontend_web.log 2>&1 < /dev/null &

  sleep 1
  if ss -ltn | grep -q ":$PORT\b"; then
    echo "✅ Servidor rodando com sucesso na porta $PORT!"
  else
    echo "⚠️ Verificando logs em ~/t21/logs/frontend_web.log..."
    tail -n 10 ~/t21/logs/frontend_web.log || true
  fi
EOF

echo ""
echo "=================================================================="
echo " 🎉 Deploy Concluído com Sucesso!"
echo " Acesse a aplicação ao vivo em:"
echo " 🌐 http://$VM_HOST:$WEB_PORT"
echo "=================================================================="
