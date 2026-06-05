// engine.js — Lógica del modo Mundial Draft (sin dependencias de framework).
// Importa esto desde tu componente y pásale el array de jugadores (players.json).

// Posiciones compatibles por hueco de la formación.
export const ELIG = {
  GK: ["GK"], LB: ["LB", "LWB"], RB: ["RB", "RWB"], CB: ["CB"],
  CM: ["CM", "CDM", "CAM"], LW: ["LW", "LM"], RW: ["RW", "RM"], ST: ["ST", "CF"],
};

// Formación 4-3-3 con coordenadas en el campo (x,y en %). Ataque arriba.
export const FORMATION_433 = [
  { pos: "ST", label: "DC", x: 50, y: 13 },
  { pos: "LW", label: "EI", x: 19, y: 22 },
  { pos: "RW", label: "ED", x: 81, y: 22 },
  { pos: "CM", label: "MC", x: 27, y: 47 },
  { pos: "CM", label: "MC", x: 50, y: 43 },
  { pos: "CM", label: "MC", x: 73, y: 47 },
  { pos: "LB", label: "LI", x: 14, y: 72 },
  { pos: "CB", label: "DFC", x: 38, y: 76 },
  { pos: "CB", label: "DFC", x: 62, y: 76 },
  { pos: "RB", label: "LD", x: 86, y: 72 },
  { pos: "GK", label: "POR", x: 50, y: 91 },
];

// ¿El jugador puede jugar en ese hueco?
export const eligibleFor = (player, pos) =>
  ELIG[pos].some((x) => player.positions.includes(x));

// Saca n candidatos aleatorios elegibles para una posición, sin repetir.
export function drawCandidates(players, pos, usedIds, n = 5) {
  const pool = players.filter((p) => eligibleFor(p, pos) && !usedIds.has(p.id));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

// Química de un jugador (0-3) según enlaces y posición natural.
export function playerChem(player, pos, eleven) {
  const others = eleven.filter((x) => x && x.id !== player.id);
  const inPos = eligibleFor(player, pos);
  const nation = others.filter((o) => o.nation === player.nation).length;
  const league = others.filter((o) => o.league && o.league === player.league).length;
  const club = others.filter((o) => o.club && o.club === player.club).length;
  // Club pesa más que selección/liga.
  const pts = Math.min(club, 2) * 2 + Math.min(nation, 3) + Math.min(league, 3);
  let chem = pts >= 5 ? 3 : pts >= 3 ? 2 : pts >= 1 ? 1 : 0;
  if (!inPos) chem = Math.min(chem, 1); // fuera de posición tope la química
  return { chem, nation, league, club, inPos };
}

// Puntúa la plantilla completa. picks = [{ pos, player }] x11.
export function scoreSquad(picks) {
  const eleven = picks.map((p) => p.player);
  const details = picks.map((pk) => playerChem(pk.player, pk.pos, eleven));
  const teamChem = details.reduce((s, d) => s + d.chem, 0); // 0..33
  const teamRating = Math.round(
    eleven.reduce((s, p) => s + p.rating, 0) / eleven.length
  );
  return { teamRating, teamChem, finalScore: teamRating + teamChem, details };
}
