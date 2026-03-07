import { useState } from 'react'
import { Server, Network, Thermometer, Zap, DollarSign, Globe, Shield, Cpu, Play, Eye, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FEATURES = [
  { icon: Server, label: 'Build Racks', desc: 'Place cabinets, install servers, and earn revenue', color: 'text-neon-green' },
  { icon: Network, label: 'Design Networks', desc: 'Spine-leaf Clos fabric with ECMP traffic routing', color: 'text-neon-cyan' },
  { icon: Thermometer, label: 'Manage Cooling', desc: 'Balance heat with air, water, and immersion cooling', color: 'text-neon-orange' },
  { icon: Zap, label: 'Balance Power', desc: 'Dynamic power markets, PDUs, and redundancy tiers', color: 'text-neon-yellow' },
  { icon: DollarSign, label: 'Grow Revenue', desc: 'Land contracts, spot compute, and interconnections', color: 'text-neon-green' },
  { icon: Globe, label: 'Scale Globally', desc: '15 regions across 5 continents with unique profiles', color: 'text-neon-cyan' },
  { icon: Shield, label: 'Security & Compliance', desc: 'SOC 2, HIPAA, PCI-DSS audits and NACLs', color: 'text-neon-purple' },
  { icon: Cpu, label: 'Research & Upgrade', desc: 'Tech tree, ops tiers, and advanced scaling', color: 'text-neon-orange' },
]

/** Isometric SVG illustration of a mini data center */
function DataCenterSVG() {
  // Isometric projection helpers
  const TW = 44 // tile width
  const TH = 22 // tile height
  const OX = 240 // origin X (center of 480-wide viewbox)
  const OY = 105 // origin Y
  const CAB_H = 40 // cabinet height in px

  const ix = (col: number, row: number) => OX + (col - row) * TW / 2
  const iy = (col: number, row: number) => OY + (col + row) * TH / 2

  // Cabinet positions: row 0 (4 cabs), row 2 (3 cabs)
  const cabRow0 = [0, 1, 2, 3].map(c => ({ col: c, row: 0 }))
  const cabRow1 = [0, 1, 2].map(c => ({ col: c, row: 2 }))
  const allCabs = [...cabRow0, ...cabRow1]

  return (
    <svg viewBox="0 0 480 300" className="w-full max-w-xl mx-auto" aria-label="Isometric data center illustration">
      <defs>
        <filter id="glow-g" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-c" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-o" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Isometric floor grid */}
      <g opacity="0.12">
        {Array.from({ length: 5 }, (_, c) =>
          Array.from({ length: 4 }, (_, r) => {
            const cx = ix(c, r)
            const cy = iy(c, r)
            const hw = TW / 2
            const hh = TH / 2
            return (
              <polygon
                key={`tile-${c}-${r}`}
                points={`${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`}
                fill="none"
                stroke="#00ff88"
                strokeWidth="0.6"
              />
            )
          })
        )}
      </g>

      {/* Spine switches (flat isometric boxes at top) */}
      {[0, 1].map((i) => {
        const sx = OX + 60 + i * 80
        const sy = 42
        const sw = 48
        const sh = 10
        return (
          <g key={`spine-${i}`} className="landing-spine" style={{ animationDelay: `${1.1 + i * 0.2}s` }}>
            {/* Top face */}
            <polygon
              points={`${sx},${sy - 5} ${sx + sw / 2},${sy} ${sx},${sy + 5} ${sx - sw / 2},${sy}`}
              fill="#1a1005"
              stroke="#ff6644"
              strokeWidth="0.8"
            />
            {/* Front-left face */}
            <polygon
              points={`${sx - sw / 2},${sy} ${sx},${sy + 5} ${sx},${sy + 5 + sh} ${sx - sw / 2},${sy + sh}`}
              fill="#120a02"
              stroke="#ff6644"
              strokeWidth="0.6"
            />
            {/* Front-right face */}
            <polygon
              points={`${sx},${sy + 5} ${sx + sw / 2},${sy} ${sx + sw / 2},${sy + sh} ${sx},${sy + 5 + sh}`}
              fill="#0d0801"
              stroke="#ff6644"
              strokeWidth="0.6"
            />
            {/* Port lights */}
            {[-12, -4, 4, 12].map((dx, li) => (
              <circle key={li} cx={sx + dx} cy={sy} r="1.2" fill="#ff6644" opacity="0.7" filter="url(#glow-o)" />
            ))}
            <text x={sx} y={sy + 3} textAnchor="middle" fontSize="5" fill="#ff6644" fontFamily="monospace" opacity="0.6">SPINE</text>
          </g>
        )
      })}

      {/* Traffic lines (leaf → spine) — solid thin lines */}
      <g className="landing-traffic">
        {allCabs.slice(0, 5).map((cab, i) => {
          const cx = ix(cab.col, cab.row)
          const cy = iy(cab.col, cab.row) - CAB_H
          const spineIdx = i % 2
          const sx = OX + 60 + spineIdx * 80
          const sy = 52
          return (
            <line
              key={`tl-${i}`}
              x1={cx} y1={cy} x2={sx} y2={sy}
              stroke="#00ff8830"
              strokeWidth="0.8"
              className="landing-traffic-line"
              style={{ animationDelay: `${1.5 + i * 0.12}s` }}
            />
          )
        })}
      </g>

      {/* Packet dots along traffic lines */}
      {allCabs.slice(0, 4).map((cab, i) => {
        const cx = ix(cab.col, cab.row)
        const cy = iy(cab.col, cab.row) - CAB_H
        const spineIdx = i % 2
        const sx = OX + 60 + spineIdx * 80
        const sy = 52
        const color = i % 2 === 0 ? '#00ff88' : '#00aaff'
        return (
          <circle key={`pkt-${i}`} r="2" fill={color} filter="url(#glow-g)">
            <animate attributeName="cx" values={`${cx};${sx};${cx}`} dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${2 + i * 0.4}s`} />
            <animate attributeName="cy" values={`${cy};${sy};${cy}`} dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${2 + i * 0.4}s`} />
            <animate attributeName="opacity" values="0;1;1;0" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${2 + i * 0.4}s`} />
          </circle>
        )
      })}

      {/* Cabinets — proper isometric cubes */}
      {allCabs.map((cab, idx) => {
        const cx = ix(cab.col, cab.row)
        const cy = iy(cab.col, cab.row)
        const hw = TW / 2
        const hh = TH / 2
        const h = CAB_H
        const servers = cab.row === 0 ? (cab.col < 3 ? 4 : 2) : (cab.col < 2 ? 3 : 1)
        const hasLeaf = cab.row === 0 ? cab.col < 3 : cab.col < 2

        return (
          <g key={`cab-${idx}`} className="landing-cabinet" style={{ animationDelay: `${idx * 0.12}s` }}>
            {/* Right face (darkest) */}
            <polygon
              points={`${cx},${cy + hh - h} ${cx + hw},${cy - h} ${cx + hw},${cy} ${cx},${cy + hh}`}
              fill="#081420"
              stroke="#1a3a5a"
              strokeWidth="0.6"
            />
            {/* Left face (medium) */}
            <polygon
              points={`${cx - hw},${cy - h} ${cx},${cy + hh - h} ${cx},${cy + hh} ${cx - hw},${cy}`}
              fill="#0c1a28"
              stroke="#1a3a5a"
              strokeWidth="0.6"
            />
            {/* Top face (lightest) */}
            <polygon
              points={`${cx},${cy - hh - h} ${cx + hw},${cy - h} ${cx},${cy + hh - h} ${cx - hw},${cy - h}`}
              fill="#122030"
              stroke="#1a3a5a"
              strokeWidth="0.6"
            />

            {/* Server bars on left face */}
            {Array.from({ length: servers }, (_, si) => {
              const barY = cy - h + 8 + si * 8
              return (
                <line
                  key={si}
                  x1={cx - hw + 3} y1={barY + hh * 0.15}
                  x2={cx - 2} y2={barY - hh * 0.15}
                  stroke="#00ff88"
                  strokeWidth="2.5"
                  opacity="0.7"
                  filter="url(#glow-g)"
                />
              )
            })}

            {/* Leaf switch bar (cyan, at top of left face) */}
            {hasLeaf && (
              <line
                x1={cx - hw + 3} y1={cy - h + 4 + hh * 0.15}
                x2={cx - 2} y2={cy - h + 4 - hh * 0.15}
                stroke="#00aaff"
                strokeWidth="2"
                opacity="0.8"
                filter="url(#glow-c)"
              />
            )}

            {/* LED indicator */}
            <circle
              cx={cx + hw - 4}
              cy={cy - h + 6}
              r="1.5"
              fill="#00ff88"
              filter="url(#glow-g)"
              className="landing-led"
              style={{ animationDelay: `${idx * 0.3}s` }}
            />
          </g>
        )
      })}

      {/* Cooling unit (isometric box, right side) */}
      <g className="landing-cabinet" style={{ animationDelay: '1.0s' }}>
        {(() => {
          const cx = ix(4, 1)
          const cy = iy(4, 1)
          const hw = TW / 2
          const hh = TH / 2
          const h = 28
          return (
            <>
              {/* Right face */}
              <polygon
                points={`${cx},${cy + hh - h} ${cx + hw},${cy - h} ${cx + hw},${cy} ${cx},${cy + hh}`}
                fill="#061018"
                stroke="#00aaff"
                strokeWidth="0.6"
                opacity="0.8"
              />
              {/* Left face */}
              <polygon
                points={`${cx - hw},${cy - h} ${cx},${cy + hh - h} ${cx},${cy + hh} ${cx - hw},${cy}`}
                fill="#081822"
                stroke="#00aaff"
                strokeWidth="0.6"
                opacity="0.8"
              />
              {/* Top face */}
              <polygon
                points={`${cx},${cy - hh - h} ${cx + hw},${cy - h} ${cx},${cy + hh - h} ${cx - hw},${cy - h}`}
                fill="#0a2030"
                stroke="#00aaff"
                strokeWidth="0.6"
                opacity="0.8"
              />
              {/* Fan circle on top */}
              <circle cx={cx} cy={cy - h + hh * 0.1} r="5" fill="none" stroke="#00aaff" strokeWidth="0.5" opacity="0.4" />
              <line x1={cx - 4} y1={cy - h + hh * 0.1} x2={cx + 4} y2={cy - h + hh * 0.1} stroke="#00aaff" strokeWidth="0.8" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy - h + hh * 0.1}`} to={`360 ${cx} ${cy - h + hh * 0.1}`} dur="1.5s" repeatCount="indefinite" />
              </line>
              <text x={cx - 1} y={cy - 2} textAnchor="middle" fontSize="5" fill="#00aaff" fontFamily="monospace" opacity="0.5">CRAC</text>
            </>
          )
        })()}
      </g>

      {/* Heat shimmer on the last row-0 cabinet (col 3) */}
      {(() => {
        const cx = ix(3, 0)
        const cy = iy(3, 0) - CAB_H - 5
        return (
          <g opacity="0.5">
            <line x1={cx - 3} y1={cy} x2={cx - 2} y2={cy - 15} stroke="#ff6644" strokeWidth="1" filter="url(#glow-o)">
              <animate attributeName="y2" values={`${cy - 15};${cy - 20};${cy - 15}`} dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
            </line>
            <line x1={cx + 3} y1={cy} x2={cx + 4} y2={cy - 13} stroke="#ff6644" strokeWidth="1" filter="url(#glow-o)">
              <animate attributeName="y2" values={`${cy - 13};${cy - 18};${cy - 13}`} dur="2.3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.3s" repeatCount="indefinite" />
            </line>
          </g>
        )
      })()}

      {/* Revenue floating text */}
      {[0, 1, 2].map((i) => {
        const cab = allCabs[i]
        const cx = ix(cab.col, cab.row)
        const startY = iy(cab.col, cab.row) - CAB_H - 8
        return (
          <text
            key={`rev-${i}`}
            x={cx}
            textAnchor="middle"
            fontSize="8"
            fill="#ffaa00"
            fontFamily="monospace"
            fontWeight="bold"
            filter="url(#glow-o)"
          >
            +$12
            <animate attributeName="y" values={`${startY};${startY - 25}`} dur="2.4s" repeatCount="indefinite" begin={`${2.5 + i * 0.8}s`} />
            <animate attributeName="opacity" values="0;1;1;0" dur="2.4s" repeatCount="indefinite" begin={`${2.5 + i * 0.8}s`} />
          </text>
        )
      })}
    </svg>
  )
}


