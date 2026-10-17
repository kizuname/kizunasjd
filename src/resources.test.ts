import { describe, expect, it } from 'vitest';
import { daySchedule, filterResources, parseFavorites, resourceStatus, resources } from './resources';

const mondayNoon = new Date('2026-10-19T10:30:00Z'); // lunes 12:30, hora de Madrid
const mondayAfternoon = new Date('2026-10-19T14:00:00Z'); // lunes 16:00
const mondayEvening = new Date('2026-10-19T18:00:00Z'); // lunes 20:00
const byId = (id: string) => resources.find(resource => resource.id === id)!;

describe('resource catalog', () => {
  it('contains the 25 guide resources plus 8 sample ones, with unique ids', () => {
    expect(resources).toHaveLength(33);
    expect(resources.filter(resource => resource.sample)).toHaveLength(8);
    expect(new Set(resources.map(resource => resource.id)).size).toBe(33);
  });

  it('places every fixed resource inside Barcelona', () => {
    const withoutCoordinates = resources.filter(resource => !resource.coordinates);
    expect(withoutCoordinates.map(resource => resource.id)).toEqual(['sopar-ambulant']);
    for (const { coordinates } of resources) {
      if (!coordinates) continue;
      expect(coordinates[0]).toBeGreaterThan(41.32);
      expect(coordinates[0]).toBeLessThan(41.47);
      expect(coordinates[1]).toBeGreaterThan(2.05);
      expect(coordinates[1]).toBeLessThan(2.23);
    }
  });
});

describe('opening status', () => {
  it('uses the Madrid schedule', () => {
    expect(resourceStatus(byId('menjador-navas'), mondayNoon)).toBe('open');
    expect(resourceStatus(byId('menjador-navas'), mondayAfternoon)).toBe('closed');
    expect(resourceStatus(byId('assis'), new Date('2026-10-18T08:30:00Z'))).toBe('open');
  });

  it('does not claim to know the status without an end time or schedule', () => {
    expect(resourceStatus(byId('nueva-vida'), mondayEvening)).toBe('unknown');
    expect(resourceStatus(byId('reina-de-la-paz'), mondayNoon)).toBe('unknown');
  });

  it('describes each day of the week', () => {
    expect(daySchedule(byId('casa-solidaritat'), 1, 'Cerrado', 'desde')).toBe('18:00 - 19:00');
    expect(daySchedule(byId('casa-solidaritat'), 0, 'Cerrado', 'desde')).toBe('Cerrado');
    expect(daySchedule(byId('nueva-vida'), 0, 'Cerrado', 'desde')).toBe('desde 10:00 · desde 19:30');
  });
});

describe('resource search', () => {
  it('filters by need without mixing categories', () => {
    expect(filterResources(resources, 'food', '', [])).toHaveLength(28);
    const sleep = filterResources(resources, 'sleep', '', []);
    expect(sleep).toHaveLength(3);
    expect(sleep.every(resource => resource.category === 'sleep')).toBe(true);
    expect(filterResources(resources, 'shower', '', [])).toHaveLength(2);
  });

  it('handles overnight schedules', () => {
    expect(resourceStatus(byId('night-shelter'), mondayEvening)).toBe('open');
    expect(resourceStatus(byId('night-shelter'), new Date('2026-10-19T03:00:00Z'))).toBe('open');
    expect(resourceStatus(byId('night-shelter'), mondayNoon)).toBe('closed');
  });

  it('shows open resources first and filters by what is open now', () => {
    const all = filterResources(resources, 'all', '', [], mondayNoon);
    expect(resourceStatus(all[0], mondayNoon)).toBe('open');
    const open = filterResources(resources, 'all', '', ['open'], mondayNoon);
    expect(open.length).toBeGreaterThan(0);
    expect(open.every(resource => resourceStatus(resource, mondayNoon) === 'open')).toBe(true);
    expect(open.map(resource => resource.id)).not.toContain('assis');
  });

  it('combines access filters', () => {
    const result = filterResources(resources, 'all', '', ['direct', 'appointment'], mondayNoon);
    expect(result.every(resource => resource.direct && !resource.appointment)).toBe(true);
    expect(result.map(resource => resource.id)).toContain('la-terrasseta');
    expect(result.map(resource => resource.id)).not.toContain('ca-lisidret');
  });

  it('searches areas, postal codes and organizations ignoring case and accents', () => {
    expect(filterResources(resources, 'all', 'GRACIA', []).map(resource => resource.id).sort()).toEqual(['exercit-salvacio', 'la-terrasseta']);
        expect(filterResources(resources, 'all', '  RAVAL   ', []).map(resource => resource.id).sort()).toEqual(['nueva-vida', 'raval-food', 'raval-shower', 'reina-de-la-paz']);
    expect(filterResources(resources, 'all', "sant'egidio", [])).toHaveLength(2);
    expect(filterResources(resources, 'all', '08001', []).length).toBeGreaterThan(1);
  });

  it('returns no matches rather than silently dropping filters', () => {
    expect(filterResources(resources, 'sleep', 'Raval', ['open'])).toEqual([]);
  });
});

describe('favorite persistence', () => {
  it('handles absent or damaged storage', () => {
    for (const value of [null, '{broken', '{}', 'null', '42']) expect(parseFavorites(value)).toEqual([]);
  });

  it('removes duplicate, invalid and unknown resource ids', () => {
    expect(parseFavorites('["assis","assis",17,"unknown","caliu"]')).toEqual(['assis', 'caliu']);
  });
});
