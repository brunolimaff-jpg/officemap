/** Isometric draw order: larger (x+y) = closer to camera; higher layer = on top at same tile. */

export const ISO_LAYER = {
  rug: 12,
  plant: 22,
  desk: 34,
  whiteboard: 36,
  table: 38,
  sofa: 42,
  chair: 52,
  avatar: 72,
} as const;

export type IsoLayerKey = keyof typeof ISO_LAYER;

export function isoZIndex(tileX: number, tileY: number, layer: number): number {
  return (tileX + tileY) * 1000 + layer;
}

export function layerForFurnitureType(type: string): number {
  const k = type as IsoLayerKey;
  return ISO_LAYER[k] ?? 30;
}
