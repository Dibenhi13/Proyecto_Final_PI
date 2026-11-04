
document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formContacto");
    const respuesta = document.getElementById("respuesta");

    // Cambia esta dirección por tu correo de contacto real
    const correoDestino = "contacto@ejemplo.com";

    // Evento al enviar formulario
    formulario.addEventListener("submit", function (event) {

        event.preventDefault();

        // Obtener los datos
        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const asunto = document.getElementById("asunto").value;
        const mensaje = document.getElementById("mensaje").value.trim();

        // Validar los campos
        if (!nombre || !correo || !asunto || !mensaje) {
            respuesta.textContent = "Por favor, completa todos los campos.";
            return;
        }

        if (!formulario.checkValidity()) {
            respuesta.textContent = "Revisa los datos del formulario.";
            formulario.reportValidity();
            return;
        }

        // Preparar correo electrónico
        const cuerpo = `Nombre: ${nombre}
Correo: ${correo}

Mensaje:
${mensaje}`;

        const enlace = "mailto:" + correoDestino
            + "?subject=" + encodeURIComponent("StudyAI - " + asunto)
            + "&body=" + encodeURIComponent(cuerpo);

        // Abrir aplicación de correo
        window.location.href = enlace;

        respuesta.textContent =
            "Se abrió tu aplicación de correo. Revisa el mensaje y presiona Enviar para terminar.";
    });

    // Animaciones con GSAP
    if (typeof gsap !== "undefined") {

        gsap.from(".page-heading", {
            opacity: 0,
            y: 30,
            duration: 0.8
        });

        gsap.from(".contact-card", {
            opacity: 0,
            x: -45,
            duration: 0.9,
            delay: 0.2
        });

        gsap.from(".social-card", {
            opacity: 0,
            x: 45,
            duration: 0.9,
            delay: 0.3
        });

    }

});
