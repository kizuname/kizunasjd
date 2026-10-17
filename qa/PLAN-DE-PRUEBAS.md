# Plan de pruebas de SJD

## Alcance y criterio

Prueba funcional de la version 0.1.0 contra README y SPEC, mediante Playwright
en el navegador integrado expuesto por MCP. Sin cambios funcionales en la app.
Catalogo de demostracion: ocho recursos; no se comprueba disponibilidad real.
Fecha de inicio: 16 de octubre de 2026 (hora local).

Cada caso se calificara PASS, FAIL o BLOCKED con resultado observado.
PASS requiere comprobar el comportamiento, no solo abrir la pantalla.
La cobertura se refiere a este inventario; no garantiza ausencia de defectos.

## Entorno

- Windows, Node 24.18.0, npm 11.16.0.
- Vite en http://127.0.0.1:5173, React 19.
- Navegador de la herramienta MCP: se registrara su user agent.
- Escritorio 1440x1000, movil 390x844 y movil estrecho 320x740.
- Almacenamiento local controlado exclusivamente para este origen de pruebas.
- No se activan enlaces telefonicos ni se navega a Google Maps/Figma.
  Se verifican sus contratos href, target y rel.

## Inventario de pantallas y estados

| Pantalla | Estados |
|---|---|
| Bienvenida | Primera visita, ES, CA, continuar, regreso desde Mas |
| Inicio | Tres necesidades, busqueda, accesos rapidos, emergencias |
| Cuestionario | Pasos 1/2/3, alternativas, atras, omitir, acceso directo |
| Resultados | Mapa/lista, categorias, cinco filtros, busqueda, vacio |
| Detalle | Los ocho recursos, servicios, requisitos, horario, ruta, favorito |
| Favoritos | Vacio, guardar, quitar, recarga, almacenamiento malformado |
| Mas | Idioma, privacidad, datos, enlace al prototipo, bienvenida |

## Matriz prevista

| Grupo | Comprobaciones | Requisitos |
|---|---|---|
| A - Acceso | Primera visita; ES/CA; lang; persistencia; continuar; bienvenida omitida tras recarga | FR-01 a FR-04 |
| B - Busqueda | Zona/CP/nombre; mayusculas/tildes/espacios; varias palabras; limpiar; orden; categorias | FR-05 a FR-08, FR-10 a FR-12 |
| C - Filtros | Cada filtro y combinacion de los cinco; abierto excluye cerrado/sin plazas; vacio y restablecer | FR-09 a FR-12 |
| D - Cuestionario | Tres necesidades; tres preguntas; atras conserva opcion; respuestas neutrales; directo; omitir en cada paso; recarga de ruta | FR-05, FR-15 a FR-17, FR-25 |
| E - Mapa | Marcadores; seleccion/cierre; resumen; zoom; cambio lista; fallo de teselas y recuperacion por lista | FR-13, FR-14 |
| F - Detalle | Ocho fichas; acceso; servicios; publico; requisitos; siete dias; direccion; ruta; llamada desactivada; advertencia | FR-18 a FR-21 |
| G - Favoritos | Guardar desde lista/detalle; quitar; anuncio; persistencia; IDs invalidos/duplicados; almacenamiento bloqueado | FR-22 a FR-26 |
| H - Navegacion y UX | Menu; atras/adelante; rutas invalidas; enlaces emergencia; teclado; foco; estados anunciados | Navegacion y accesibilidad basica |
| I - Adaptacion | Todas las pantallas en movil y escritorio; anchura 320; desbordamiento; capturas | README: adaptacion movil/escritorio |
| J - Traduccion | Siete pantallas en CA; cuestionario completo; etiquetas y dias; persistencia | FR-01 a FR-04 |

## Evidencias y reproducibilidad

Se guardaran capturas PNG y un informe con casos ejecutados, esperado/observado,
incidencias reproducibles, limitaciones y correspondencia con los requisitos.
Se conservara tambien un guion Playwright reutilizable.
Las pruebas unitarias existentes y `npm.cmd run build` son validacion adicional,
no sustituyen las interacciones E2E por MCP.

## Limites y riesgos

No hay backend, cuentas, API ni datos operativos. No se prueban flujos inexistentes.
Mapa y fuentes dependen de terceros; se separaran fallos ambientales de defectos.
La revision de accesibilidad es basica (no certificacion WCAG).
Un unico motor de navegador no equivale a cobertura Chrome/Firefox/WebKit.
No se ejecutan pruebas de carga, pentesting ni llamadas reales.
No se corrigen incidencias funcionales en esta tarea: se documentan.
