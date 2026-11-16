/* StudyAI: recorrido de aprendizaje usando la API JSON PHP/MySQL. */
const $ = id => document.getElementById(id);
const endpoint = (ruta, params = {}) => {
  const url = new URL(`api/${ruta}.php`, location.href);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url;
};
async function pedir(ruta, params = {}, opciones = {}) {
  const respuesta = await fetch(endpoint(ruta, params), {cache: 'no-store', ...opciones});
  let datos;
  try { datos = await respuesta.json(); }
  catch { throw Error('El servidor no devolvió JSON. Comprueba XAMPP y la ruta de la API.'); }
  if (!respuesta.ok) throw Error(datos.error || 'Error al cargar los datos');
  return datos;
}
function nodo(etiqueta, texto = '', clase = '') {
  const elemento = document.createElement(etiqueta);
  elemento.textContent = texto;
  if (clase) elemento.className = clase;
  return elemento;
}
const estado = {
  materias: [], materia: null, lecciones: [], leccion: null,
  actividades: [], indice: 0, aciertos: 0, puntos: 0,
  respondidas: 0, esperando: false, version: 0
};
function informar(texto = '') { $('estado').textContent = texto; }
function tituloMateria(materia) {
  const titulo = $('titulo-principal');
  const descripcion = $('descripcion-principal');
  if (titulo) titulo.textContent = `¡APRENDAMOS ${materia.nombre.toUpperCase()}!`;
  if (descripcion) descripcion.textContent = `Elige una lección de ${materia.nombre} y aprende paso a paso.`;
}
function actualizarUrl(materia) {
  const url = new URL(location.href);
  url.searchParams.set('materia', materia.id_materia);
  history.replaceState({}, '', url);
}
function mostrarMateriaGeneral() {
  const titulo = $('titulo-principal');
  const descripcion = $('descripcion-principal');
  if (titulo) titulo.textContent = '¡VAMOS A APRENDER!';
  if (descripcion) descripcion.textContent = 'Elige una materia, descubre una lección y practica con preguntas divertidas.';
}
async function cargarMaterias() {
  try {
    const datos = await pedir('materias');
    estado.materias = datos.materias || [];
    const contenedor = $('materias');
    contenedor.replaceChildren();
    estado.materias.forEach(materia => {
      const tarjeta = nodo('button', '', 'tile');
      tarjeta.type = 'button';
      tarjeta.append(
        nodo('span', materia.nombre === 'Español' ? '📖' : '🧮', 'tile-emoji'),
        nodo('strong', materia.nombre),
        nodo('small', materia.descripcion || '¡Vamos a aprender!')
      );
      tarjeta.addEventListener('click', () => seleccionarMateria(materia));
      contenedor.append(tarjeta);
    });
    if (!estado.materias.length) contenedor.append(nodo('p', 'Todavía no hay materias disponibles.'));
    const id = new URLSearchParams(location.search).get('materia');
    if (id) {
      const materia = estado.materias.find(m => String(m.id_materia) === id);
      if (materia) await seleccionarMateria(materia);
      else informar('No encontramos esa materia. Puedes elegir otra.');
    }
  } catch (error) { $('materias').replaceChildren(); informar(error.message); }
}
async function seleccionarMateria(materia) {
  const version = ++estado.version;
  estado.materia = materia;
  estado.leccion = null;
  estado.lecciones = [];
  actualizarUrl(materia);
  tituloMateria(materia);
  $('bloque-actividad').hidden = true;
  $('bloque-lecciones').hidden = false;
  $('titulo-lecciones').textContent = `Lecciones de ${materia.nombre}`;
  $('lecciones').replaceChildren(nodo('p', 'Cargando lecciones…'));
  informar();
  try {
    const datos = await pedir('lecciones', {materia: materia.id_materia});
    if (version !== estado.version) return;
    estado.lecciones = datos.lecciones || [];
    const contenedor = $('lecciones');
    contenedor.replaceChildren();
    estado.lecciones.forEach((leccion, indice) => {
      const tarjeta = nodo('button', '', 'tile');
      tarjeta.type = 'button';
      const marca = leccionCompletada(leccion) ? ' ✓ Completada' : '';
      tarjeta.append(
        nodo('span', `LECCIÓN ${indice + 1} · GRADO ${leccion.nivel}`, 'eyebrow'),
        nodo('strong', `${leccion.titulo}${marca}`),
        nodo('small', (leccion.contenido || '').slice(0, 135))
      );
      tarjeta.addEventListener('click', () => abrirLeccion(leccion));
      contenedor.append(tarjeta);
    });
    if (!estado.lecciones.length) contenedor.append(nodo('p', 'Todavía no hay lecciones de esta materia.'));
    $('bloque-lecciones').scrollIntoView({behavior: 'smooth', block: 'start'});
  } catch (error) { if (version === estado.version) { $('lecciones').replaceChildren(); informar(error.message); } }
}
function claveLeccion(leccion) { return `studyai_completada_${leccion.id_leccion}`; }
function leccionCompletada(leccion) {
  try { return localStorage.getItem(claveLeccion(leccion)) !== null; }
  catch { return false; }
}
function guardarProgreso() {
  try {
    localStorage.setItem(claveLeccion(estado.leccion), JSON.stringify({
      aciertos: estado.aciertos, total: estado.actividades.length,
      puntos: estado.puntos, fecha: new Date().toISOString()
    }));
  } catch { /* El navegador puede bloquear almacenamiento local. */ }
}
async function abrirLeccion(leccion) {
  const version = ++estado.version;
  estado.leccion = leccion;
  estado.indice = 0;
  estado.aciertos = 0;
  estado.puntos = 0;
  estado.respondidas = 0;
  estado.esperando = false;
  $('bloque-actividad').hidden = false;
  $('etiqueta-leccion').textContent = `LECCIÓN · GRADO ${leccion.nivel}`;
  $('titulo-actividad').textContent = leccion.titulo;
  $('contenido-leccion').textContent = leccion.contenido || '¡Vamos a practicar!';
  $('actividades').replaceChildren(nodo('p', 'Preparando la lección…'));
  informar();
  try {
    const datos = await pedir('actividades', {leccion: leccion.id_leccion});
    if (version !== estado.version) return;
    estado.actividades = datos.actividades || [];
    mostrarIntroduccion();
    $('bloque-actividad').scrollIntoView({behavior: 'smooth', block: 'start'});
  } catch (error) { if (version === estado.version) { $('actividades').replaceChildren(); informar(error.message); } }
}
function boton(texto, accion, clase = 'btn-study') {
  const b = nodo('button', texto, clase);
  b.type = 'button';
  b.addEventListener('click', accion);
  return b;
}
function mostrarIntroduccion() {
  const caja = $('actividades');
  caja.replaceChildren();

  const explicacion = (estado.leccion.explicacion || '').trim();
  const ejemplo = (estado.leccion.ejemplo || '').trim();

  const panel = nodo('section', '', 'lesson-panel');
  panel.append(nodo('span', '📘 APRENDE PRIMERO', 'eyebrow'));
  panel.append(nodo('h3', 'Vamos paso a paso', 'lesson-panel-title'));
  panel.append(nodo('p', explicacion || 'Por ahora esta lección no tiene explicación completa. Pide al administrador que agregue una.', 'lesson-explanation'));
  if (ejemplo) {
    const cajaEjemplo = nodo('div', '', 'lesson-example');
    cajaEjemplo.append(nodo('strong', '✨ Ejemplo resuelto'));
    cajaEjemplo.append(nodo('p', ejemplo, 'lesson-example-text'));
    panel.append(cajaEjemplo);
  }
  caja.append(panel);
  caja.append(nodo('p', `${estado.actividades.length} pregunta(s) para practicar lo aprendido.`, 'study-muted'));
  const acciones = nodo('div', '', 'study-actions');
  if (estado.actividades.length) acciones.append(boton('¡Entendí! Comenzar ejercicios →', mostrarPregunta));
  else acciones.append(boton('Volver a lecciones', () => seleccionarMateria(estado.materia)));
  caja.append(acciones);
}
function mostrarPregunta() {
  const actividad = estado.actividades[estado.indice];
  if (!actividad) { mostrarResultado(); return; }
  const caja = $('actividades');
  caja.replaceChildren();
  const total = estado.actividades.length;
  const cabecera = nodo('div', '', 'study-progress-head');
  cabecera.append(nodo('strong', `Pregunta ${estado.indice + 1} de ${total}`), nodo('span', `⭐ ${estado.puntos} puntos`));
  const progreso = nodo('div', '', 'study-progress');
  const relleno = nodo('div', '', 'study-progress-fill');
  relleno.style.width = `${(estado.indice / total) * 100}%`;
  progreso.append(relleno);
  const formulario = nodo('form', '', 'question-card');
  const pregunta = nodo('h3', actividad.pregunta);
  const etiqueta = nodo('label', 'Tu respuesta');
  const entrada = document.createElement('input');
  entrada.name = 'respuesta'; entrada.required = true;
  entrada.maxLength = 150; entrada.autocomplete = 'off';
  etiqueta.append(entrada);
  const enviar = nodo('button', 'Comprobar respuesta', 'btn-study');
  enviar.type = 'submit';
  const feedback = nodo('p', '', 'study-feedback');
  feedback.setAttribute('role', 'status');
  const acciones = nodo('div', '', 'study-actions');
  acciones.append(boton('💡 Ver una pista', () => mostrarAyudaLocal('pista', actividad.pregunta)));
  formulario.append(pregunta, etiqueta, enviar, feedback);
  caja.append(cabecera, progreso, formulario, acciones, nodo('div', '', 'study-ai-output'));
  formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    if (estado.esperando) return;
    estado.esperando = true; enviar.disabled = true;
    feedback.textContent = 'Comprobando…';
    try {
      const respuesta = await pedir('responder', {}, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id_actividad: actividad.id_actividad, respuesta: entrada.value})
      });
      if (respuesta.correcta) estado.aciertos++;
      estado.puntos += Number(respuesta.puntos_obtenidos || 0);
      estado.respondidas++;
      feedback.textContent = respuesta.correcta
        ? `¡Muy bien! ⭐ +${respuesta.puntos_obtenidos || 0} puntos.`
        : 'Buen intento. Repasa la explicación y continúa aprendiendo.';
      feedback.className = `study-feedback ${respuesta.correcta ? 'ok' : 'hint'}`;
      entrada.disabled = true;
      enviar.remove();
      const siguiente = boton(
        estado.indice + 1 < estado.actividades.length ? 'Siguiente pregunta →' : 'Ver mis resultados →',
        () => { estado.indice++; mostrarPregunta(); }
      );
      acciones.prepend(siguiente);
    } catch (error) {
      feedback.textContent = error.message;
      enviar.disabled = false;
    } finally { estado.esperando = false; }
  });
}
function mostrarResultado() {
  const total = estado.actividades.length;
  guardarProgreso();
  const caja = $('actividades');
  caja.replaceChildren();
  const porcentaje = total ? Math.round((estado.aciertos / total) * 100) : 0;
  caja.append(
    nodo('div', '🎉', 'study-celebration'),
    nodo('h3', '¡Terminaste esta lección!', 'study-result-title'),
    nodo('p', `${estado.aciertos} de ${total} respuestas correctas · ${porcentaje}% de aciertos`, 'study-summary'),
    nodo('p', `Ganaste ${estado.puntos} puntos ⭐`, 'study-summary')
  );
  const acciones = nodo('div', '', 'study-actions');
  acciones.append(boton('Repetir lección', () => abrirLeccion(estado.leccion)));
  const indice = estado.lecciones.findIndex(l => String(l.id_leccion) === String(estado.leccion.id_leccion));
  const siguiente = estado.lecciones[indice + 1];
  if (siguiente) acciones.append(boton('Siguiente lección →', () => abrirLeccion(siguiente)));
  else acciones.append(boton('Volver a las lecciones', () => seleccionarMateria(estado.materia)));
  caja.append(acciones);
}
/* Ayuda educativa local: no usa IA ni servicios externos. */
function mostrarAyudaLocal(tipo, pregunta = '') {
  const contenedor = $('actividades').querySelector('.study-ai-output');
  if (!contenedor || !estado.leccion) return;
  if (tipo === 'explicacion') {
    contenedor.replaceChildren(
      nodo('strong', '📚 Repasemos la lección'),
      nodo('p', estado.leccion.explicacion || estado.leccion.contenido || 'Lee despacio y vuelve a intentarlo.'),
      nodo('p', estado.leccion.ejemplo || 'Practica paso a paso.')
    );
    return;
  }
  const nombre = (estado.materia?.nombre || '').toLocaleLowerCase('es');
  const titulo = (estado.leccion.titulo || '').toLocaleLowerCase('es');
  let pista = 'Lee con calma la pregunta y busca las palabras importantes.';
  if (nombre.includes('matem')) {
    if (titulo.includes('suma')) pista = 'Para sumar, empieza con el primer número y cuenta hacia adelante tantas veces como indica el segundo.';
    else if (titulo.includes('resta')) pista = 'Para restar, parte del número mayor y cuenta hacia atrás.';
    else if (titulo.includes('multiplica')) pista = 'Una multiplicación es una suma de grupos iguales. Por ejemplo, 3 × 2 es 2 + 2 + 2.';
    else pista = 'Identifica la operación y resuelve el cálculo en pasos pequeños.';
  } else if (titulo.includes('vocal')) pista = 'Recuerda: las cinco vocales son A, E, I, O y U.';
  else if (titulo.includes('sinónimo')) pista = 'Busca una palabra que signifique casi lo mismo.';
  contenedor.replaceChildren(nodo('strong', '💡 Pista de StudyAI'), nodo('p', pista));
}
cargarMaterias();
