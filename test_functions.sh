#!/bin/bash
# Script de prueba para verificar todas las funciones de AI Study Genius

echo "🧪 INICIANDO PRUEBAS DE FUNCIONALIDAD - AI STUDY GENIUS"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Función para probar endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_code=$5
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Probando: $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$API_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_code" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $http_code, esperado $expected_code)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo "📡 1. PRUEBAS DE API BACKEND"
echo "================================"

# Test 1: Health check
test_endpoint "Health Check" "GET" "/api/health" "" "200"

# Test 2: Generate endpoint (sin datos)
test_endpoint "Generate sin datos" "POST" "/api/generate" '{}' "400"

# Test 3: Generate endpoint (con mensaje)
test_endpoint "Generate con mensaje" "POST" "/api/generate" \
    '{"lastMessage":"Hola","history":[]}' "200"

# Test 4: Generate con historial
test_endpoint "Generate con historial" "POST" "/api/generate" \
    '{"lastMessage":"¿Qué es 2+2?","history":[{"role":"user","text":"Hola"},{"role":"assistant","text":"¡Hola! ¿En qué puedo ayudarte?"}]}' "200"

echo ""
echo "📄 2. PRUEBAS DE ARCHIVOS ESTÁTICOS"
echo "===================================="

# Test 5: Página principal
test_endpoint "index.html" "GET" "/" "" "200"

# Test 6: CSS
test_endpoint "style.css" "GET" "/assets/style.css" "" "200"

# Test 7: JavaScript principal
test_endpoint "script.js" "GET" "/js/script.js" "" "200"

# Test 8: utils.js
test_endpoint "utils.js" "GET" "/js/utils.js" "" "200"

# Test 9: config.js
test_endpoint "config.js" "GET" "/js/config.js" "" "200"

echo ""
echo "🔐 3. PRUEBAS DE AUTENTICACIÓN"
echo "==============================="

# Test 10: GitHub OAuth redirect
test_endpoint "GitHub OAuth" "GET" "/auth/github" "" "302"

# Test 11: GitHub me (sin autenticación)
test_endpoint "GitHub me (sin auth)" "GET" "/api/github/me" "" "401"

echo ""
echo "📊 RESUMEN DE PRUEBAS"
echo "====================="
echo -e "Total de pruebas: $TOTAL_TESTS"
echo -e "${GREEN}Exitosas: $PASSED_TESTS${NC}"
echo -e "${RED}Fallidas: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡TODAS LAS PRUEBAS PASARON!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Algunas pruebas fallaron${NC}"
    exit 1
fi
