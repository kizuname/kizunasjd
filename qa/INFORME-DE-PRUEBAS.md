# Informe de pruebas funcionales SJD

**Fecha:** 16/10/2026, sesion iniciada a las 00:33 CEST.  
**Version:** `sjd-webapp` 0.1.0.  
**Resultado:** NO APTO para dar por cerrada la validacion completa.
Hay cuatro incidencias funcionales/UX y la cobertura de escritorio esta bloqueada.
No se ha modificado el codigo funcional ni corregido las incidencias.

## 1. Entregables y resumen

- [Plan de pruebas](PLAN-DE-PRUEBAS.md).
- [Matriz individual de resultados, CSV](RESULTADOS.csv).
- [Indice de las 54 capturas](PANTALLAS-Y-EVIDENCIAS.md).
- [Guion auxiliar Playwright para las 20 comprobaciones de anchura movil](recorrido.playwright.mjs).

| Grupo | Casos | PASS | FAIL | BLOCKED |
|---|---:|---:|---:|---:|
| A. Acceso e idioma inicial | 5 | 5 | 0 | 0 |
| B. Busqueda, categorias y accesos rapidos | 12 | 12 | 0 | 0 |
| C. Filtros y estados vacios | 8 | 8 | 0 | 0 |
| D. Cuestionario | 11 | 8 | 3 | 0 |
| E. Mapa y cambio a lista | 9 | 8 | 1 | 0 |
| F. Ocho fichas de detalle | 16 | 8 | 8 | 0 |
| G. Favoritos y almacenamiento | 9 | 9 | 0 | 0 |
| H. Navegacion y teclado | 8 | 8 | 0 | 0 |
| I. Adaptacion de pantallas | 30 | 20 | 0 | 10 |
| J. Pantallas en catalan | 10 | 10 | 0 | 0 |
| **Total planificado** | **118** | **96** | **12** | **10** |

Se ejecutaron **108 casos**; 10 quedaron bloqueados/no ejecutados por el entorno.
Los 12 FAIL corresponden a **4 incidencias unicas**, no a 12 defectos distintos.
Cada ficha cuenta como un caso de contenido y otro de categoria/minutos.
Las diez verificaciones internas de cada caso F01 no inflan el total.
Los reintentos de sincronizacion tampoco se cuentan como nuevos casos.

Validaciones adicionales:

| Comando | Resultado |
|---|---|
| `npm.cmd test` | 7/7 pruebas unitarias, un archivo, PASS |
| `npm.cmd run build` | TypeScript sin errores y build Vite correcto |
| `node --check .\qa\recorrido.playwright.mjs` | Sintaxis correcta |
| GET `http://127.0.0.1:5173` | HTTP 200 |

## 2. Entorno y metodo real

- Windows; Node 24.18.0; npm 11.16.0.
- Servidor de desarrollo Vite, origen `http://127.0.0.1:5173`.
- Herramientas MCP disponibles del navegador integrado: `openBrowserPage`,
  `runPlaywrightCode`, `screenshotPage`. Interacciones con `page` de Playwright,
  locators accesibles, comprobaciones DOM y capturas PNG persistidas.
- User agent: Chrome/150.0.7871.250, Electron/43.7.7, VS Code/1.142.0.
  No se ha utilizado una matriz independiente de navegadores.
- Viewports **reales** comprobados: 320x740 y 390x844.
- Las capturas full-page pueden medir 305/375 px de ancho por la barra de
  desplazamiento de 15 px. Su alto incluye el contenido, no solo el viewport.
- No hay backend ni autenticacion que probar. Catalogo fijo de ocho ejemplos.
- Solo se modificaron las preferencias del origen local de pruebas. Al finalizar:
  idioma ES, favoritos `[]`, bienvenida completada y sin flag de bloqueo de storage.
- No se activaron telefonos ni se abrieron los destinos Google Maps/Figma.
  Se inspeccionaron sus atributos, coordenadas y modo de ruta.
- La cartografia se cargo normalmente y despues se bloqueo de forma deliberada
  mediante `page.route`/`route.abort`; la interceptacion se retiro al terminar.

### Bloqueo de escritorio

`page.setViewportSize({width:1440,height:1000})` devuelve una configuracion de
1440x1000, pero `page.evaluate(() => ({w:innerWidth,h:innerHeight}))`
devuelve **638x443** en el navegador integrado. Se observo tambien que una captura
PNG de 1440x1000 puede contener contenido maquetado a 638 px: el tamano del archivo
no demuestra un viewport de escritorio.

