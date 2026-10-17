# Especificación funcional — SJD Serveis Socials Barcelona

**Estado:** extraída del prototipo implementado  
**Versión documentada:** 0.1.0  
**Idioma del documento:** español  
**Enfoque:** Spec-Driven Development (SDD), con separación explícita entre el comportamiento funcional y el contrato OpenAPI.

## 1. Propósito y alcance

Aplicación web para consultar recursos sociales de demostración en Barcelona, explorarlos por necesidad o zona, revisar sus condiciones descriptivas y guardar favoritos localmente. La interfaz está disponible en castellano y catalán.

Esta especificación describe el comportamiento implementado, no una propuesta de producto ni un compromiso de disponibilidad de servicios. Los ocho recursos, sus direcciones, coordenadas, horarios, estados, requisitos y estimaciones de desplazamiento son datos de ejemplo no validados.

### Fuera de alcance de esta versión

- Registro, autenticación, perfiles o administración de recursos.
- Backend, API de consulta, sincronización entre dispositivos o persistencia de respuestas.
- Confirmación de plazas, horarios reales, elegibilidad o derivaciones profesionales.
- Cálculo real de rutas o tiempos de desplazamiento.
- Llamadas a los centros: los teléfonos de estos están pendientes de verificación y el botón correspondiente está desactivado.

## 2. Usuarios y necesidades

| Actor | Necesidad |
|---|---|
| Persona que busca apoyo | Encontrar recursos de comida, alojamiento nocturno o higiene, y entender cómo acceder. |
| Persona que acompaña a alguien | Consultar los mismos recursos y condiciones sin crear una cuenta. |
| Visitante que busca orientación | Explorar el catálogo por zona, nombre o código postal y conservar recursos favoritos en el navegador. |

La aplicación no toma decisiones de elegibilidad ni sustituye la orientación de Servicios Sociales.

## 3. Navegación y pantallas

La navegación principal se representa mediante el fragmento de URL (`#welcome`, `#home`, `#questions`, `#results`, `#favorites`, `#more` y `#detail/{resourceId}`). La pantalla inicial es bienvenida o inicio según la preferencia local `sjd-welcomed`.

| Pantalla | Comportamiento |
|---|---|
| Bienvenida | Permite elegir idioma y continuar al inicio; no requiere registro. |
| Inicio | Ofrece necesidades (comer, dormir, ducha), búsqueda por zona y accesos rápidos de ejemplo. |
| Cuestionario | Presenta tres preguntas opcionales de preferencias, con selección y posibilidad de retroceder u omitir. |
| Resultados | Permite buscar, filtrar, elegir categoría y alternar entre mapa y lista. |
| Detalle | Muestra información descriptiva, condiciones de acceso, servicios, horario ilustrativo y enlace de ruta. |
| Favoritos | Lista recursos guardados en este navegador y permite quitarlos. |
| Más | Permite cambiar idioma e informa sobre privacidad, datos y límites del prototipo. |

Los teléfonos de emergencia se muestran en las pantallas principales: 112, CUESB 900 703 030 y atención a las mujeres en situación de violencia 900 900 120. Son enlaces `tel:` independientes del catálogo de ejemplo.

## 4. Requisitos funcionales

### Idioma y acceso

- **FR-01** La interfaz debe ofrecer castellano (`es`) y catalán (`ca`).
- **FR-02** La selección de idioma debe persistir en el navegador. Si no hay preferencia válida, se usa castellano.
- **FR-03** La aplicación debe permitir consultar sus funciones sin iniciar sesión.
- **FR-04** El idioma del documento HTML debe actualizarse con la selección.

### Búsqueda y catálogo

