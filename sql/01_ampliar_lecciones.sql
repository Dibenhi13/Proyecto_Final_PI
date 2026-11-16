-- StudyAI: AMPLIACION SEGURA. Ejecutar UNA SOLA VEZ sobre la BD studyai existente.
-- No borra tablas, usuarios, progreso ni preguntas.
USE studyai;

ALTER TABLE lecciones
  ADD COLUMN explicacion TEXT NULL AFTER contenido,
  ADD COLUMN ejemplo TEXT NULL AFTER explicacion;

UPDATE lecciones SET explicacion = 'Las vocales son cinco letras muy importantes: A, E, I, O y U.
Las usamos para formar palabras y para poder leerlas.

Paso 1. Di cada vocal en voz alta: A, E, I, O, U.
Paso 2. Busca las vocales dentro de palabras conocidas.
Paso 3. Recuerda que una palabra puede tener varias vocales.', ejemplo = '🍎 ÁRBOL comienza con A.
🐘 ELEFANTE comienza con E.
🏝️ ISLA comienza con I.
🐻 OSO comienza con O.
🍇 UVA comienza con U.

En la palabra CASA encontramos dos vocales: A y A.' WHERE titulo = 'Las vocales';
UPDATE lecciones SET explicacion = 'Los sinónimos son palabras que tienen un significado igual o parecido.
Nos ayudan a escribir sin repetir siempre la misma palabra.

Paso 1. Lee una palabra y piensa qué significa.
Paso 2. Busca otra que exprese una idea similar.
Paso 3. Comprueba que puedes usarla en una frase con un sentido parecido.', ejemplo = 'Feliz → contento 😊
Rápido → veloz 🏃
Bonito → hermoso 🌷

Ejemplo: “El niño está feliz” y “El niño está contento” significan casi lo mismo.' WHERE titulo = 'Sinónimos';
UPDATE lecciones SET explicacion = 'Sumar significa juntar cantidades para saber cuántos elementos tenemos en total.
El símbolo de la suma es + y el signo = indica el resultado.

Paso 1. Observa el primer número.
Paso 2. Agrega la cantidad que indica el segundo número.
Paso 3. Cuenta todo para encontrar el resultado.

Puedes usar dedos, dibujos o fichas para contar.', ejemplo = '🍎 🍎  +  🍎 🍎 🍎  =  🍎 🍎 🍎 🍎 🍎

2 + 3 = 5

Si tienes 2 manzanas y te regalan 3 más, ahora tienes 5 manzanas.

Otro ejemplo: 3 + 4 = 7. Empieza en 3 y cuenta cuatro más: 4, 5, 6, 7.' WHERE titulo = 'Sumas básicas';
UPDATE lecciones SET explicacion = 'Multiplicar es una forma rápida de sumar varias veces la misma cantidad.
El símbolo × significa “por”.

Paso 1. Identifica cuántos grupos hay.
Paso 2. Observa cuántos elementos tiene cada grupo.
Paso 3. Suma los elementos de todos los grupos o multiplica.

Recuerda que 3 × 5 significa tres grupos de cinco.', ejemplo = '⭐ ⭐ ⭐ ⭐ ⭐
⭐ ⭐ ⭐ ⭐ ⭐
⭐ ⭐ ⭐ ⭐ ⭐

3 × 5 = 5 + 5 + 5 = 15

Si tenemos tres bolsas con cinco dulces cada una, tenemos 15 dulces en total.' WHERE titulo = 'Multiplicaciones';

