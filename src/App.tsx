import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BedDouble, Check, ChevronRight, CircleHelp, Clock, ExternalLink, FileText, Heart, House, Info, Languages, List, LockKeyhole, Map as MapIcon, MapPin, Menu, Navigation, Phone, RotateCcw, Search, ShieldCheck, ShowerHead, Thermometer, Users, Utensils, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ResourceMap from './ResourceMap';
import { filterResources, parseFavorites, readPreference, resources, savePreference } from './resources';
import type { Category, Filter, Locale, Resource } from './resources';

type View = 'welcome' | 'home' | 'questions' | 'results' | 'favorites' | 'more' | `detail/${string}`;
const categoryIcons: Record<Category, LucideIcon> = { food: Utensils, sleep: BedDouble, shower: ShowerHead };

function initialView(): View {
  const hash = window.location.hash.slice(1);
  if (['welcome', 'home', 'results', 'favorites', 'more'].includes(hash)) return hash as View;
  if (hash.startsWith('detail/') && resources.some(resource => `detail/${resource.id}` === hash)) return hash as View;
  return readPreference('sjd-welcomed') === 'true' ? 'home' : 'welcome';
}

function Brand() {
  return <div className="brand" aria-label="Sant Joan de Déu, Serveis Socials Barcelona"><strong className="brand-mark">SJD</strong><span><b>Sant Joan de Déu</b><br />Serveis Socials · Barcelona</span></div>;
}