- **FR-05** El inicio debe permitir iniciar una búsqueda por necesidad: `food` (comer), `sleep` (dormir) o `shower` (ducha/higiene).
- **FR-06** Se debe poder buscar por nombre, dirección, zona o texto de código postal.
- **FR-07** La búsqueda debe ignorar mayúsculas, espacios externos y diacríticos; cada palabra introducida debe aparecer en algún punto del nombre, dirección o zona del recurso.
- **FR-08** La categoría debe poder ser una de las tres necesidades o `all` (todos).
- **FR-09** Los filtros de resultados deben ser combinables: abierto (`open`), acceso directo (`direct`), menos de 15 minutos (`near`), sin cita previa (`appointment`) y accesible (`accessible`).
- **FR-10** Al comenzar una búsqueda desde inicio se debe seleccionar por defecto el filtro `open`; el cuestionario también inicia con este filtro.
- **FR-11** Los resultados deben ordenarse por minutos estimados a pie, de menor a mayor.
- **FR-12** La interfaz debe indicar el número de resultados y mostrar un estado vacío con una acción para restablecer búsqueda, filtros y categoría.
- **FR-13** El modo mapa debe mostrar marcadores seleccionables, controles de zoom y un resumen/ficha del recurso seleccionado. El modo lista debe mostrar las fichas en orden de resultados.
- **FR-14** Si falla la carga de teselas del mapa, debe informarse del fallo y seguir siendo posible consultar la lista.

### Orientación, ficha y navegación externa

- **FR-15** El cuestionario debe presentar las preguntas de cuándo se necesita la ayuda, para quién se busca y preferencia de acceso.
- **FR-16** Solo la respuesta a la pregunta de preferencia de acceso afecta a los resultados: «Sin derivación» añade el filtro `direct`. Las otras respuestas no filtran recursos.
- **FR-17** Omitir el cuestionario debe llevar a resultados sin aplicar el filtro `direct` (se conserva `open`).
- **FR-18** La ficha debe mostrar categoría, dirección, estado de ejemplo, estimación de minutos, modalidad de acceso, servicios, población destinataria, requisitos y horario ilustrativo.
- **FR-19** El enlace «Cómo llegar» debe abrir Google Maps con coordenadas de ejemplo y modo a pie, en otra pestaña.
- **FR-20** El botón para llamar al centro debe permanecer desactivado mientras no exista un teléfono verificado.
- **FR-21** La ficha debe advertir que los datos y la disponibilidad requieren validación y no representan plazas en tiempo real.

### Favoritos y privacidad

- **FR-22** Se debe poder agregar o quitar un recurso de favoritos desde la ficha de resultado o detalle.
- **FR-23** Los favoritos deben persistir en el almacenamiento local del navegador y aparecer en la pantalla de favoritos.
- **FR-24** Al leer favoritos se deben descartar datos malformados, IDs desconocidos y duplicados.
- **FR-25** Las respuestas del cuestionario no se deben guardar ni enviar.
- **FR-26** Si el navegador bloquea el almacenamiento local, la aplicación debe seguir utilizable durante la sesión, aunque idioma y favoritos no sobrevivan a una recarga.

## 5. Flujos principales

### Buscar por necesidad

1. Desde inicio, seleccionar comer, dormir o ducha.
2. Responder las tres preguntas, retroceder si se desea o usar «Omitir».
3. Ver los resultados de la categoría elegida, inicialmente con `open`.
4. La respuesta «Sin derivación» en la tercera pregunta agrega `direct`; las respuestas anteriores solo expresan preferencias y no restringen el catálogo.

### Buscar por zona o nombre

1. Introducir una zona, dirección, nombre o código postal desde inicio o resultados.
2. Iniciar la búsqueda desde inicio, o permitir que los resultados se actualicen al cambiar el texto en la pantalla de resultados.
3. Refinar por categoría y por cualquier combinación de filtros.
4. Restablecer desde el estado vacío elimina el texto, desactiva filtros y selecciona `all`.

### Consultar y guardar un recurso

1. Explorar el resultado en mapa o lista.
2. Abrir la ficha del recurso para consultar datos descriptivos y condiciones de ejemplo.
3. Guardar o quitar el recurso de favoritos; la acción actualiza el estado local y muestra una confirmación.
4. Abrir la ruta externa si se necesita orientación; el destino es una coordenada de ejemplo.

## 6. Modelo funcional de datos

### Recurso (`Resource`)

| Campo | Tipo / valores | Significado |
|---|---|---|
| `id` | `string` | Identificador estable del recurso. |
| `name` | `string` | Nombre mostrado. |
| `category` | `food \| sleep \| shower` | Necesidad principal asociada. |
| `address`, `area` | `string` | Dirección y zona buscables. |
| `coordinates` | `[number, number]` | Latitud y longitud para el mapa y la ruta externa. |
| `minutes` | `number` | Estimación de minutos a pie, no calculada en tiempo real. |
| `status` | `open \| closed \| full` | Estado estático de ejemplo. |
| `direct` | `boolean` | Si el ejemplo indica acceso directo. |
| `appointment` | `boolean` | Si el ejemplo requiere cita. |
| `accessible` | `boolean` | Indicador de accesibilidad del ejemplo. |
| `services` | `Localized[]` | Servicios en castellano y catalán. |
| `hours` | `string` | Horario ilustrativo. |
| `audience` | `Localized` | Población destinataria descrita. |
| `requirements` | `Localized[]` | Requisitos/avisos mostrados en la ficha. |

