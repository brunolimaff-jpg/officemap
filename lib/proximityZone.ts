// ═══════════════════════════════════════════════════════════════════════════
// PROXIMITY ZONE — Sprint 2
// Conceito WorkAdventure: tile adjacente a um POI dispara evento automático
// Puro — zero dependência de React ou DOM. Testável isoladamente.
// ═══════════════════════════════════════════════════════════════════════════

export interface ProximityPoint {
  /** ID único do POI (ex: id do especialista) */
  id: string;
  /** Tile X do POI (mesa do especialista) */
  x: number;
  /** Tile Y do POI */
  y: number;
  /** Raio em tiles (default 1 = apenas adjacente) */
  radius?: number;
}

export interface ProximityResult {
  /** IDs dos POIs dentro do raio */
  nearIds: string[];
  /** Tiles que devem ser destacados no canvas (inclui o próprio POI) */
  highlightTiles: Array<{ x: number; y: number }>;
}

/**
 * Verifica quais POIs estão dentro do raio do avatar.
 * Complexidade O(P × (2r+1)^2) — P = número de POIs, r = raio máx.
 * Para o nosso mapa: 13 especialistas × 9 tiles = 117 checks por move. Trivial.
 */
export function checkProximity(
  avatarX: number,
  avatarY: number,
  points: ProximityPoint[],
): ProximityResult {
  const nearIds: string[] = [];
  const tileSet = new Set<string>();
  const highlightTiles: Array<{ x: number; y: number }> = [];

  for (const point of points) {
    const r = point.radius ?? 1;
    const dist = Math.max(
      Math.abs(avatarX - point.x),
      Math.abs(avatarY - point.y),
    ); // Chebyshev distance — cobre diagonais sem Euclides

    if (dist <= r) {
      nearIds.push(point.id);
      // Adiciona todos os tiles do raio ao highlight
      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          const key = `${point.x + dx},${point.y + dy}`;
          if (!tileSet.has(key)) {
            tileSet.add(key);
            highlightTiles.push({ x: point.x + dx, y: point.y + dy });
          }
        }
      }
    }
  }

  return { nearIds, highlightTiles };
}

/**
 * Constrói a lista de ProximityPoints a partir dos especialistas.
 * Recebe array genérico para evitar import circular com data/specialists.
 */
export function buildProximityPoints(
  specialists: Array<{ id: string; tileX: number; tileY: number; proximityRadius?: number }>
): ProximityPoint[] {
  return specialists.map(s => ({
    id: s.id,
    x: s.tileX,
    y: s.tileY,
    radius: s.proximityRadius ?? 1,
  }));
}