Se intento una pagina de contexto Playwright independiente. El entorno rechazo
su creacion por la afinidad de almacenamiento exigida para las vistas de navegador.
No se eludio esa restriccion. Se retiraron las capturas experimentales de escritorio
para no presentarlas como evidencia valida.

Por ello los diez casos I-1440 son BLOCKED; solo se intento la primera pantalla.
El resto no se ejecuto tras detectar el bloqueo. Deben repetirse en un navegador
MCP con viewport de escritorio efectivo antes de cerrar la validacion.

## 3. Pantallas y comportamientos verificados

| Pantalla | Comportamiento comprobado | Evidencia principal |
|---|---|---|
| Bienvenida | Primera visita; ES/CA; `html.lang`; persistencia; continuar; retorno desde Mas | [ES](capturas/01-bienvenida-es.png), [CA](capturas/02-bienvenida-ca.png) |
| Inicio | Tres necesidades; busqueda CP; accesos Comer/Ducha/Centro de dia; enlaces de emergencia | [Inicio](capturas/responsive-390-inicio.png), [CA](capturas/17-inicio-ca.png) |
| Cuestionario | Tres pasos y categorias; opciones; retroceso; omision; acceso directo; sin persistir respuestas | [Paso 1](capturas/08-cuestionario-paso-1.png), [2](capturas/09-cuestionario-paso-2.png), [3](capturas/10-cuestionario-paso-3.png) |
| Resultados | Orden; texto normalizado; cuatro categorias; cinco filtros individuales y juntos; contador; vacio; restablecer | [Lista](capturas/05-resultados-lista.png), [Vacio](capturas/06-resultados-vacio.png), [Filtros](capturas/07-filtros-combinados.png) |
| Mapa | Seis marcadores abiertos; seleccion y cierre; resumen; detalle; zoom relativo; error de teselas; lista alternativa | [Mapa](capturas/11-resultados-mapa.png), [Seleccion](capturas/12-mapa-seleccion.png), [Sin red](capturas/13-mapa-sin-red.png) |
| Detalle | Las ocho fichas; direccion; acceso directo/derivado; publico; requisitos; servicios; siete dias; advertencias; llamada desactivada; rutas | [Ejemplo directo](capturas/detalle-raval-food.png), [Derivado](capturas/detalle-night-shelter.png) |
| Favoritos | Vacio; guardar desde lista y detalle; quitar; anuncio; recarga; JSON roto; IDs invalidos/duplicados | [Vacio](capturas/04-favoritos-vacio.png), [Guardados](capturas/14-favoritos-guardados.png) |
| Mas | Idioma; privacidad; limites del catalogo; enlace al prototipo; regreso a bienvenida | [ES](capturas/15-mas-es.png), [CA](capturas/16-mas-ca.png) |

### Busqueda y filtros: oraculos concretos

- Abiertos: Raval comida (6), Raval ducha (8), Barceloneta (14),
  Acogida Nocturna (18), Meridiana (22), Sants (28), en ese orden.
- Sin filtros: 8 recursos; comida 3, dormir 3, ducha 2.
- Consulta `"  RÁVAL   08001 "`: exactamente los dos recursos del Raval.
- Consulta `GOTIC`, desactivando abiertos: exactamente Barri Gotic, cerrado.
- Filtros individuales sin restricciones adicionales:
  abierto 6, directo 6, menos de 15 minutos 5, sin cita 7, accesible 5.
- Los cinco filtros juntos: solo Menjador Social del Raval.
- Restablecer tras vacio: texto vacio, categoria `all`, ningun filtro, 8 recursos.

### Detalles: alcance de F01 y F02

Cada F01 comprueba diez aspectos: nombre, direccion, publico destinatario,
requisitos, al menos dos servicios, siete filas de horario, advertencia de que
no hay plazas en tiempo real, llamada desactivada, enlaces de ruta y acceso.
Las dos rutas de cada ficha contienen las coordenadas del recurso,
`travelmode=walking`, `target=_blank` y proteccion `noopener`.

Cada F02 comprueba aparte categoria y minutos. Ambos faltan en las ocho fichas.
La lista si muestra los minutos; eso no satisface el requisito de detalle FR-18.

### Privacidad y almacenamiento: alcance real

- JSON malformado produce favoritos vacios sin romper la interfaz.
- `["meridiana","meridiana",17,"unknown","raval-food"]` produce dos favoritos validos.
- Se bloquearon tanto `Storage.prototype.getItem` como `setItem`, y se verifico
  que `getItem` lanzara `SecurityError` antes de aceptar el resultado.
- Con almacenamiento bloqueado se pudo guardar un favorito y cambiar a CA durante
  la sesion; tras recargar se perdieron ambas preferencias, tal como se documenta.
  Despues se retiro el flag de inyeccion y se recargo para restaurar Storage.
