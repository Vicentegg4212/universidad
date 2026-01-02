// Test de funcionalidades del Frontend
console.log('🧪 Iniciando verificación de funciones del frontend...\n');

const tests = [];

// 1. Verificar elementos principales
const checkElement = (id, name) => {
    const element = document.getElementById(id);
    const exists = element !== null;
    tests.push({ name, status: exists ? '✅' : '❌', exists });
    return exists;
};

console.log('📱 1. ELEMENTOS DE LA INTERFAZ');
checkElement('authSection', 'Sección de autenticación');
checkElement('appSection', 'Sección de la aplicación');
checkElement('loginForm', 'Formulario de login');
checkElement('registerForm', 'Formulario de registro');
checkElement('textInput', 'Campo de texto');
checkElement('generateBtn', 'Botón generar');
checkElement('chatHistory', 'Historial de chat');
checkElement('themeToggle', 'Toggle de tema');
checkElement('sidebarToggle', 'Toggle de sidebar');
checkElement('newChatBtn', 'Botón nuevo chat');

console.log('\n🔧 2. FUNCIONES DE LOCALSTORAGE');
// Test LocalStorage
try {
    localStorage.setItem('test_key', 'test_value');
    const value = localStorage.getItem('test_key');
    localStorage.removeItem('test_key');
    tests.push({ name: 'LocalStorage funcional', status: '✅', exists: true });
} catch(e) {
    tests.push({ name: 'LocalStorage funcional', status: '❌', exists: false });
}

console.log('\n🎨 3. TEMA');
// Test Theme
const hasTheme = document.documentElement.hasAttribute('data-theme');
tests.push({ name: 'Sistema de temas', status: hasTheme ? '✅' : '⚠️', exists: hasTheme });

console.log('\n📊 RESUMEN:');
tests.forEach(test => {
    console.log(`${test.status} ${test.name}`);
});

const passed = tests.filter(t => t.status === '✅').length;
const total = tests.length;
console.log(`\n✅ ${passed}/${total} pruebas pasaron`);

if (passed === total) {
    console.log('🎉 ¡Todas las funciones están operativas!');
} else {
    console.log('⚠️ Algunas funciones necesitan atención');
}
