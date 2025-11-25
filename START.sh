#!/bin/bash

# 🚀 AI STUDY GENIUS - SCRIPT DE INICIO RÁPIDO
# Desarrollado por: Vicentegg4212

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🧠 AI STUDY GENIUS - SCRIPT DE INICIO RÁPIDO            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Detectar sistema operativo
if [[ "$OSTYPE" == "darwin"* ]]; then
    OPEN_CMD="open"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OPEN_CMD="xdg-open"
elif [[ "$OSTYPE" == "msys" ]]; then
    OPEN_CMD="start"
fi

# Función para imprimir con color
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

# Verificar Node.js
echo ""
print_info "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_warning "Node.js no está instalado. Instálalo desde: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
print_status "Node.js instalado: $NODE_VERSION"

# Verificar npm
print_info "Verificando npm..."
if ! command -v npm &> /dev/null; then
    print_warning "npm no está instalado"
    exit 1
fi
NPM_VERSION=$(npm -v)
print_status "npm instalado: $NPM_VERSION"

# Ir al directorio del backend
echo ""
print_info "Navegando al directorio del backend..."
cd "$(dirname "$0")/js/backend" || exit 1
print_status "Directorio: $(pwd)"

# Instalar dependencias
echo ""
print_info "Instalando dependencias (primera vez que ejecutas)..."
npm install

# Iniciar servidor
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🚀 INICIANDO SERVIDOR                                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

npm start

# El script termina aquí (npm start se ejecuta en primer plano)
