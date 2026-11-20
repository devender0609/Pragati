// ===========================================================================
// v0.84.0-c10.2 checkpoint 56 — COMPOSITE SOLIDS, AND THE SURFACE THAT
// DISAPPEARS.
//
// A student can know every formula in Chapter 12 and still get a composite
// surface area wrong, because the error is not arithmetic. When a hemisphere
// is set on a cylinder, the cylinder's top circle and the hemisphere's base
// circle still exist as geometry — they are simply no longer on the outside.
// Counting either one is the defining mistake of this chapter, and it is
// invisible in a drawing.
//
// So the model carries both truths. Every component names its own surfaces,
// a join marks exactly two of them internal, and the exposed set is DERIVED
// rather than authored. The figure and the arithmetic read the same object,
// which is what stops a plausible-looking picture from licensing a wrong sum.
//
// This is a general solid-composition capability, not a Chapter 12 type.
// Nothing here knows which chapter is using it.
//
// Deliberately NOT built: boolean geometry, meshes, cavities, overlaps or
// any 3-D engine. The CBSE scope is combinations of any TWO standard solids,
// joined at a face, and the validator enforces that rather than leaving the
// restraint to authorial discipline.
// ===========================================================================

export type SolidKind =
  | 'cylinder'
  | 'cone'
  | 'hemisphere'
  | 'sphere'
  | 'cube'
  | 'cuboid';

/** Dimensions, by kind. Only what each solid actually needs. */
export type SolidDimensions = {
  /** cylinder, cone, hemisphere, sphere */
  radius?: number;
  /** cylinder, cone, cuboid */
  height?: number;
  /** cone — the slant, which is NOT the height and is the classic confusion. */
  slantHeight?: number;
  /** cube */
  edge?: number;
  /** cuboid */
  length?: number;
  breadth?: number;
};

export type SurfaceShape = 'circle' | 'curved_lateral' | 'square' | 'rectangle' | 'closed_surface';

export type SolidSurface = {
  /** Unique within its component. */
  id: string;
  shape: SurfaceShape;
  /** What a student would call it. */
  name: string;
  /** Area in terms of the component's own dimensions. */
  area: number;
  /** The formula, for the lesson to show rather than assert. */
  formula: string;
  /** Radius of a circular face, so a join can check the fit. */
  circleRadius?: number;
};

export type SolidComponent = {
  id: string;
  kind: SolidKind;
  label: string;
  dimensions: SolidDimensions;
};

export type SurfaceRef = { component: string; surface: string };

export type CompositeSolidSpec = {
  type: 'composite_solid';
  purpose: 'show_definition' | 'support_reasoning' | 'show_construction';
  status: 'concept_specific';
  components: SolidComponent[];
  /** Each join hides exactly the two surfaces it names. */
  joins: Array<{ a: SurfaceRef; b: SurfaceRef; note?: string }>;
  /** A labelled 2-D cross-section is drawn; no perspective is implied. */
  crossSection: 'vertical';
  caption: string;
  altText: string;
};

const TAU = Math.PI;

/**
 * The surfaces a solid has, before any joining. Derived from the kind, so an
 * author cannot forget one or invent one.
 */
