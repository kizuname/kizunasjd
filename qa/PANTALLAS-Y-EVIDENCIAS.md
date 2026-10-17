# Pantallas y evidencias

54 capturas PNG de esta ejecucion. Las imagenes son full-page salvo indicacion
contraria; algunas pierden 15 px de ancho por la barra de desplazamiento.
No hay capturas de escritorio validadas: ver el bloqueo en el
[informe](INFORME-DE-PRUEBAS.md).

## 1. Bienvenida, inicio y estados de resultados

| Captura | Pantalla / estado | Casos relacionados |
|---|---|---|
| [01-bienvenida-es](capturas/01-bienvenida-es.png) | Bienvenida ES inicial | A01 |
| [02-bienvenida-ca](capturas/02-bienvenida-ca.png) | Bienvenida CA tras recarga | A02, A03 |
| [03-inicio-movil](capturas/03-inicio-movil.png) | Inicio, necesidades y avisos | A04, B06, B07 |
| [04-favoritos-vacio](capturas/04-favoritos-vacio.png) | Favoritos vacios | G01 |
| [05-resultados-lista](capturas/05-resultados-lista.png) | Lista de seis abiertos | B01 |
| [06-resultados-vacio](capturas/06-resultados-vacio.png) | Busqueda inexistente | C01, C02 |
| [07-filtros-combinados](capturas/07-filtros-combinados.png) | Cinco filtros activos | C04 |
| [08-cuestionario-paso-1](capturas/08-cuestionario-paso-1.png) | Cuando necesitas ayuda | D01 |
| [09-cuestionario-paso-2](capturas/09-cuestionario-paso-2.png) | Para quien | D01 |
| [10-cuestionario-paso-3](capturas/10-cuestionario-paso-3.png) | Preferencia de acceso | D02 |
| [11-resultados-mapa](capturas/11-resultados-mapa.png) | Mapa con seis abiertos | E01 |
| [12-mapa-seleccion](capturas/12-mapa-seleccion.png) | Ficha de Meridiana en mapa | E02-meridiana, E03 |
| [13-mapa-sin-red](capturas/13-mapa-sin-red.png) | Fallo de teselas inducido | E07, E08 |
| [14-favoritos-guardados](capturas/14-favoritos-guardados.png) | Dos favoritos | G03, G04 |
| [15-mas-es](capturas/15-mas-es.png) | Mas ES, privacidad y datos | H02 |

## 2. Pantallas en catalan

| Captura | Estado | Casos |
|---|---|---|
| [16-mas-ca](capturas/16-mas-ca.png) | Idioma, privacidad y datos CA | J01, J02 |
| [17-inicio-ca](capturas/17-inicio-ca.png) | Inicio CA | J03 |
| [ca-pregunta-1](capturas/ca-pregunta-1.png) | Primera pregunta CA | J04-1 |
| [ca-pregunta-2](capturas/ca-pregunta-2.png) | Segunda pregunta CA | J04-2 |
| [ca-pregunta-3](capturas/ca-pregunta-3.png) | Tercera pregunta CA | J04-3 |
| [18-resultados-ca](capturas/18-resultados-ca.png) | Dos recursos de higiene CA | J05 |
| [19-detalle-ca](capturas/19-detalle-ca.png) | Detalle y dias CA | J06 |
| [20-favoritos-ca](capturas/20-favoritos-ca.png) | Favoritos vacios CA | J07 |

Bienvenida CA tambien esta documentada en la captura 02.

## 3. Los ocho detalles

Todos incluyen contenido descriptivo, acceso, servicios, publico, requisitos,
horario de siete dias, direccion y aviso de datos de ejemplo.
Ninguno incluye categoria ni minutos en el detalle (INC-03).

| Recurso | Captura | Acceso / estado de ejemplo |
|---|---|---|
| Menjador Social del Raval | [Detalle](capturas/detalle-raval-food.png) | Directo / abierto |
| Centro de Acogida Nocturna | [Detalle](capturas/detalle-night-shelter.png) | Derivado / abierto |
| Centro de Dia Meridiana | [Detalle](capturas/detalle-meridiana.png) | Directo / abierto |
| Espai de dutxes Raval | [Detalle](capturas/detalle-raval-shower.png) | Directo / abierto |
| Menjador Poble-sec | [Detalle](capturas/detalle-poble-sec-food.png) | Derivado / sin plazas |
| Espai d'acollida Sants | [Detalle](capturas/detalle-sants-sleep.png) | Directo / abierto |
| Menjador Barri Gotic | [Detalle](capturas/detalle-gothic-food.png) | Directo / cerrado |
| Espai d'acollida Barceloneta | [Detalle](capturas/detalle-barceloneta-sleep.png) | Directo / abierto |

Casos F01 y F02 parametrizados por el ID del recurso en el CSV.

## 4. Adaptacion movil: veinte estados

Cada celda corresponde a un caso I-anchura-estado. Se midio el viewport real,
el ancho del documento y el contenedor. PASS significa sin overflow horizontal
y contenedor no superior a 480 px, no una certificacion visual completa.

| Estado | 320x740 | 390x844 |
|---|---|---|
| Bienvenida | [Captura](capturas/responsive-320-bienvenida.png) | [Captura](capturas/responsive-390-bienvenida.png) |
| Inicio | [Captura](capturas/responsive-320-inicio.png) | [Captura](capturas/responsive-390-inicio.png) |
| Pregunta 1 | [Captura](capturas/responsive-320-pregunta-1.png) | [Captura](capturas/responsive-390-pregunta-1.png) |
| Pregunta 2 | [Captura](capturas/responsive-320-pregunta-2.png) | [Captura](capturas/responsive-390-pregunta-2.png) |
| Pregunta 3 | [Captura](capturas/responsive-320-pregunta-3.png) | [Captura](capturas/responsive-390-pregunta-3.png) |
| Mapa | [Captura](capturas/responsive-320-mapa.png) | [Captura](capturas/responsive-390-mapa.png) |
| Lista | [Captura](capturas/responsive-320-lista.png) | [Captura](capturas/responsive-390-lista.png) |
| Detalle | [Captura](capturas/responsive-320-detalle.png) | [Captura](capturas/responsive-390-detalle.png) |
| Favoritos vacios | [Captura](capturas/responsive-320-favoritos.png) | [Captura](capturas/responsive-390-favoritos.png) |
| Mas | [Captura](capturas/responsive-320-mas.png) | [Captura](capturas/responsive-390-mas.png) |

En esta secuencia se usa Comer y su unico recurso abierto para lista y detalle.
Las listas completas y otros detalles estan cubiertos en las secciones anteriores.

## 5. Evidencia especifica de incidencias

| Incidencia | Captura | Observacion |
|---|---|---|
| INC-01 | [Omitir](capturas/incidencia-01-omitir.png) | Tras Omitir sigue el cuestionario, ahora en pregunta 2 |
| INC-02 | [Recarga](capturas/incidencia-02-recarga-cuestionario.png) | Inicio mostrado tras recargar questions; URL registrada en informe |
| INC-03 | Ocho capturas de detalle, seccion 3 | Ausencia de categoria y minutos |
| INC-04 | [Marcadores](capturas/incidencia-04-marcadores.png) | Solapamiento Raval; hit-test y timeout documentados en informe |

Una captura aislada no prueba una transicion ni permite ver la URL completa:
debe leerse junto con el caso y el resultado de la comprobacion Playwright.