function Emergency({ locale }: { locale: Locale }) {
  return <aside className="emergency" aria-label={locale === 'es' ? 'Teléfonos de emergencia' : "Telèfons d'emergència"}>
    <div><a href="tel:112"><Phone size={13} /> {locale === 'es' ? 'Emergencias' : 'Emergències'} <b>112</b></a><span>·</span><a href="tel:900703030">CUESB <b>900 703 030</b></a></div>
    <a href="tel:900900120">{locale === 'es' ? 'Atención a las mujeres en situación de violencia' : 'Atenció a les dones en situació de violència'} <b>900 900 120</b></a>
  </aside>;
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => readPreference('sjd-language') === 'ca' ? 'ca' : 'es');
  const [view, setView] = useState<View>(initialView);
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [filters, setFilters] = useState<Filter[]>(['open']);
  const [mode, setMode] = useState<'map' | 'list'>('map');
  const [favoriteIds, setFavoriteIds] = useState(() => parseFavorites(readPreference('sjd-favorites')));
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([0, 0, 0]);
  const [announcement, setAnnouncement] = useState('');
  const mainRef = useRef<HTMLElement>(null);
  const t = (es: string, ca: string) => locale === 'es' ? es : ca;
  const categoryLabel = (value: Category | 'all') => ({ food: t('Comer', 'Menjar'), sleep: 'Dormir', shower: t('Ducharme', 'Dutxar-me'), all: t('Todos los recursos', 'Tots els recursos') })[value];
  const matching = filterResources(resources, category, deferredQuery, filters);
  const favorites = resources.filter(resource => favoriteIds.includes(resource.id));
  const detail = view.startsWith('detail/') ? resources.find(resource => `detail/${resource.id}` === view) : undefined;
  const selectedMap = matching.find(resource => resource.id === selectedMapId);
  const CategoryIcon = category === 'all' ? Search : categoryIcons[category];

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#questions') setView('questions');
      else setView(initialView());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    savePreference('sjd-language', locale);
  }, [locale]);

  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [view]);

  useEffect(() => {
    if (!announcement) return;
    const timeout = window.setTimeout(() => setAnnouncement(''), 4000);
    return () => window.clearTimeout(timeout);
  }, [announcement]);

  function navigate(next: View) {
    setView(next);
    window.location.hash = next;
    setAnnouncement('');
  }

  function toggleFavorite(resource: Resource) {
    const removing = favoriteIds.includes(resource.id);
    const next = removing ? favoriteIds.filter(id => id !== resource.id) : [...favoriteIds, resource.id];
    setFavoriteIds(next);
    savePreference('sjd-favorites', JSON.stringify(next));
    setAnnouncement(removing ? t('Eliminado de favoritos', 'Eliminat de preferits') : t('Añadido a favoritos', 'Afegit a preferits'));
  }

  function startSearch(nextCategory: Category | 'all', area = '') {
    setCategory(nextCategory);
    setQuery(area);
    setFilters(['open']);
    setSelectedMapId(null);
    navigate('results');
  }

  function startQuestions(nextCategory: Category) {
    setCategory(nextCategory);
    setQuery('');
    setStep(0);
    setAnswers([0, 0, 0]);
    navigate('questions');
  }

  function nextQuestion(skip = false) {
    if (step < 2) setStep(step + 1);
    else {
      setFilters(!skip && answers[2] === 1 ? ['open', 'direct'] : ['open']);
      setAnswers([0, 0, 0]);
      setSelectedMapId(null);
      navigate('results');
    }
  }

  function favoriteButton(resource: Resource) {
    const saved = favoriteIds.includes(resource.id);
    const label = saved ? t('Quitar de favoritos', 'Treure de preferits') : t('Guardar en favoritos', 'Desar a preferits');
    return <button className="icon-button favorite-button" aria-label={`${label}: ${resource.name}`} title={label} aria-pressed={saved} onClick={() => toggleFavorite(resource)}><Heart size={22} fill={saved ? 'currentColor' : 'none'} /></button>;
  }

  function statusBadge(resource: Resource) {
    const statusText = { open: t('Abierto', 'Obert'), closed: t('Cerrado', 'Tancat'), full: t('Sin plazas', 'Sense places') }[resource.status];
    return <span className={`status ${resource.status}`}><span />{statusText}</span>;
  }

  function accessBadge(resource: Resource) {
    return <span className={`access-badge ${resource.direct ? 'direct' : 'referral'}`}>{resource.direct ? <Check size={18} /> : <FileText size={17} />}{resource.direct ? t('Acceso directo', 'Accés directe') : t('Con derivación', 'Amb derivació')}</span>;
  }

  function directions(resource: Resource, full = false) {
    return <a className={full ? 'outline-button' : 'icon-button directions'} href={`https://www.google.com/maps/dir/?api=1&destination=${resource.coordinates.join(',')}&travelmode=walking`} target="_blank" rel="noopener noreferrer" aria-label={`${t('Cómo llegar a', 'Com arribar a')} ${resource.name} (${t('nueva pestaña', 'pestanya nova')})`} title={t('Cómo llegar · ubicación de ejemplo', "Com arribar · ubicació d'exemple")}><Navigation size={20} />{full && t('Ir', 'Anar')}</a>;
  }

  function phoneButton() {
    return <button className="outline-button" disabled title={t('Teléfono del centro pendiente de verificar', 'Telèfon del centre pendent de verificar')}><Phone size={18} />{t('Llamar', 'Trucar')}</button>;
  }

  function resourceCard(resource: Resource) {
    return <article className={`resource-card ${resource.category}`} key={resource.id}>
      <header className="resource-card-header"><div className="card-topline">{statusBadge(resource)}{favoriteButton(resource)}</div><h2>{resource.name}</h2></header>
      <div className="resource-card-body">
        <div className="address-row"><div><h3>{resource.address}</h3><p className="muted small">{t('A', 'A')} {resource.minutes} min {t('andando · estimación de ejemplo', "a peu · estimació d'exemple")}</p></div>{directions(resource)}</div>
        {accessBadge(resource)}
        <p className="eyebrow">{t('Servicios', 'Serveis')}</p>
        <ul className="service-list">{resource.services.map(service => <li key={service.es}><Info size={16} />{service[locale]}</li>)}</ul>
        <p className="verification"><CircleHelp size={15} />{t('Datos de ejemplo · pendientes de validar', "Dades d'exemple · pendents de validar")}</p>
        <div className="card-actions">{phoneButton()}<button className="primary" onClick={() => navigate(`detail/${resource.id}`)}>{t('Más información', 'Més informació')}</button></div>
      </div>
    </article>;
  }

  function languageSelector() {
    return <div className="languages" role="group" aria-label="Idioma">
      <button className="language" lang="ca" aria-pressed={locale === 'ca'} onClick={() => setLocale('ca')}><span>CA</span>Català</button>
      <button className="language" lang="es" aria-pressed={locale === 'es'} onClick={() => setLocale('es')}><span>ES</span>Castellano</button>
    </div>;
  }

  if (view === 'welcome') return <main className="app-shell welcome">
    <Brand />
    <section className="welcome-content"><h1>{t('Te damos la bienvenida', 'Et donem la benvinguda')}</h1><h2>{t('Elige tu idioma', 'Tria el teu idioma')}</h2><p>{t('Puedes cambiarlo cuando quieras.', 'Pots canviar-lo quan vulguis.')}<br />{t('No hace falta registrarte.', 'No cal registrar-te.')}</p>{languageSelector()}</section>
    <button className="primary welcome-continue" onClick={() => { savePreference('sjd-welcomed', 'true'); navigate('home'); }}>{t('Continuar', 'Continuar')}</button>
  </main>;

  const question = [
    { title: t('¿Cuándo lo necesitas?', 'Quan ho necessites?'), options: [t('Hoy', 'Avui'), t('Estoy buscando información', 'Estic buscant informació')], descriptions: [t('Consultar los recursos disponibles', 'Consultar els recursos disponibles'), t('Conocer los servicios y cómo acceder', 'Conèixer els serveis i com accedir-hi')] },
    { title: t('¿Para quién buscas ayuda?', 'Per a qui busques ajuda?'), options: [t('Para mí', 'Per a mi'), t('Para otra persona', 'Per a una altra persona')], descriptions: [t('Quiero consultar los recursos', 'Vull consultar els recursos'), t('Quiero acompañar a alguien', 'Vull acompanyar algú')] },
    { title: t('¿Qué acceso prefieres?', 'Quin accés prefereixes?'), options: [t('Ver todos los recursos', 'Veure tots els recursos'), t('Sin derivación', 'Sense derivació')], descriptions: [t('Consultar las condiciones de cada centro', 'Consultar les condicions de cada centre'), t('Solo recursos con acceso directo', 'Només recursos amb accés directe')] },
  ][step];

  return <div className={`app-shell ${view === 'questions' || detail ? 'without-nav' : 'with-nav'}`}>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); mainRef.current?.focus(); }}>{t('Saltar al contenido', 'Saltar al contingut')}</a>
    {!detail && view !== 'questions' && <Emergency locale={locale} />}
    <div className="demo-banner"><Info size={13} /><span>{t('Prototipo · Datos de ejemplo, no disponibilidad real', "Prototip · Dades d'exemple, no disponibilitat real")}</span></div>
    <main id="main-content" ref={mainRef} tabIndex={-1}>
      {view === 'home' && <div className="page-content home-page">
        <Brand />
        <h1>{t('¿Qué necesitas ahora?', 'Què necessites ara?')}</h1>
        <div className="need-list">{(['food', 'sleep', 'shower'] as Category[]).map(value => {
          const Icon = categoryIcons[value];
          const descriptions = { food: t('Comedores y apoyo alimentario', 'Menjadors i suport alimentari'), sleep: t('Acogida y alojamiento nocturno', 'Acollida i allotjament nocturn'), shower: t('Higiene, ropa y cuidado personal', 'Higiene, roba i cura personal') };
          return <button key={value} className={`need-option ${value}`} onClick={() => startQuestions(value)}><span className="need-icon"><Icon size={25} /></span><span><b>{categoryLabel(value)}</b><small>{descriptions[value]}</small></span><ChevronRight size={20} /></button>;
        })}</div>
        <form className="area-search" onSubmit={event => { event.preventDefault(); startSearch('all', query); }}>
          <label htmlFor="home-area">{t('¿Prefieres buscar por zona?', 'Prefereixes cercar per zona?')}</label>
          <div className="search-input"><MapPin size={21} /><input id="home-area" value={query} onChange={event => setQuery(event.target.value)} placeholder="Raval, Sants, 08001..." autoComplete="off" list="areas" /><button className="icon-button" aria-label={t('Buscar por zona', 'Cercar per zona')} title={t('Buscar por zona', 'Cercar per zona')}><ArrowRight size={20} /></button></div>
        </form>
        <section className="cold-notice"><div className="cold-title"><span><Thermometer size={24} /></span><div><h2>{t('Ola de frío', 'Onada de fred')}</h2><p>{t('Aviso de ejemplo', "Avís d'exemple")}</p></div></div><div className="quick-links"><button onClick={() => startSearch('food')}><Utensils size={15} />{categoryLabel('food')}</button><button onClick={() => startSearch('shower')}><ShowerHead size={15} />{t('Ducha', 'Dutxa')}</button><button onClick={() => startSearch('all', 'Meridiana')}><House size={15} />{t('Centro de día', 'Centre de dia')}</button></div></section>
      </div>}

      {view === 'questions' && <div className="question-page">
        <header className="question-header"><div><button className="icon-button" onClick={() => step ? setStep(step - 1) : navigate('home')} aria-label={t('Volver', 'Tornar')} title={t('Volver', 'Tornar')}><ArrowLeft size={21} /></button><span className="question-category"><CategoryIcon size={23} />{categoryLabel(category)}</span><small>{3 - step} {step === 2 ? t('paso restante', 'pas restant') : t('pasos restantes', 'passos restants')}</small></div><progress max={3} value={step + 1} aria-label={t('Progreso', 'Progrés')} /><p>{categoryLabel(category)} · {t('Preferencias de búsqueda', 'Preferències de cerca')}</p></header>
        <section className="question-content" aria-labelledby="question-title"><h1 id="question-title">{question.title}</h1><p className="privacy-note"><LockKeyhole size={15} />{t('Tus respuestas son anónimas y no se guardan.', 'Les teves respostes són anònimes i no es desen.')}</p><div className="question-options" role="group" aria-label={question.title}>{question.options.map((option, index) => <button key={`${step}-${index}`} className="question-option" aria-pressed={answers[step] === index} onClick={() => setAnswers(answers.map((value, position) => position === step ? index : value))}><b>{option}</b><small>{question.descriptions[index]}</small>{answers[step] === index && <Check size={20} />}</button>)}</div></section>
        <footer className="question-footer"><button className="primary" onClick={() => nextQuestion()}>{step === 2 ? t('Ver recursos', 'Veure recursos') : t('Siguiente', 'Següent')}</button><button className="text-button" onClick={() => nextQuestion(true)}>{t('Omitir', 'Ometre')}</button></footer>
      </div>}

      {view === 'results' && <div className={`results-page ${mode}`}>
        <div className="results-controls"><div className="results-search"><button className="icon-button" onClick={() => navigate('home')} aria-label={t('Volver al inicio', "Tornar a l'inici")} title={t('Volver', 'Tornar')}><ArrowLeft size={21} /></button><div className="search-input"><Search size={20} /><input aria-label={t('Buscar por zona o nombre', 'Cercar per zona o nom')} value={query} onChange={event => { setQuery(event.target.value); setSelectedMapId(null); }} placeholder={t('Zona, código postal o centro', 'Zona, codi postal o centre')} list="areas" />{query && <button className="icon-button" onClick={() => setQuery('')} aria-label={t('Borrar búsqueda', 'Esborrar cerca')} title={t('Borrar búsqueda', 'Esborrar cerca')}><X size={17} /></button>}</div></div>
          <label className="category-select"><CategoryIcon size={18} /><select aria-label={t('Tipo de recurso', 'Tipus de recurs')} value={category} onChange={event => { setCategory(event.target.value as Category | 'all'); setSelectedMapId(null); }}>{(['all', 'food', 'sleep', 'shower'] as const).map(value => <option key={value} value={value}>{categoryLabel(value)}</option>)}</select></label>
          <div className="view-switch" role="group" aria-label={t('Vista de resultados', 'Vista de resultats')}><button aria-pressed={mode === 'map'} onClick={() => setMode('map')}><MapIcon size={20} />{t('Mapa', 'Mapa')}</button><button aria-pressed={mode === 'list'} onClick={() => setMode('list')}><List size={20} />{t('Lista', 'Llista')}</button></div>
          <div className="filters" role="group" aria-label={t('Filtros', 'Filtres')}>{(['open', 'direct', 'near', 'appointment', 'accessible'] as Filter[]).map(filter => {
            const labels: Record<Filter, string> = { open: t('Abierto ahora', 'Obert ara'), direct: t('Sin derivación', 'Sense derivació'), near: t('A <15 min', 'A <15 min'), appointment: t('Sin cita previa', 'Sense cita prèvia'), accessible: t('Accesible', 'Accessible') };
            return <button key={filter} aria-pressed={filters.includes(filter)} onClick={() => { setFilters(filters.includes(filter) ? filters.filter(value => value !== filter) : [...filters, filter]); setSelectedMapId(null); }}>{labels[filter]}</button>;
          })}</div>
        </div>
        <p className="result-count" role="status">{matching.length} {matching.length === 1 ? t('recurso de ejemplo', "recurs d'exemple") : t('recursos de ejemplo', "recursos d'exemple")}</p>
        {!matching.length ? <section className="empty-state"><Search size={38} /><h1>{t('No hay resultados', 'No hi ha resultats')}</h1><p>{t('Prueba otra zona o cambia los filtros.', 'Prova una altra zona o canvia els filtres.')}</p><button className="outline-button" onClick={() => { setQuery(''); setFilters([]); setCategory('all'); }}><RotateCcw size={18} />{t('Restablecer búsqueda', 'Restablir cerca')}</button></section> : mode === 'list' ? <div className="resource-list">{matching.map(resourceCard)}</div> : <div className="map-area"><ResourceMap items={matching} selectedId={selectedMapId} onSelect={setSelectedMapId} locale={locale} />{selectedMap ? <div className="map-selection"><button className="icon-button close-selection" onClick={() => setSelectedMapId(null)} aria-label={t('Cerrar ficha del mapa', 'Tancar fitxa del mapa')} title={t('Cerrar ficha', 'Tancar fitxa')}><X size={18} /></button>{resourceCard(selectedMap)}</div> : <button className="map-summary" onClick={() => setSelectedMapId(matching[0].id)}><span className="sheet-handle" /><strong>{matching.length} {matching.length === 1 ? t('lugar encontrado', 'lloc trobat') : t('lugares encontrados', 'llocs trobats')}</strong><span>{matching[0].name}<ChevronRight size={18} /></span><small>{t('A', 'A')} {matching[0].minutes} min · {t('Ejemplo', 'Exemple')}</small></button>}</div>}
      </div>}

      {view === 'favorites' && <div className="page-content favorites-page"><h1>{t('Mis favoritos', 'Els meus preferits')}</h1><p className="muted favorite-count" role="status">{favorites.length} {favorites.length === 1 ? t('guardado', 'desat') : t('guardados', 'desats')}</p>{favorites.length ? <div className="resource-list">{favorites.map(resourceCard)}</div> : <section className="empty-state"><Heart size={42} /><h2>{t('Aún no tienes favoritos', 'Encara no tens preferits')}</h2><p>{t('Tus recursos guardados aparecerán aquí.', 'Els teus recursos desats apareixeran aquí.')}</p><button className="primary" onClick={() => startSearch('all')}><Search size={18} />{t('Buscar recursos', 'Cercar recursos')}</button></section>}</div>}

      {detail && <div className="detail-page"><header className="detail-header"><div className="detail-tools"><button className="icon-button" onClick={() => navigate('results')} aria-label={t('Volver a resultados', 'Tornar als resultats')} title={t('Volver', 'Tornar')}><ArrowLeft size={23} /></button>{favoriteButton(detail)}</div><div className="detail-status">{statusBadge(detail)}<span><Clock size={15} />{detail.hours} · {t('ejemplo', 'exemple')}</span></div><h1>{detail.name}</h1><p>{t('Recurso de demostración · Barcelona', 'Recurs de demostració · Barcelona')}</p><div className="card-actions">{directions(detail, true)}{phoneButton()}</div></header>
        <div className="detail-sections"><section><h2>{t('Cómo entrar', 'Com entrar-hi')}</h2>{accessBadge(detail)}<p>{detail.direct ? t('En este ejemplo, el acceso es directo. Confirma las condiciones antes de desplazarte.', "En aquest exemple, l'accés és directe. Confirma les condicions abans de desplaçar-te.") : t('Un profesional de Servicios Sociales tiene que derivarte. Consulta tu Centro de Servicios Sociales más cercano.', 'Un professional de Serveis Socials ha de fer la derivació. Consulta el teu Centre de Serveis Socials més proper.')}</p></section><section><h2>{t('A quién atiende', 'A qui atén')}</h2><p className="icon-text"><Users size={20} />{detail.audience[locale]}</p></section><section><h2>{t('Qué necesitas llevar', 'Què necessites portar')}</h2><ul className="service-list">{detail.requirements.map(requirement => <li key={requirement.es}><Check size={18} />{requirement[locale]}</li>)}</ul></section><section><h2>{t('Servicios', 'Serveis')}</h2><ul className="service-list">{detail.services.map(service => <li key={service.es}><Info size={17} />{service[locale]}</li>)}</ul></section><section><h2>{t('Horario y días de apertura', "Horari i dies d'obertura")}</h2><p className="muted small">{t('Horario ilustrativo, pendiente de confirmar', 'Horari il·lustratiu, pendent de confirmar')}</p><dl className="schedule">{(locale === 'es' ? ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] : ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge']).map(day => <div key={day}><dt>{day}</dt><dd>{detail.hours}</dd></div>)}</dl></section><section><h2>{t('Dónde está', 'On és')}</h2><p className="icon-text"><MapPin size={20} />{detail.address}</p>{directions(detail, true)}</section><section className="data-warning"><ShieldCheck size={22} /><p>{t('Datos de demostración. Dirección, servicios, horarios y acceso deben ser validados por la entidad. No se muestran plazas en tiempo real.', "Dades de demostració. L'adreça, els serveis, els horaris i l'accés han de ser validats per l'entitat. No es mostren places en temps real.")}</p></section></div>
      </div>}

      {view === 'more' && <div className="page-content more-page"><h1>{t('Más', 'Més')}</h1><section><h2><CircleHelp size={21} />{t('Cómo usar la aplicación', 'Com utilitzar l’aplicació')}</h2><ol><li>{t('Elige una necesidad o busca por zona, código postal o centro.', 'Tria una necessitat o cerca per zona, codi postal o centre.')}</li><li>{t('En los resultados, alterna entre mapa y lista y combina los filtros.', 'Als resultats, alterna entre mapa i llista i combina els filtres.')}</li><li>{t('Abre un recurso para consultar su ficha y pulsa el corazón para guardarlo en favoritos.', 'Obre un recurs per consultar-ne la fitxa i prem el cor per desar-lo als preferits.')}</li><li>{t('Cambia el idioma aquí. Tus favoritos y el idioma solo se guardan en este navegador.', 'Canvia l’idioma aquí. Els preferits i l’idioma només es desen en aquest navegador.')}</li></ol><p>{t('Los recursos y horarios son ejemplos: no indican disponibilidad real.', 'Els recursos i horaris són exemples: no indiquen disponibilitat real.')}</p></section><section><h2><Languages size={21} />{t('Idioma', 'Idioma')}</h2>{languageSelector()}</section><section><h2><LockKeyhole size={21} />{t('Privacidad', 'Privacitat')}</h2><p>{t('No necesitas cuenta. Solo guardamos tu idioma y tus favoritos en este navegador. Las respuestas del cuestionario no se guardan ni se envían.', 'No necessites cap compte. Només desem el teu idioma i els teus preferits en aquest navegador. Les respostes del qüestionari no es desen ni s’envien.')}</p><p>{t('El mapa carga imágenes de OpenStreetMap. Los enlaces de ruta abren Google Maps, con sus propias políticas de privacidad.', "El mapa carrega imatges d'OpenStreetMap. Els enllaços de ruta obren Google Maps, amb les seves polítiques de privacitat.")}</p></section><section><h2><Info size={21} />{t('Sobre los datos', 'Sobre les dades')}</h2><p>{t('Esta versión reproduce el prototipo de Figma con un catálogo de ejemplo. No realiza derivaciones ni confirma disponibilidad. Las preguntas de orientación son provisionales y necesitan validación de SJD.', "Aquesta versió reprodueix el prototip de Figma amb un catàleg d'exemple. No fa derivacions ni confirma disponibilitat. Les preguntes d'orientació són provisionals i necessiten validació de SJD.")}</p><a className="external-link" href="https://www.figma.com/proto/28XOjWkxBIimmpnFduSHYw/SJDD_WebApp_v1?node-id=13-2&page-id=5%3A3" target="_blank" rel="noopener noreferrer">{t('Prototipo original', 'Prototip original')}<ExternalLink size={16} /></a></section><button className="outline-button" onClick={() => navigate('welcome')}><RotateCcw size={18} />{t('Volver a la bienvenida', 'Tornar a la benvinguda')}</button></div>}
    </main>
    <datalist id="areas"><option value="Raval" /><option value="Sants" /><option value="Barceloneta" /><option value="Sant Andreu" /><option value="08001" /></datalist>
    {!detail && view !== 'questions' && <nav className="bottom-nav" aria-label={t('Navegación principal', 'Navegació principal')}>{([
      { id: 'home', label: t('Inicio', 'Inici'), Icon: House },
      { id: 'results', label: t('Buscar', 'Cercar'), Icon: Search },
      { id: 'favorites', label: t('Favoritos', 'Preferits'), Icon: Heart },
      { id: 'more', label: t('Más', 'Més'), Icon: Menu },
    ] as const).map(({ id, label, Icon }) => <button key={id} aria-current={view === id ? 'page' : undefined} onClick={() => navigate(id)}><span><Icon size={24} /></span>{label}</button>)}</nav>}
    <div className={`toast ${announcement ? 'visible' : ''}`} role="status">{announcement && <><Check size={19} />{announcement}</>}</div>
  </div>;
}