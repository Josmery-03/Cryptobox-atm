let saldo = 100.00;
const tokensValidos = ["BOX-001", "BOX-002", "BOX-003"];
const historialData = [];

const saldoDisplay = document.getElementById("saldoDisplay");
const tokenIdInput = document.getElementById("tokenId");
const destinatarioInput = document.getElementById("destinatario");
const montoInput = document.getElementById("monto");
const mensajeEstado = document.getElementById("mensajeEstado");
const historialBox = document.getElementById("historialBox");
const listaHistorial = document.getElementById("listaHistorial");

function mostrarMensaje(texto, esExito) {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = "status-message " + (esExito ? "status-exito" : "status-error");
}

// 1. Botón Depositar
document.getElementById("btnDepositar").addEventListener("click", () => {
    const tokenId = tokenIdInput.value.trim().toUpperCase();
    const monto = parseFloat(montoInput.value);

    if (!tokensValidos.includes(tokenId)) {
        mostrarMensaje("Error: Token físico no válido.", false);
        return;
    }
    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje("Error: Ingrese un monto válido.", false);
        return;
    }

    saldo += monto;
    saldoDisplay.textContent = `${saldo.toFixed(2)} TKIA`;
    historialData.push(`Depósito: +${monto} TKIA (Token ${tokenId})`);
    mostrarMensaje(`¡Depósito exitoso con ${tokenId}!`, true);
    
    tokenIdInput.value = "";
    montoInput.value = "";
});

// 2. Botón Enviar
document.getElementById("btnEnviar").addEventListener("click", () => {
    const destino = destinatarioInput.value.trim();
    const monto = parseFloat(montoInput.value);

    if (!destino) {
        mostrarMensaje("Error: Ingrese un destinatario.", false);
        return;
    }
    if (isNaN(monto) || monto <= 0 || monto > saldo) {
        mostrarMensaje("Error: Monto inválido o saldo insuficiente.", false);
        return;
    }

    saldo -= monto;
    saldoDisplay.textContent = `${saldo.toFixed(2)} TKIA`;
    historialData.push(`Envío: -${monto} TKIA a [${destino}]`);
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
    saldoDisplay.textContent = `${saldo.toFixed(2)} TKIA`;
    historialData.push(`Retiro físico: -${monto} TKIA`);
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