export function surfacesOf(c: SolidComponent): SolidSurface[] {
  const d = c.dimensions;
  const r = d.radius ?? 0;
  switch (c.kind) {
    case 'cylinder':
      return [
        { id: 'curved', shape: 'curved_lateral', name: 'curved surface', area: 2 * TAU * r * (d.height ?? 0), formula: '2\u03c0rh' },
        { id: 'base_lower', shape: 'circle', name: 'lower circular face', area: TAU * r * r, formula: '\u03c0r\u00b2', circleRadius: r },
        { id: 'base_upper', shape: 'circle', name: 'upper circular face', area: TAU * r * r, formula: '\u03c0r\u00b2', circleRadius: r },
      ];
    case 'cone':
      return [
        { id: 'curved', shape: 'curved_lateral', name: 'curved surface', area: TAU * r * (d.slantHeight ?? 0), formula: '\u03c0rl' },
        { id: 'base', shape: 'circle', name: 'circular base', area: TAU * r * r, formula: '\u03c0r\u00b2', circleRadius: r },
      ];
    case 'hemisphere':
      return [
        { id: 'curved', shape: 'curved_lateral', name: 'curved surface', area: 2 * TAU * r * r, formula: '2\u03c0r\u00b2' },
        { id: 'base', shape: 'circle', name: 'flat circular face', area: TAU * r * r, formula: '\u03c0r\u00b2', circleRadius: r },
      ];
    case 'sphere':
      return [{ id: 'curved', shape: 'closed_surface', name: 'surface', area: 4 * TAU * r * r, formula: '4\u03c0r\u00b2' }];
    case 'cube': {
      const e = d.edge ?? 0;
      return Array.from({ length: 6 }, (_, i) => ({
        id: `face${i + 1}`, shape: 'square' as const, name: `face ${i + 1}`, area: e * e, formula: 'a\u00b2',
      }));
    }
    case 'cuboid': {
      const [l, b, h] = [d.length ?? 0, d.breadth ?? 0, d.height ?? 0];
      return [
        { id: 'top', shape: 'rectangle', name: 'top face', area: l * b, formula: 'lb' },
        { id: 'bottom', shape: 'rectangle', name: 'bottom face', area: l * b, formula: 'lb' },
        { id: 'front', shape: 'rectangle', name: 'front face', area: l * h, formula: 'lh' },
        { id: 'back', shape: 'rectangle', name: 'back face', area: l * h, formula: 'lh' },
        { id: 'left', shape: 'rectangle', name: 'left face', area: b * h, formula: 'bh' },
        { id: 'right', shape: 'rectangle', name: 'right face', area: b * h, formula: 'bh' },
      ];
    }
  }
}

export function volumeOf(c: SolidComponent): number {
  const d = c.dimensions;
  const r = d.radius ?? 0;
  switch (c.kind) {
    case 'cylinder': return TAU * r * r * (d.height ?? 0);
    case 'cone': return (TAU * r * r * (d.height ?? 0)) / 3;
    case 'hemisphere': return (2 * TAU * r * r * r) / 3;
    case 'sphere': return (4 * TAU * r * r * r) / 3;
    case 'cube': return (d.edge ?? 0) ** 3;
    case 'cuboid': return (d.length ?? 0) * (d.breadth ?? 0) * (d.height ?? 0);
  }
}

const key = (ref: SurfaceRef) => `${ref.component}.${ref.surface}`;

/** The surfaces hidden by joins — present in the geometry, absent from the exterior. */
export function internalSurfaces(spec: CompositeSolidSpec): SurfaceRef[] {
  return spec.joins.flatMap((j) => [j.a, j.b]);
}

/**
 * The exterior. Derived, never authored: a lesson states this list by
 * reading it, so the prose and the arithmetic cannot disagree.
 */
export function exposedSurfaces(
  spec: CompositeSolidSpec
): Array<{ component: SolidComponent; surface: SolidSurface }> {
  const hidden = new Set(internalSurfaces(spec).map(key));
  return spec.components.flatMap((c) =>
    surfacesOf(c)
      .filter((s) => !hidden.has(key({ component: c.id, surface: s.id })))
      .map((s) => ({ component: c, surface: s }))
  );
}

/** Exterior surface area. NOT the sum of the components' total surface areas. */
export function exposedSurfaceArea(spec: CompositeSolidSpec): number {
  return exposedSurfaces(spec).reduce((t, x) => t + x.surface.area, 0);
}

/** Sum of component volumes. Additive composition only — no cavities. */
export function compositeVolume(spec: CompositeSolidSpec): number {
  return spec.components.reduce((t, c) => t + volumeOf(c), 0);
}

/**
 * What the sum of total surface areas would have given, kept so a lesson can
 * show the gap rather than assert it. The difference is exactly twice the
 * joined face.
 */
export function naiveTotalSurfaceArea(spec: CompositeSolidSpec): number {
  return spec.components.reduce(
    (t, c) => t + surfacesOf(c).reduce((u, s) => u + s.area, 0),
    0
  );
}

/**
 * Reject a composite that does not describe a real object.
 *
 * The dimension check is the one that matters most: a circular face of
 * radius 3 cannot be joined to one of radius 4, and nothing in a drawing
 * would reveal it.
 */
