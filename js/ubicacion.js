
document.addEventListener("DOMContentLoaded", function () {

    // Mapa inicial centrado en Ciudad Juárez
    const mapa = L.map("mapa").setView([31.6904, -106.4245], 12);

    // Agregar mapa de OpenStreetMap
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    // Marcador inicial de referencia
    const marcadorInicial = L.marker([31.6904, -106.4245])
        .addTo(mapa)
        .bindPopup("¡Bienvenido a Ciudad Juárez!");

    // Elementos HTML
    const boton = document.getElementById("btnUbicacion");
    const mensaje = document.getElementById("mensajeUbicacion");

    let marcadorUsuario = null;
    let circuloPrecision = null;

    // Obtener la ubicación al presionar el botón
    boton.addEventListener("click", function () {

        if (!navigator.geolocation) {
            mensaje.textContent = "Tu navegador no permite utilizar la geolocalización.";
            return;
        }

        boton.disabled = true;
        mensaje.textContent = "Buscando tu ubicación...";

        navigator.geolocation.getCurrentPosition(

            // Si obtiene la ubicación
            function (posicion) {
                const latitud = posicion.coords.latitude;
                const longitud = posicion.coords.longitude;
                const precision = posicion.coords.accuracy;

                // Eliminar marcador anterior
                if (marcadorUsuario) {
                    mapa.removeLayer(marcadorUsuario);
                }

                if (circuloPrecision) {
                    mapa.removeLayer(circuloPrecision);
                }

                mapa.removeLayer(marcadorInicial);

                // Agregar marcador de usuario
                marcadorUsuario = L.marker([latitud, longitud])
                    .addTo(mapa)
                    .bindPopup("📍 ¡Estás aquí!")
                    .openPopup();

                // Mostrar precisión aproximada
                circuloPrecision = L.circle([latitud, longitud], {
                    radius: precision,
                    color: "#3478f6",
                    fillColor: "#3478f6",
                    fillOpacity: 0.12
                }).addTo(mapa);

                // Centrar mapa
                mapa.setView([latitud, longitud], 15);

                mensaje.textContent = "¡Ubicación encontrada correctamente!";
                boton.disabled = false;
            },

            // Si ocurre un error
            function (error) {
                if (error.code === 1) {
                    mensaje.textContent = "No se concedió permiso para acceder a tu ubicación.";
                } else if (error.code === 2) {
                    mensaje.textContent = "No pudimos encontrar tu ubicación.";
                } else if (error.code === 3) {
                    mensaje.textContent = "La búsqueda tardó demasiado. Inténtalo otra vez.";
                } else {
                    mensaje.textContent = "Ocurrió un error al buscar tu ubicación.";
                }

                boton.disabled = false;
            },

            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });

    // Animaciones con GSAP
    if (typeof gsap !== "undefined") {
        gsap.from(".page-heading", {
            opacity: 0,
            y: 35,
            duration: 0.8
        });

        gsap.from(".location-card", {
            opacity: 0,
            y: 45,
            duration: 0.9,
            delay: 0.2
        });
    }

});
