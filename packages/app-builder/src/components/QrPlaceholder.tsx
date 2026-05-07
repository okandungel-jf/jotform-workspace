// Placeholder QR-shaped SVG: hand-crafted finder/timing patterns + deterministic
// pseudo-random data modules. Not a scannable code — purely a visual stand-in.
const N = 25
const SEED = 0xa4b3

function buildModules(): boolean[][] {
  const cells: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false))
  const reserved: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false))

  const drawFinder = (r0: number, c0: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const onRing = r === 0 || r === 6 || c === 0 || c === 6
        const onCore = r >= 2 && r <= 4 && c >= 2 && c <= 4
        cells[r0 + r][c0 + c] = onRing || onCore
        reserved[r0 + r][c0 + c] = true
      }
    }
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r
        const cc = c0 + c
        if (rr >= 0 && rr < N && cc >= 0 && cc < N) reserved[rr][cc] = true
      }
    }
  }
  drawFinder(0, 0)
  drawFinder(0, N - 7)
  drawFinder(N - 7, 0)

  for (let i = 8; i < N - 8; i++) {
    cells[6][i] = i % 2 === 0
    cells[i][6] = i % 2 === 0
    reserved[6][i] = true
    reserved[i][6] = true
  }

  const ar = N - 9
  const ac = N - 9
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const onRing = r === 0 || r === 4 || c === 0 || c === 4
      const onCenter = r === 2 && c === 2
      cells[ar + r][ac + c] = onRing || onCenter
      reserved[ar + r][ac + c] = true
    }
  }

  let s = SEED
  const rand = () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 1000) / 1000
  }
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!reserved[r][c]) cells[r][c] = rand() > 0.5
    }
  }

  return cells
}

const MODULES = buildModules()

export function QrPlaceholder({ size = 120, className }: { size?: number; className?: string }) {
  const rects: React.ReactNode[] = []
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (MODULES[r][c]) {
        rects.push(<rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" />)
      }
    }
  }
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${N} ${N}`}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      fill="currentColor"
      aria-hidden="true"
    >
      {rects}
    </svg>
  )
}
