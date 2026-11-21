// Footprints shared with the classic renderer in PhaserGame.ts, so v2 art
// lines up exactly with labels, hit-testing, selection outlines and overlays.

const BASE_DEPTH = 4
const SERVER_DEPTH = 10
const LEAF_DEPTH = 7
const SECTION_GAP = 1
const MAX_SERVERS = 4

export const CAB = {
  w: 44,
  h: 22,
  inset: 8,
  baseDepth: BASE_DEPTH,
  serverDepth: SERVER_DEPTH,
  leafDepth: LEAF_DEPTH,
  gap: SECTION_GAP,
  maxServers: MAX_SERVERS,
  depth: BASE_DEPTH + MAX_SERVERS * (SERVER_DEPTH + SECTION_GAP) + (LEAF_DEPTH + SECTION_GAP),
  /** Base y (box convention) of server slot i, counted from the bottom */
  slotY: (i: number) => -BASE_DEPTH - SECTION_GAP - i * (SERVER_DEPTH + SECTION_GAP),
  /** Base y of the leaf switch slot at the top of the rack */
  leafY: -BASE_DEPTH - SECTION_GAP - MAX_SERVERS * (SERVER_DEPTH + SECTION_GAP),
} as const

export const SPINE = { w: 50, h: 25, depth: 16 } as const

export const IB_SWITCH = { w: 14, h: 7, depth: 5 } as const

export const PDU = { w: 44 * 0.6, h: 22 * 0.6, depth: 6 } as const

export const COOLING = { w: 44 * 0.5, h: 22 * 0.5, depth: 8 } as const

export const CHILLER = { w: 44 * 0.7, h: 22 * 0.7, depth: 12 } as const