interface LandingPageProps {
  onPlay: () => void
}

export function LandingPage({ onPlay }: LandingPageProps) {
  const [exiting, setExiting] = useState(false)

  const handlePlay = () => {
    setExiting(true)
    setTimeout(onPlay, 600)
  }

  const handleDemo = () => {
    const demoUrl = `${window.location.origin}${import.meta.env.BASE_URL}?demo=true`
    window.open(demoUrl, '_blank')
  }

  return (
    <div className={`fixed inset-0 z-[200] bg-background flex flex-col items-center overflow-y-auto font-mono transition-opacity duration-500 ${exiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none scanlines z-10" />

      {/* Hero section */}
      <div className="flex flex-col items-center justify-center w-full max-w-4xl px-4 pt-12 md:pt-16 pb-6 relative z-20">
        {/* Version badge */}
        <span className="text-[10px] tracking-widest text-neon-cyan/60 border border-neon-cyan/20 rounded px-2 py-0.5 mb-4 landing-fade-in" style={{ animationDelay: '0.1s' }}>
          v0.5.2
        </span>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-[0.2em] text-neon-green text-glow-green landing-title mb-2">
          DATA CENTER TYCOON
        </h1>
        <p className="text-sm md:text-base text-muted-foreground tracking-widest mb-1 landing-fade-in" style={{ animationDelay: '0.3s' }}>
          DATA CENTER SIMULATOR
        </p>
        <div className="flex items-center gap-2 mb-8 landing-fade-in" style={{ animationDelay: '0.5s' }}>
          <span className="h-px w-12 bg-neon-green/30" />
          <span className="text-[10px] text-neon-green/50 tracking-widest">BUILD &middot; CONNECT &middot; SCALE</span>
          <span className="h-px w-12 bg-neon-green/30" />
        </div>

        {/* SVG Data Center Illustration */}
        <div className="w-full max-w-xl mb-8 landing-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="relative rounded-xl border border-neon-green/20 bg-card/80 p-4 glow-green overflow-hidden">
            <DataCenterSVG />
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-green/40 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-neon-green/40 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-neon-green/40 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-green/40 rounded-br-xl" />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs md:text-sm text-center text-muted-foreground max-w-md mb-8 leading-relaxed landing-fade-in" style={{ animationDelay: '0.8s' }}>
          Start with an empty suite and $50,000. Place cabinets, wire a spine-leaf fabric,
          manage heat and power, land contracts, and scale from one rack to a global data center empire.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 mb-12 landing-fade-in" style={{ animationDelay: '1.0s' }}>
          <Button
            onClick={handlePlay}
            className="bg-neon-green/20 border-2 border-neon-green/50 text-neon-green hover:bg-neon-green/30 hover:border-neon-green/70 font-mono text-sm md:text-base px-8 py-3 h-auto tracking-wider glow-green landing-pulse-border"
          >
            <Play className="size-4 mr-2" />
            PLAY NOW
          </Button>
          <Button
            variant="ghost"
            onClick={handleDemo}
            className="text-neon-cyan hover:text-neon-cyan/80 hover:bg-neon-cyan/10 font-mono text-sm px-6 py-3 h-auto tracking-wider gap-2"
          >
            <Eye className="size-4" />
            VIEW DEMO
            <ExternalLink className="size-3" />
          </Button>
        </div>
      </div>

      {/* Feature grid */}
      <div className="w-full max-w-4xl px-4 pb-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map((feat, i) => (
            <div
              key={feat.label}
              className="rounded-lg border border-border/50 bg-card/60 p-3 hover:border-neon-green/30 hover:bg-card/80 transition-colors duration-300 landing-fade-in"
              style={{ animationDelay: `${1.2 + i * 0.1}s` }}
            >
              <feat.icon className={`size-5 ${feat.color} mb-2`} />
              <p className="text-xs font-bold text-foreground mb-1">{feat.label}</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full border-t border-border/30 py-4 text-center relative z-20 landing-fade-in" style={{ animationDelay: '2.2s' }}>
        <p className="text-[10px] text-muted-foreground/50 tracking-wider">
          DC TYCOON v0.5.2 &middot; BUILT WITH REACT + PHASER + ZUSTAND
        </p>
      </div>
    </div>
  )
}
