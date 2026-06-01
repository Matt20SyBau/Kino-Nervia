// Navegación entre pasos con validación estricta
function nextStep(current, next) {
    const currentStepDiv = document.getElementById(`step-${current}`);
    const inputs = currentStepDiv.querySelectorAll('input[required], textarea[required], select[required]');
    
    let allValid = true;
    inputs.forEach(input => {
        if (!input.value) {
            allValid = false;
            input.style.borderColor = "#C0392B"; 
        } else {
            input.style.borderColor = "#D1D8D5";
        }
    });

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

    document.getElementById(`step-${current}`).classList.remove('active');
    document.getElementById(`step-${next}`).classList.add('active');
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
        const advancePrice = totalPrice * 0.50; 

        document.getElementById('summary-service').innerText = serviceName;
        document.getElementById('summary-total').innerText = `S/ ${totalPrice.toFixed(2)}`;
        document.getElementById('summary-advance').innerText = `S/ ${advancePrice.toFixed(2)}`;
    }
}

// Switcher para los métodos de pago dinámicos (Yape vs BCP)
function switchPayment(method) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.payment-info-content').forEach(info => info.classList.remove('active'));

    if (method === 'yape') {
        document.querySelector('.tab-btn[onclick*="yape"]').classList.add('active');
        document.getElementById('payment-yape').classList.add('active');
    } else if (method === 'bcp') {
        document.querySelector('.tab-btn[onclick*="bcp"]').classList.add('active');
        document.getElementById('payment-bcp').classList.add('active');
    }
}

// --- ENVÍO ASÍNCRONO DEL FORMULARIO CON FORMSPREE ---
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const form = e.target;
    const data = new FormData(form); 
    const submitBtn = document.querySelector('.btn-submit');
    
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Procesando reserva...";
    submitBtn.disabled = true;
    submitBtn.style.backgroundColor = "#555"; 

    fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // Mensaje actualizado pidiendo el voucher por WhatsApp
            alert("¡Solicitud recibida! Te escribiremos por WhatsApp en unos minutos para que nos envíes la foto de tu voucher y confirmar la cita.");
            form.reset(); 
            
            // Volver al paso 1 visualmente
            document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
            document.querySelectorAll('.step').forEach(indicator => indicator.classList.remove('active'));
            document.getElementById('step-1').classList.add('active');
            document.getElementById('p-step-1').classList.add('active');
            
        } else {
            alert("Hubo un problema al procesar tu reserva. Por favor, intenta de nuevo.");
        }
    }).catch(error => {
        alert("Error de conexión. Verifica tu internet e intenta nuevamente.");
    }).finally(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = "var(--gradient-end)";
    });
});
