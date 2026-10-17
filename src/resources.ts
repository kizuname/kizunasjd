import { catalog } from './resourceData';

export type Locale = 'es' | 'ca';
export type Category = 'food' | 'sleep' | 'shower';
export type Localized = Record<Locale, string>;
export type Filter = 'open' | 'direct' | 'appointment';
export type Status = 'open' | 'closed' | 'unknown';

// days: 0 = lunes ... 6 = domingo. Sin `to`, el horario solo indica la hora de inicio.
export interface Slot {
  days: number[];
  from: string;
  to?: string;
}

export interface Resource {
  id: string;
  name: string;
  organization: string;
  sample?: boolean;
  category: Category;
  address: string;
  area: string;
  coordinates?: [number, number];
  phone?: string;
  metro?: string;
  bus?: string;
  direct: boolean;
  appointment: boolean;
  services: Localized[];
  schedule: Slot[];
  hoursText: Localized;
  audience: Localized;
  access: Localized;
}

export const resources: Resource[] = catalog;

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function madridNow(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const value = (type: string) => parts.find(part => part.type === type)?.value ?? '';
  return { day: weekdays.indexOf(value('weekday')), minutes: Number(value('hour')) * 60 + Number(value('minute')) };
}

export function resourceStatus(resource: Resource, now = new Date()): Status {
  const { day, minutes } = madridNow(now);
  const today = resource.schedule.filter(slot => slot.days.includes(day));
  if (today.some(slot => slot.to && minutes >= toMinutes(slot.from) && minutes < toMinutes(slot.to))) return 'open';
  if (today.some(slot => !slot.to && minutes >= toMinutes(slot.from))) return 'unknown';
  if (!resource.schedule.length) return 'unknown';
  return 'closed';
}

export function daySchedule(resource: Resource, day: number, closed: string, from: string) {
  const slots = resource.schedule.filter(slot => slot.days.includes(day)).sort((a, b) => toMinutes(a.from) - toMinutes(b.from));
  if (!slots.length) return closed;
  return slots.map(slot => slot.to ? `${slot.from} - ${slot.to}` : `${from} ${slot.from}`).join(' · ');
}

const statusOrder: Record<Status, number> = { open: 0, unknown: 1, closed: 2 };

export function filterResources(items: Resource[], category: Category | 'all', query: string, filters: Filter[], now = new Date()) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return items.filter(resource => {
    if (category !== 'all' && resource.category !== category) return false;
    const searchable = normalize(`${resource.name} ${resource.organization} ${resource.address} ${resource.area}`);
    if (!words.every(word => searchable.includes(word))) return false;
    return filters.every(filter => {
      switch (filter) {
        case 'open': return resourceStatus(resource, now) === 'open';
        case 'direct': return resource.direct;
        case 'appointment': return !resource.appointment;
      }
    });
  }).sort((first, second) => statusOrder[resourceStatus(first, now)] - statusOrder[resourceStatus(second, now)] || Number(!!first.sample) - Number(!!second.sample) || first.name.localeCompare(second.name, 'ca'));
}

export function readPreference(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function savePreference(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch {}
}

export function parseFavorites(value: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(value ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((id): id is string => typeof id === 'string' && resources.some(resource => resource.id === id)))];
  } catch { return []; }
}
