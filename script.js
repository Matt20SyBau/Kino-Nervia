// Navegación entre pasos con validación estricta
function nextStep(current, next) {
    // Validar campos obligatorios del paso actual antes de avanzar
    const currentStepDiv = document.getElementById(`step-${current}`);
    const inputs = currentStepDiv.querySelectorAll('input[required], textarea[required], select[required]');
    
    let allValid = true;
    inputs.forEach(input => {
        if (!input.value) {
            allValid = false;
            input.style.borderColor = "#C0392B"; // Alerta visual roja
        } else {
            input.style.borderColor = "#D1D8D5";
        }
    });

    // Validar específicamente que se haya seleccionado un servicio en el paso 2
    if (current === 2) {
        const serviceSelected = document.querySelector('input[name="servicio"]:checked');
        if (!serviceSelected) {
            alert("Por favor, selecciona un servicio médico terapéutico.");
            return;
        }
    }

    if (!allValid) {
        alert("Por favor, complete todos los campos obligatorios marcados con asterisco (*).");
        return;
    }

    // Cambiar de panel activo
    document.getElementById(`step-${current}`).classList.remove('active');
    document.getElementById(`step-${next}`).classList.add('active');

    // Cambiar indicador en barra de progreso
    document.getElementById(`p-step-${next}`).classList.add('active');
}

function prevStep(current, prev) {
    document.getElementById(`step-${current}`).classList.remove('active');
    document.getElementById(`step-${prev}`).classList.add('active');
    
    document.getElementById(`p-step-${current}`).classList.remove('active');
}

// Calcular precios dinámicos (Regla de negocio del 50%)
function calculatePrices() {
    const selectedRadio = document.querySelector('input[name="servicio"]:checked');
    if (selectedRadio) {
        const serviceName = selectedRadio.value;
        const totalPrice = parseFloat(selectedRadio.getAttribute('data-price'));
        const advancePrice = totalPrice * 0.50; // Cálculo exacto del 50%

        // Inyectar datos en la interfaz del Paso 4
        document.getElementById('summary-service').innerText = serviceName;
        document.getElementById('summary-total').innerText = `S/ ${totalPrice.toFixed(2)}`;
        document.getElementById('summary-advance').innerText = `S/ ${advancePrice.toFixed(2)}`;
    }
}

// Switcher para los métodos de pago dinámicos (Yape vs BCP)
function switchPayment(method) {
    // Quitar estados activos de pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.payment-info-content').forEach(info => info.classList.remove('active'));

    // Activar correspondiente
    if (method === 'yape') {
        document.querySelector('.tab-btn[onclick*="yape"]').classList.add('active');
        document.getElementById('payment-yape').classList.add('active');
    } else if (method === 'bcp') {
        document.querySelector('.tab-btn[onclick*="bcp"]').classList.add('active');
        document.getElementById('payment-bcp').classList.add('active');
    }
}

// Captura del Submit Final
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Aquí puedes procesar el envío de datos mediante fetch() a un endpoint backend 
    // o integrarlo con servicios de correo directo para estáticos (ej: Formspree, EmailJS)
    alert("¡Solicitud enviada con éxito! Validaremos tu voucher de pago y confirmaremos tu cita vía WhatsApp en un plazo de 15 minutos.");
});