export function validateCompositeSolid(spec: CompositeSolidSpec): string[] {
  const errs: string[] = [];
  const byId = new Map(spec.components.map((c) => [c.id, c] as const));
  if (spec.components.length < 1) errs.push('a composite needs at least one component');
  // CBSE scope: combinations of any TWO standard solids.
  if (spec.components.length > 2) {
    errs.push(`${spec.components.length} components exceeds the prescribed scope of two`);
  }
  if (new Set(spec.components.map((c) => c.id)).size !== spec.components.length) {
    errs.push('component ids are not unique');
  }
  for (const c of spec.components) {
    const surfaces = surfacesOf(c);
    if (new Set(surfaces.map((s) => s.id)).size !== surfaces.length) {
      errs.push(`${c.id}: surface ids are not unique`);
    }
    for (const s of surfaces) {
      if (!Number.isFinite(s.area) || s.area <= 0) errs.push(`${c.id}.${s.id}: area is not positive`);
    }
    if (c.kind === 'cone') {
      const { radius = 0, height = 0, slantHeight = 0 } = c.dimensions;
      // The slant height is not the height, and the model refuses to let the
      // two be confused: l must satisfy l squared = r squared + h squared.
      const expected = Math.hypot(radius, height);
      if (Math.abs(slantHeight - expected) > 1e-6) {
        errs.push(
          `${c.id}: slant height ${slantHeight} does not match radius ${radius} and height ${height} (expected ${expected.toFixed(4)})`
        );
      }
    }
  }
  const used = new Map<string, number>();
  for (const j of spec.joins) {
    for (const ref of [j.a, j.b]) {
      const c = byId.get(ref.component);
      if (!c) { errs.push(`join names unknown component ${ref.component}`); continue; }
      const s = surfacesOf(c).find((x) => x.id === ref.surface);
      if (!s) { errs.push(`join names unknown surface ${key(ref)}`); continue; }
      used.set(key(ref), (used.get(key(ref)) ?? 0) + 1);
    }
    if (j.a.component === j.b.component) errs.push('a component cannot be joined to itself');
    const ca = byId.get(j.a.component);
    const cb = byId.get(j.b.component);
    const sa = ca && surfacesOf(ca).find((x) => x.id === j.a.surface);
    const sb = cb && surfacesOf(cb).find((x) => x.id === j.b.surface);
    if (sa && sb) {
      if (sa.shape !== sb.shape) {
        errs.push(`${key(j.a)} is a ${sa.shape} and cannot join a ${sb.shape}`);
      }
      if (sa.shape === 'circle' && sb.shape === 'circle') {
        if (Math.abs((sa.circleRadius ?? 0) - (sb.circleRadius ?? 0)) > 1e-9) {
          errs.push(
            `${key(j.a)} has radius ${sa.circleRadius} and ${key(j.b)} has radius ${sb.circleRadius}; they cannot meet`
          );
        }
      }
      if (Math.abs(sa.area - sb.area) > 1e-9) {
        errs.push(`${key(j.a)} and ${key(j.b)} have different areas and cannot be the same interface`);
      }
      if (sa.shape === 'curved_lateral' || sa.shape === 'closed_surface') {
        errs.push(`${key(j.a)} is not a flat face and cannot form a join in this model`);
      }
    }
  }
  for (const [k, n] of used) {
    if (n > 1) errs.push(`${k} is used in ${n} joins; a surface can be hidden only once`);
  }
  return errs;
}

/**
 * A surface-by-surface account a lesson can print and a reader can check,
 * with the exposed and internal surfaces named rather than shaded. Nothing
 * here depends on colour, which is also what makes it usable without sight
 * of the figure.
 */
export function surfaceAccount(spec: CompositeSolidSpec): Array<{
  component: string;
  surface: string;
  formula: string;
  exposed: boolean;
  reason: string;
}> {
  const byId = new Map(spec.components.map((c) => [c.id, c] as const));
  const name = (ref: SurfaceRef) => {
    const c = byId.get(ref.component);
    const s = c && surfacesOf(c).find((x) => x.id === ref.surface);
    return `${s?.name ?? ref.surface} of the ${c?.label ?? ref.component}`;
  };
  const hidden = new Map(
    spec.joins.flatMap((j) => [
      [key(j.a), `joined to the ${name(j.b)}`],
      [key(j.b), `joined to the ${name(j.a)}`],
    ] as Array<[string, string]>)
  );
  return spec.components.flatMap((c) =>
    surfacesOf(c).map((s) => {
      const k = key({ component: c.id, surface: s.id });
      const why = hidden.get(k);
      return {
        component: c.label,
        surface: s.name,
        formula: s.formula,
        exposed: !why,
        reason: why ? `internal \u2014 ${why}` : 'on the outside of the finished solid',
      };
    })
  );
}
