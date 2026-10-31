// Obtener el usuario actual logueado
let currentUser = localStorage.getItem('cryptoBoxCurrentUser') || 'estudiante_ucne';
let usuarios = JSON.parse(localStorage.getItem('cryptoBoxUsuarios')) || {};

// Si el usuario no existe en la BD local, crearlo por defecto con saldo en USDT
if (!usuarios[currentUser]) {
    usuarios[currentUser] = {
        saldo: 100.00,
        historial: ['Cuenta inicial: +100.00 USDT (Bono de bienvenida)']
    };
    localStorage.setItem('cryptoBoxUsuarios', JSON.stringify(usuarios));
}

let userData = usuarios[currentUser];
let saldo = userData.saldo;
const tokensValidos = ["BTC-001", "ETH-001", "BOX-001", "BOX-002", "BOX-003"];
let historialData = userData.historial || [];

// Elementos visuales
const saldoDisplay = document.getElementById("saldoDisplay");
const usuarioDisplay = document.getElementById("usuarioDisplay");
const tokenIdInput = document.getElementById("tokenId");
const destinatarioInput = document.getElementById("destinatario");
const montoInput = document.getElementById("monto");
const mensajeEstado = document.getElementById("mensajeEstado");
const historialBox = document.getElementById("historialBox");
const listaHistorial = document.getElementById("listaHistorial");

// Mostrar datos iniciales
saldoDisplay.textContent = `${saldo.toFixed(2)} USDT`;
usuarioDisplay.textContent = `Usuario: ${currentUser}`;

function guardarCambios() {
    usuarios = JSON.parse(localStorage.getItem('cryptoBoxUsuarios')) || {};
    userData.saldo = saldo;
    userData.historial = historialData;
    usuarios[currentUser] = userData;
    localStorage.setItem('cryptoBoxUsuarios', JSON.stringify(usuarios));
}

function mostrarMensaje(texto, esExito) {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = "status-message " + (esExito ? "status-exito" : "status-error");
}

// SINCRONIZACIÓN EN TIEMPO REAL: Si otro usuario le envía dinero, se actualiza solo
window.addEventListener('storage', (event) => {
    if (event.key === 'cryptoBoxUsuarios') {
        usuarios = JSON.parse(event.newValue) || {};
        if (usuarios[currentUser]) {
            userData = usuarios[currentUser];
            saldo = userData.saldo;
            historialData = userData.historial;
            saldoDisplay.textContent = `${saldo.toFixed(2)} USDT`;
            
            if (!historialBox.classList.contains("hidden")) {
                listaHistorial.innerHTML = historialData.map(item => `<li>${item}</li>`).join("");
            }
        }
    }
});

// 1. Botón Depositar (Ficha física / Moneda)
document.getElementById("btnDepositar").addEventListener("click", () => {
    const tokenId = tokenIdInput.value.trim().toUpperCase();
    const monto = parseFloat(montoInput.value);

    if (!tokensValidos.includes(tokenId)) {
        mostrarMensaje("Error: Código de ficha física no válido.", false);
        return;
    }
    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje("Error: Ingrese un monto válido a depositar.", false);
        return;
    }

    saldo += monto;
    saldoDisplay.textContent = `${saldo.toFixed(2)} USDT`;
    historialData.push(`Depósito: +${monto} USDT (Ficha ${tokenId})`);
    guardarCambios();

    mostrarMensaje(`¡Depósito exitoso con ficha ${tokenId}!`, true);
    tokenIdInput.value = "";
    montoInput.value = "";
});

// 2. Botón Enviar con validación y recepción instantánea
document.getElementById("btnEnviar").addEventListener("click", () => {
    const destino = destinatarioInput.value.trim().toLowerCase();
    const monto = parseFloat(montoInput.value);

    if (!destino) {
        mostrarMensaje("Error: Ingrese un usuario destinatario.", false);
        return;
    }
    if (destino === currentUser) {
        mostrarMensaje("Error: No puedes enviarte fondos a ti mismo.", false);
        return;
    }

    usuarios = JSON.parse(localStorage.getItem('cryptoBoxUsuarios')) || {};
    if (!usuarios[destino]) {
        mostrarMensaje(`Error: El usuario "${destino}" no existe en el sistema.`, false);
        return;
    }

    if (isNaN(monto) || monto <= 0 || monto > saldo) {
        mostrarMensaje("Error: Monto inválido o saldo insuficiente.", false);
        return;
    }

    // 1. Descontar al emisor
    saldo -= monto;
    saldoDisplay.textContent = `${saldo.toFixed(2)} USDT`;
    historialData.push(`Envío: -${monto} USDT a [${destino}]`);
    guardarCambios();

    // 2. Sumar y registrar en el destinatario instantáneamente
    usuarios[destino].saldo += monto;
    usuarios[destino].historial.push(`Has recibido: +${monto} USDT de [${currentUser}]`);
    localStorage.setItem('cryptoBoxUsuarios', JSON.stringify(usuarios));

    mostrarMensaje(`¡Enviado con éxito a ${destino}!`, true);
    destinatarioInput.value = "";
    montoInput.value = "";
});

// 3. Botón Retirar
document.getElementById("btnRetirar").addEventListener("click", () => {
    const monto = parseFloat(montoInput.value);

    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje("Error: Ingrese un monto válido para retirar.", false);
        return;
    }
    if (monto > saldo) {
        mostrarMensaje("Error: Saldo insuficiente para el retiro.", false);
        return;
    }

    saldo -= monto;
    saldoDisplay.textContent = `${saldo.toFixed(2)} USDT`;
    historialData.push(`Retiro físico: -${monto} USDT`);
    guardarCambios();

    mostrarMensaje(`¡Retiro exitoso! Retire sus monedas físicas.`, true);
    montoInput.value = "";
});

// 4. Botón Ver Historial
document.getElementById("btnHistorial").addEventListener("click", () => {
    historialBox.classList.toggle("hidden");
    listaHistorial.innerHTML = historialData.map(item => `<li>${item}</li>`).join("");
    if(historialData.length === 0) {
        listaHistorial.innerHTML = "<li>No hay transacciones aún.</li>";
    }
});