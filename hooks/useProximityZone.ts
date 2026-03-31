// ═══════════════════════════════════════════════════════════════════════════
// useProximityZone — Sprint 2
// Hook React que encapsula checkProximity.
// Responsabilidade única: retornar nearIds + highlightTiles a cada move.
// Não tem efeitos colaterais — só computa e retorna.
// ═══════════════════════════════════════════════════════════════════════════
import { useMemo } from 'react';
import { checkProximity, buildProximityPoints } from '@/lib/proximityZone';
import type { ProximityResult } from '@/lib/proximityZone';

interface Specialist {
  id: string;
  tileX: number;
  tileY: number;
  proximityRadius?: number;
}

/**
 * Dado a posição atual do avatar (usuário principal) e a lista de
 * especialistas, retorna quais estão no raio e quais tiles destacar.
 *
 * Uso:
 *   const { nearIds, highlightTiles } = useProximityZone(myX, myY, specialists);
 *   // nearIds: IDs dos especialistas próximos → abre painel automaticamente
 *   // highlightTiles: passa para IsoCanvas como proximityTiles prop
 */
export function useProximityZone(
  avatarX: number,
  avatarY: number,
  specialists: Specialist[],
): ProximityResult {
  const points = useMemo(
    () => buildProximityPoints(specialists),
    // specialists muda apenas quando o array de dados é recarregado
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [specialists.length],
  );

  return useMemo(
    () => checkProximity(avatarX, avatarY, points),
    [avatarX, avatarY, points],
  );
}
