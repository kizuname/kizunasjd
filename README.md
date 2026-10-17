# SJD · Serveis Socials Barcelona

Primera versión funcional de la aplicación web basada en [SJDD_WebApp_v1](https://www.figma.com/proto/28XOjWkxBIimmpnFduSHYw/SJDD_WebApp_v1?node-id=13-2&page-id=5%3A3).

## Ejecutar

Requiere Node.js 22.12 o superior (verificado con Node.js 24).

```powershell
npm.cmd install
npm.cmd run dev
```

Abrir la dirección indicada por Vite, normalmente http://127.0.0.1:5173. Si el puerto está ocupado, Vite selecciona otro automáticamente. En Windows se usa `npm.cmd` para evitar bloqueos de `npm.ps1`; en otros sistemas, usar `npm`.

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

La compilación genera `dist/`, que puede alojarse en cualquier servidor de archivos estáticos. La navegación usa fragmentos de URL y no requiere reglas de redirección.

## Fuente y publicación separadas

La rama `source` conserva el proyecto editable. No contiene workflows de GitHub Actions y subir cambios aquí no publica la aplicación. No mezclar esta rama con `main` ni cambiar la configuración de Pages sin validar antes un despliegue separado.

La rama `main` conserva los archivos compilados de la web actual: https://kizuname.github.io/kizunasjd/. El geolocalizador independiente sigue en https://kizuname.github.io/kizunasjd/kizuna_geolocalizador.html. No se cambia la rama predeterminada ni el origen de Pages al incorporar el fuente.

Esta es una copia del fuente local actual, incluidos sus cambios pendientes. No se garantiza que reproduzca exactamente el compilado publicado. Una publicación futura requiere compilación, pruebas y aprobación independientes. `node_modules/`, `dist/` y secretos no forman parte de esta rama.

Validación del 17/10/2026: las 13 pruebas de Vitest pasan, pero la comprobación TypeScript falla porque `App.tsx` todavía usa propiedades como `status`, `minutes`, `hours` y `requirements` ausentes del modelo `Resource`, además de otros errores relacionados. Por tanto, esta copia de trabajo no está lista para compilar ni desplegar. La web publicada es independiente de estos errores; no se ha sustituido por esta copia.

## Respaldo y recuperación

Versión publicada antes de incorporar el fuente:

- Commit: `66524fea2773b732b9f0bf33adc92ca022225990`.
- Etiqueta de respaldo: `pages-backup-2026-10-17`.

Subir `source` no requiere restaurar nada: no modifica `main`. Si una publicación futura rompe la web, estos comandos restauran los archivos respaldados mediante un nuevo commit, sin reescribir el historial. Ejecutarlos solo tras aprobar la recuperación, desde una carpeta nueva y sin cambios locales:

```powershell
git clone --branch main --single-branch https://github.com/kizuname/kizunasjd.git kizunasjd-recovery
cd kizunasjd-recovery
git fetch origin tag pages-backup-2026-10-17
git restore --source=pages-backup-2026-10-17 --staged --worktree -- .
git diff --cached --stat
git commit -m "Restore backed-up Pages site"
git push origin main
```

Si no hay diferencias, no es necesario crear el commit. La recuperación presupone que Pages sigue publicando desde `main` y su carpeta raíz. Esperar a que termine Pages y comprobar ambas URLs; una etiqueta por sí sola no vuelve a publicar el sitio.

## Cómo usar la aplicación

Al abrir el sitio, elige castellano o catalán y pulsa **Continuar**. Después puedes seleccionar una necesidad (comer, dormir o ducharte) y responder el cuestionario opcional, o buscar directamente por zona, código postal o centro.

En los resultados, cambia entre **Mapa** y **Lista**, ajusta la categoría y los filtros, y abre un recurso para consultar sus datos. Puedes guardar recursos con el icono de corazón; los favoritos y el idioma se guardan solo en ese navegador. La sección **Más** incluye la guía de uso, el cambio de idioma y la información de privacidad.

Importante: es un prototipo con datos de ejemplo, no confirma horarios, plazas ni disponibilidad. Ante una emergencia, usa los teléfonos indicados en la aplicación.

## Incluido

- Bienvenida y cambio de idioma castellano/catalán.
- Inicio con necesidades: comer, dormir y ducha; búsqueda por zona o código postal.
- Cuestionario opcional de preferencias, sin registro ni envío de respuestas.
- Mapa real de Barcelona con Leaflet y OpenStreetMap; selección de marcadores y vista de lista.
- Filtros combinables y estados sin resultados.
- Detalle con condiciones de acceso, servicios, horario ilustrativo y enlace de ruta.
- Favoritos e idioma guardados únicamente en este navegador.
- Navegación por teclado, anuncios de estado y adaptación a móvil y escritorio.

## Datos y límites

**Es un prototipo, no un directorio operativo.** Los ocho recursos son ejemplos: sus nombres, direcciones, coordenadas, horarios, accesibilidad, estados y tiempos a pie no están validados. No representan plazas ni apertura en tiempo real. Los botones de llamada de los centros están desactivados porque no hay teléfonos verificados. Los enlaces de emergencia son independientes de estos datos de ejemplo.

Las pantallas de preguntas del Figma contienen textos provisionales. Se han sustituido por preferencias neutrales para poder probar la navegación. No son criterios de elegibilidad ni una derivación profesional. Solo la preferencia final de acceso directo modifica los filtros; las otras respuestas no excluyen recursos. Deben validarse las preguntas y las reglas con SJD antes de publicar.

No hay backend, autenticación, panel de administración ni sincronización entre dispositivos. No se persisten respuestas del cuestionario. Si el navegador bloquea el almacenamiento, la aplicación sigue funcionando durante la sesión, pero las preferencias no sobreviven a una recarga.

El mapa requiere conexión a OpenStreetMap y debe respetar su [política de uso](https://operations.osmfoundation.org/policies/tiles/). Para producción, valorar un proveedor con capacidad y condiciones adecuadas. Si falla la cartografía, sigue disponible la lista. Las rutas abren Google Maps; los tiempos mostrados son ejemplos, no rutas calculadas. La fuente Roboto se descarga de Google Fonts. No se han exportado los activos originales de marca: el encabezado es una composición tipográfica provisional.

## Pruebas funcionales con Playwright/MCP

La ejecucion del 16/10/2026 esta documentada en [el informe de pruebas](qa/INFORME-DE-PRUEBAS.md),
con [plan](qa/PLAN-DE-PRUEBAS.md), [118 casos y resultados](qa/RESULTADOS.csv)
y [pantallas y capturas](qa/PANTALLAS-Y-EVIDENCIAS.md).
También está disponible el [manual Word con el plan completo, resultados y capturas integradas](qa/MANUAL-Y-PLAN-DE-PRUEBAS-SJD.docx).
Se ejecutaron 108 casos (96 PASS, 12 FAIL correspondientes a cuatro incidencias);
10 comprobaciones de escritorio quedaron bloqueadas por el viewport del navegador integrado.
Los resultados describen el prototipo probado, no la disponibilidad de servicios reales.

## Estructura del codigo

- `src/App.tsx`: pantallas, navegación y textos bilingües.
- `src/ResourceMap.tsx`: mapa interactivo.
- `src/resources.ts`: catálogo tipado, filtros y preferencias locales.
- `src/resources.test.ts`: pruebas de búsqueda y persistencia defensiva.
- `src/styles.css`: estilos basados en el prototipo móvil.

Para pasar a producción, acordar el origen y mantenimiento de los recursos, conectar una API validada, definir disponibilidad y derivaciones con la entidad, sustituir los activos provisionales y revisar accesibilidad y privacidad.