- Durante el flujo alternativo del cuestionario solo aparecieron las claves
  `sjd-favorites`, `sjd-language`, `sjd-welcomed`; ninguna peticion no GET.
  Esto es una comprobacion acotada del flujo, no una auditoria completa de red.
- En los grupos con listener `pageerror` (ocho detalles y privacidad/storage)
  no se observaron excepciones de pagina. No se afirma monitorizacion exhaustiva
  de consola de toda la sesion.

## 4. Incidencias reproducibles

### INC-01 - Omitir no abandona el cuestionario

**Severidad funcional: media.** Casos D04-paso-1 y D04-paso-2. FR-17.

1. Inicio > Comer.
2. En la primera pregunta, pulsar Omitir.
3. Repetir en la segunda pregunta.

**Esperado:** llegar a resultados con `open`, sin `direct`, conforme al plan y
a la especificacion de omitir el cuestionario.  
**Observado:** pasa a la pregunta 2, luego a la 3; solo el tercer Omitir abre resultados.

[Captura tras primer Omitir](capturas/incidencia-01-omitir.png).
La funcion `nextQuestion` en [App.tsx](../src/App.tsx) incrementa el paso antes de
considerar la salida; `skip` solo afecta a los filtros del ultimo paso.
Si el producto pretende omitir solo una pregunta, debe aclararlo en el texto y
en la especificacion en vez de dar por valido el requisito actual.

### INC-02 - Recargar questions muestra Inicio con URL de cuestionario

**Severidad funcional: media.** Caso D06. Contrato de navegacion.

1. Inicio > cualquier necesidad.
2. Confirmar URL `#questions`.
3. Recargar el navegador.

**Esperado:** pantalla de cuestionario coherente con la URL o una redireccion
explicita/normalizada si se decide reiniciar el flujo.  
**Observado:** heading "¿Que necesitas ahora?" de Inicio, pero URL `#questions`.

[Captura](capturas/incidencia-02-recarga-cuestionario.png).
`initialView` en [App.tsx](../src/App.tsx) no admite `questions`, mientras
que el manejador de `hashchange` si lo admite. No se exige persistir respuestas:
el defecto es la discrepancia entre navegacion inicial y navegacion en sesion.

### INC-03 - Faltan categoria y minutos en las ocho fichas

**Severidad funcional: media.** Ocho casos F02. FR-18.

1. Abrir cualquier recurso en Mas informacion, o directamente `#detail/raval-food`.
2. Revisar cabecera y secciones del detalle.

**Esperado:** categoria y minutos estimados, ademas del contenido descriptivo.  
**Observado:** nombre, horario, direccion y secciones presentes, pero no la etiqueta
de categoria ni el tiempo a pie. Se repite en los ocho recursos.

[Raval](capturas/detalle-raval-food.png), [Meridiana](capturas/detalle-meridiana.png).
La rama de detalle de [App.tsx](../src/App.tsx) no renderiza esos campos.

### INC-04 - Solapamiento de marcadores impide seleccionar Raval al centro

**Severidad UX: baja.** Caso E02-raval. FR-13, limitacion de seleccion tactil.

1. Viewport real 390x844.
2. Buscar > Mapa, con los seis abiertos por defecto.
3. Pulsar el centro del marcador de Menjador Social del Raval.

**Esperado:** seleccionar ese recurso sin forzar la accion.  
**Observado:** el marcador de Espai de dutxes intercepta el puntero. El click
Playwright normal agota 10 s. Comprobacion adicional con `elementFromPoint`
en el centro (x=220, y=628.5): devuelve el marcador de Espai de dutxes.

[Captura](capturas/incidencia-04-marcadores.png).
No se uso `force: true` para convertir el fallo en PASS.
Hay alternativas funcionales: resumen del primer recurso, lista o ampliar el mapa.
El marcador de Meridiana, no solapado, si abre su ficha.
Valorar agrupacion/desambiguacion de marcadores en [ResourceMap.tsx](../src/ResourceMap.tsx).

## 5. Cobertura frente a requisitos

