// StudyAI: flechas, desplazamiento táctil y estado de los botones.
document.addEventListener('DOMContentLoaded', () => {
  const pista = document.getElementById('carouselContainer');
  const anterior = document.getElementById('previousButton');
  const siguiente = document.getElementById('nextButton');
  if (!pista || !anterior || !siguiente) return;

  const mover = (direccion) => {
    const tarjeta = pista.querySelector('.carousel-card');
    if (!tarjeta) return;
    const gap = parseFloat(getComputedStyle(pista).columnGap) || 0;
    pista.scrollBy({ left: direccion * (tarjeta.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };
  anterior.addEventListener('click', () => mover(-1));
  siguiente.addEventListener('click', () => mover(1));

  const actualizar = () => {
    anterior.disabled = pista.scrollLeft <= 2;
    siguiente.disabled = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 2;
  };
  pista.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar);
  actualizar();
});
