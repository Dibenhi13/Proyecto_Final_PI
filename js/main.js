// ===============================
// REGISTRAR SCROLLTRIGGER
// ===============================

gsap.registerPlugin(ScrollTrigger);


// ===============================
// ANIMACIÓN INICIAL DEL HEADER
// ===============================

gsap.from(".header", {
    y: -80,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});


// ===============================
// ANIMACIÓN DEL HERO
// ===============================

gsap.from(".hero-small", {
    x: -50,
    opacity: 0,
    duration: 0.8,
    delay: 0.3
});

gsap.from(".hero-title", {
    x: -60,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power3.out"
});

gsap.from(".hero-description", {
    x: -50,
    opacity: 0,
    duration: 0.8,
    delay: 0.7
});

gsap.from(".hero-buttons", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.9
});


// ===============================
// ANIMACIÓN DEL ROBOT
// ===============================

gsap.from(".hero-image img", {
    x: 100,
    opacity: 0,
    scale: 0.8,
    duration: 1.2,
    delay: 0.5,
    ease: "back.out(1.5)"
});


// Movimiento constante del robot

gsap.to(".hero-image img", {
    y: -12,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});


// ===============================
// MENSAJE DEL HERO
// ===============================

gsap.from(".hero-message", {
    scale: 0,
    opacity: 0,
    rotation: -10,
    duration: 0.8,
    delay: 1.3,
    ease: "back.out(1.7)"
});


// ===============================
// TARJETAS DE MATERIAS
// ===============================

gsap.fromTo(
    ".subject-card",

    {
        y: 60,
        opacity: 0
    },

    {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.25,
        ease: "power3.out",

        scrollTrigger: {
            trigger: ".subjects",
            start: "top 90%",
            toggleActions: "play none none none"
        }
    }
);


// ===============================
// SECCIÓN STUDY AI
// ===============================

gsap.from(".study-ai-section", {
    scrollTrigger: {
        trigger: ".study-ai-section",
        start: "top 80%"
    },

    y: 60,
    opacity: 0,
    duration: 1
});


// Animación del robot pequeño

gsap.to(".study-ai-icon img", {
    rotation: 5,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
});


// ===============================
// CARRUSEL
// ===============================

gsap.from(".carousel-section", {
    scrollTrigger: {
        trigger: ".carousel-section",
        start: "top 80%"
    },

    y: 60,
    opacity: 0,
    duration: 1
});


// ===============================
// GEOLOCALIZACIÓN
// ===============================

gsap.from(".location-preview", {
    scrollTrigger: {
        trigger: ".location-preview",
        start: "top 85%"
    },

    y: 50,
    opacity: 0,
    duration: 1
});


// ===============================
// FOOTER
// ===============================

gsap.from(".footer", {
    scrollTrigger: {
        trigger: ".footer",
        start: "top 90%"
    },

    y: 40,
    opacity: 0,
    duration: 1
});


// ===============================
// CARRUSEL FUNCIONAL
// ===============================

const carousel = document.getElementById("carouselContainer");

const nextButton = document.getElementById("nextButton");

const previousButton = document.getElementById("previousButton");


// Botón siguiente

nextButton.addEventListener("click", function () {

    carousel.scrollBy({
        left: 250,
        behavior: "smooth"
    });

});


// Botón anterior

previousButton.addEventListener("click", function () {

    carousel.scrollBy({
        left: -250,
        behavior: "smooth"
    });

});


// ===============================
// STUDY AI - BOTÓN PREGUNTAR
// ===============================

const askButton = document.getElementById("askButton");

const questionInput = document.getElementById("question");


askButton.addEventListener("click", function () {

    const pregunta = questionInput.value.trim();


    // Revisar si está vacío

    if (pregunta === "") {

        alert("Escribe una pregunta primero.");

        return;
    }


    // Por ahora solo mostramos la pregunta

    alert(
        "Tu pregunta es:\n\n" + pregunta +
        "\n\nDespués conectaremos esta sección con la Inteligencia Artificial."
    );


    // Limpiar input

    questionInput.value = "";

});


// ===============================
// PERMITIR ENTER EN STUDY AI
// ===============================

questionInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        askButton.click();

    }

});


// ===============================
// ANIMACIÓN BOTONES
// ===============================

const buttons = document.querySelectorAll(
    ".btn-primary, .btn-secondary, .subject-button"
);


buttons.forEach(function (button) {

    button.addEventListener("mouseenter", function () {

        gsap.to(button, {
            scale: 1.04,
            duration: 0.2
        });

    });


    button.addEventListener("mouseleave", function () {

        gsap.to(button, {
            scale: 1,
            duration: 0.2
        });

    });

});


// ===============================
// ANIMACIÓN DE TARJETAS DEL CARRUSEL
// ===============================

gsap.from(".carousel-card", {

    scrollTrigger: {
        trigger: ".carousel-container",
        start: "top 85%"
    },

    y: 30,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15

});


// ===============================
// LINKS ACTIVOS DEL MENÚ
// ===============================

const navLinks = document.querySelectorAll(".nav-link");


navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.forEach(function (item) {

            item.classList.remove("active");

        });


        link.classList.add("active");

    });

});

ScrollTrigger.refresh();