| Requisitos | Evidencia/casos | Resultado |
|---|---|---|
| FR-01 a FR-04 | A01-A05, J01-J08 | PASS dentro de las comprobaciones de traduccion descritas |
| FR-05 | D02, D03, B07 | PASS |
| FR-06, FR-07 | B02, B04, B06, B07 | PASS: nombre/zona/CP y normalizacion; no todas las cadenas posibles |
| FR-08 | B05, C02 | PASS |
| FR-09 | C03, C04 | PASS: cinco individuales y una combinacion; no todas las 32 combinaciones |
| FR-10 | B06, D02, D03, D05 | PASS |
| FR-11 | B01 | PASS en los seis abiertos |
| FR-12 | C01, C02 | PASS |
| FR-13 | E01-E06 | Parcial: INC-04 |
| FR-14 | E07, E08 | PASS, fallo de teselas simulado |
| FR-15, FR-16 | D01-D03, D07, J04 | PASS |
| FR-17 | D04, D05 | FAIL en pasos 1 y 2: INC-01 |
| FR-18 | F01, F02 | Parcial: INC-03 |
| FR-19 a FR-21 | Ocho F01 | PASS: contrato externo; destino no abierto |
| FR-22, FR-23 | G01-G05 | PASS |
| FR-24 | G06, G07 y pruebas unitarias | PASS sobre entradas probadas |
| FR-25 | D07 | PASS acotado al flujo observado |
| FR-26 | G08, G09 | PASS con error de lectura/escritura simulado |
| Navegacion por hash | H03, H04, D06 | Parcial: INC-02 |
| Adaptacion movil/escritorio | I-* | 20 PASS movil; 10 BLOCKED escritorio |

## 6. Accesibilidad, red y falsos positivos descartados

- Se comprobaron activacion por Enter, avance por Tab, salto al contenido y foco
  en `main` al cambiar de pantalla; no es certificacion WCAG ni prueba con lector.
- Se verificaron atributos de seleccion de idioma, opciones y filtros,
  contadores `role=status`, anuncio de favorito y llamada desactivada.
- Un primer selector de busqueda uso `textbox`; el input tiene `datalist` y su
  rol accesible es `combobox`. Se corrigio el guion; no es defecto de la app.
- El primer C02 consulto el DOM antes de completarse `useDeferredValue`.
  Se repitio esperando el contador de ocho recursos: PASS confirmado.
- La primera prueba de zoom asumio nivel inicial 13; `fitBounds` puede empezar en
  otro nivel. Se repitio con nivel relativo y se comprobo 13 -> 14 -> 13.
- Una primera preparacion del bloqueo de storage hizo navegacion solo por hash,
  sin ejecutar el init script. Se repitio con recarga completa y se comprobo
  explicitamente `SecurityError` antes de validar G08/G09.
- Los eventos `ERR_ABORTED` al desmontar mapas o abortar teselas deliberadamente
  no se clasifican por si solos como bugs de disponibilidad.
- La importacion dinamica de un modulo desde `runPlaywrightCode` no esta soportada
  en este entorno. Los bloques se ejecutaron inline; el modulo auxiliar se
  conserva para reutilizacion, con sintaxis validada, no como suite completa
  automaticamente ejecutada desde el disco.

## 7. Repeticion y cierre

1. Desde la raiz, iniciar `npm.cmd run dev -- --port 5173 --strictPort`.
2. Abrir el origen con `openBrowserPage`; usar el `pageId` devuelto.
3. Consultar [RESULTADOS.csv](RESULTADOS.csv): cada fila incluye entrada/accion,
   esperado y observado. Los IDs parametrizados se cuentan individualmente.
4. Usar locators por rol/nombre y esperar estados finales; por ejemplo:

```javascript
await page.getByRole('combobox', { name: 'Buscar por zona o nombre' }).fill('08001');
await page.locator('.result-count').filter({ hasText: '2 recursos' }).waitFor();
```

5. Para repetir las 20 comprobaciones de anchura, copiar la funcion de
   [recorrido.playwright.mjs](recorrido.playwright.mjs) al bloque MCP quitando
   `export`, e invocarla con el `page` proporcionado y una carpeta absoluta:
   `await responsiveScreens(page, 'C:\\ruta\\SJD\\qa\\capturas')`.
   Tambien puede importarse desde un runner Playwright propio existente.
   No se instalaron dependencias Playwright ni un runner nuevo en el proyecto.
6. Repetir los cuatro defectos con las instrucciones de la seccion 4.
7. Repetir escritorio cuando `innerWidth/innerHeight` coincidan con lo solicitado.
8. Criterio de cierre recomendado: corregir/redefinir INC-01 a INC-03, resolver o
   aceptar expresamente INC-04 y completar escritorio y regresion.

**No cubierto:** Firefox, WebKit, dispositivos fisicos, zoom de texto/contraste
WCAG exhaustivo, rendimiento/carga, seguridad ofensiva, datos operativos,
funcionamiento real de telefonos, rutas externas ni disponibilidad de los centros.
Las capturas son evidencia del estado observado, no comparacion pixel a pixel
con Figma ni prueba visual automatizada con baseline.