`Localized` contiene los textos `es` y `ca`. Las categorías, filtros y estados descritos son valores internos del cliente; no constituyen por sí mismos un contrato HTTP.

## 7. Reglas de filtrado

Se incluyen únicamente recursos que satisfacen todas las condiciones activas:

1. Si la categoría no es `all`, debe coincidir con `resource.category`.
2. Todas las palabras de búsqueda deben estar contenidas en la cadena normalizada `name + address + area`.
3. `open`: `status === open`. **No** calcula si el centro está abierto según la hora actual.
4. `direct`: `direct === true`.
5. `near`: `minutes < 15` (15 exactos no cumple).
6. `appointment`: `appointment === false`.
7. `accessible`: `accessible === true`.
8. El orden final es ascendente por `minutes`.

## 8. Requisitos no funcionales y límites observables

- La interfaz debe adaptarse a móvil y escritorio, permitir navegación por teclado y anunciar conteos/confirmaciones mediante regiones de estado accesibles.
- La interfaz y el contenido deben estar disponibles en castellano y catalán.
- El mapa depende de OpenStreetMap y de una conexión a internet; las rutas dependen de Google Maps. Estas integraciones aplican sus propias políticas y disponibilidad.
- El catálogo actual es estático, de ocho elementos empaquetados con la aplicación. No representa un directorio operativo.
- No existe validación operativa de recursos, plazas, horarios, accesibilidad, requisitos ni teléfonos.
- Los textos del cuestionario y el aviso de ola de frío son provisionales/de ejemplo; no son recomendaciones profesionales ni alertas en tiempo real.

## 9. Contrato OpenAPI y relación con SDD

La versión documentada es una aplicación cliente React/Vite que obtiene el catálogo de un módulo estático y no realiza llamadas a una API propia. Por tanto, **no existe un contrato OpenAPI implementado que pueda extraerse**. No se definen endpoints ficticios en esta especificación.

Para mantener el enfoque SDD, los requisitos `FR-*`, las reglas de filtrado y el modelo funcional anterior describen la conducta actual que debe preservarse. Si se incorpora un backend, su contrato OpenAPI deberá acordarse y versionarse por separado, incluyendo como mínimo consulta de recursos, parámetros de filtros/localización, esquema de recurso, paginación si aplica y errores. Ese contrato deberá distinguir los datos verificados de los datos de demostración y no exponer disponibilidad como real sin una fuente validada.

## 10. Criterios de aceptación derivados

- **AC-01** Buscar `GOTIC` devuelve el recurso de Barri Gòtic; la búsqueda no distingue acentos ni mayúsculas.
- **AC-02** Buscar `08001` devuelve los recursos cuyo nombre, dirección o zona incluyen ese texto.
- **AC-03** Combinar categoría y filtros aplica todas las condiciones, sin descartar silenciosamente filtros incompatibles.
- **AC-04** El filtro `near` excluye recursos con `minutes >= 15`; el filtro `open` excluye estados `closed` y `full`.
- **AC-05** Cambiar entre mapa y lista conserva el conjunto de resultados actual.
- **AC-06** Seleccionar «Sin derivación» en la última pregunta activa el filtro `direct`; omitirla no lo activa.
- **AC-07** Un favorito guardado se mantiene tras recargar si el almacenamiento local está disponible; valores corruptos no rompen la pantalla.
- **AC-08** Ninguna pantalla debe presentar como real la disponibilidad, los horarios, las direcciones o los tiempos de ejemplo.
- **AC-09** Si el mapa no carga, la lista sigue disponible y se informa del problema.

## 11. Datos de referencia del prototipo

Las ocho entradas actuales son: `raval-food`, `night-shelter`, `meridiana`, `raval-shower`, `poble-sec-food`, `sants-sleep`, `gothic-food` y `barceloneta-sleep`. Los valores concretos deben tratarse como fixtures de demostración y no como datos operativos.
