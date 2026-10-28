export type Cell = { col: number; row: number };

export type Layout<T extends string> = {
  cells: Record<T, Cell>;
  cols: number;
  rows: number;
};

export const touching = (a: Cell, b: Cell) => Math.abs(a.col - b.col) + Math.abs(a.row - b.row) === 1;

export const isConnected = <T extends string>(ids: T[], edges: [T, T][]) => {
  if (ids.length === 0) return true;
  const seen = new Set<T>([ids[0]]);
  const queue = [ids[0]];
  while (queue.length) {
    const current = queue.shift()!;
    for (const [a, b] of edges) {
      const next = a === current ? b : b === current ? a : null;
      if (next && !seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return ids.every((id) => seen.has(id));
};

const gridSize = 4;

const score = <T extends string>(ids: T[], edges: [T, T][], cells: Record<T, Cell>) => {
  let total = 0;
  for (const [a, b] of edges) if (touching(cells[a], cells[b])) total += 100;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) if (touching(cells[ids[i]], cells[ids[j]])) total += 4;
  }
  const cols = ids.map((id) => cells[id].col);
  const rows = ids.map((id) => cells[id].row);
  const width = Math.max(...cols) - Math.min(...cols) + 1;
  const height = Math.max(...rows) - Math.min(...rows) + 1;
  return total - width * height * 3 - Math.abs(width - height - 1) * 4;
};

const randomCells = <T extends string>(ids: T[], random: () => number) => {
  const slots = Array.from({ length: gridSize * gridSize }, (_, i) => ({ col: i % gridSize, row: Math.floor(i / gridSize) }));
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  return Object.fromEntries(ids.map((id, i) => [id, slots[i]])) as Record<T, Cell>;
};

export const planLayout = <T extends string>(ids: T[], edges: [T, T][], random: () => number = Math.random): Layout<T> => {
  let best = randomCells(ids, random);
  let bestScore = score(ids, edges, best);

  for (let restart = 0; restart < 12; restart++) {
    let cells = randomCells(ids, random);
    let current = score(ids, edges, cells);
    for (let step = 0, temperature = 60; step < 2500; step++, temperature *= 0.997) {
      const next = { ...cells };
      const id = ids[Math.floor(random() * ids.length)];
      const target = { col: Math.floor(random() * gridSize), row: Math.floor(random() * gridSize) };
      const occupant = ids.find((other) => next[other].col === target.col && next[other].row === target.row);
      if (occupant) next[occupant] = next[id];
      next[id] = target;
      const candidate = score(ids, edges, next);
      if (candidate >= current || random() < Math.exp((candidate - current) / temperature)) {
        cells = next;
        current = candidate;
      }
      if (current > bestScore) {
        best = cells;
        bestScore = current;
      }
    }
  }

  const minCol = Math.min(...ids.map((id) => best[id].col));
  const minRow = Math.min(...ids.map((id) => best[id].row));
  const cells = Object.fromEntries(ids.map((id) => [id, { col: best[id].col - minCol, row: best[id].row - minRow }])) as Record<T, Cell>;
  return {
    cells,
    cols: Math.max(...ids.map((id) => cells[id].col)) + 1,
    rows: Math.max(...ids.map((id) => cells[id].row)) + 1,
  };
};
