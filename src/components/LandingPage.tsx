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

/** Isometric helpers — scaled up for prominent cabinets */
const TW = 78 // tile width
const TH = 39 // tile height
const OX = 225 // origin X
const OY = 128 // origin Y
const CAB_H = 68 // cabinet height in px

function isoX(col: number, row: number) { return OX + (col - row) * TW / 2 }
function isoY(col: number, row: number) { return OY + (col + row) * TH / 2 }

/** Renders a single isometric box (3 visible faces) */
function IsoBox({ col, row, h, topFill, leftFill, rightFill, stroke, strokeW = 0.8, opacity = 1 }: {
  col: number; row: number; h: number
  topFill: string; leftFill: string; rightFill: string
  stroke: string; strokeW?: number; opacity?: number
}) {
  const cx = isoX(col, row)
  const cy = isoY(col, row)
  const hw = TW / 2
  const hh = TH / 2
  return (
    <g opacity={opacity}>
      {/* Right face (darkest — drawn first, behind) */}
      <polygon
        points={`${cx},${cy + hh - h} ${cx + hw},${cy - h} ${cx + hw},${cy} ${cx},${cy + hh}`}
        fill={rightFill} stroke={stroke} strokeWidth={strokeW}
      />
      {/* Left face (medium) */}
      <polygon
        points={`${cx - hw},${cy - h} ${cx},${cy + hh - h} ${cx},${cy + hh} ${cx - hw},${cy}`}
        fill={leftFill} stroke={stroke} strokeWidth={strokeW}
      />
      {/* Top face (lightest) */}
      <polygon
        points={`${cx},${cy - hh - h} ${cx + hw},${cy - h} ${cx},${cy + hh - h} ${cx - hw},${cy - h}`}
        fill={topFill} stroke={stroke} strokeWidth={strokeW}
      />
    </g>
  )
}

/** Cabinet positions — fewer but bigger: 3 in front row, 2 in back */
const CAB_ROW_0 = [0, 1, 2].map(c => ({ col: c, row: 0 }))
const CAB_ROW_1 = [0, 1].map(c => ({ col: c, row: 2 }))
const ALL_CABS = [...CAB_ROW_0, ...CAB_ROW_1]

/** Spine switch positions — well above cabinets to avoid overlap */
const SPINES = [
  { x: OX + 10, y: 14 },
  { x: OX + 90, y: 14 },
]

/** Isometric SVG illustration of a mini data center */
function DataCenterSVG() {
  return (
    <svg viewBox="0 0 480 280" className="w-full max-w-xl mx-auto" aria-label="Isometric data center illustration">
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
        {/* Radial fade mask for endless grid effect */}
        <radialGradient id="grid-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="60%" stopColor="white" stopOpacity="0.7" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="grid-mask">
          <rect x="0" y="0" width="480" height="280" fill="url(#grid-fade)" />
        </mask>
      </defs>

      {/* Endless isometric floor grid — large tiles fading at edges */}
      <g opacity="0.15" mask="url(#grid-mask)">
        {Array.from({ length: 14 }, (_, c) =>
          Array.from({ length: 10 }, (_, r) => {
            const gc = c - 4
            const gr = r - 2
            const cx = isoX(gc, gr)
            const cy = isoY(gc, gr)
            const hw = TW / 2
            const hh = TH / 2
            return (
              <polygon
                key={`tile-${c}-${r}`}
                points={`${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`}
                fill="none"
                stroke="#00ff88"
                strokeWidth="0.5"
              />
            )
          })
        )}
      </g>

      {/* Spine switches (isometric flat boxes above cabinets) */}
      {SPINES.map((sp, i) => {
        const sw = 72
        const sh = 14
        const hh = 8
        return (
          <g key={`spine-${i}`} className="landing-spine" style={{ animationDelay: `${1.1 + i * 0.2}s` }}>
            {/* Top face */}
            <polygon
              points={`${sp.x},${sp.y - hh} ${sp.x + sw / 2},${sp.y} ${sp.x},${sp.y + hh} ${sp.x - sw / 2},${sp.y}`}
              fill="#1a1005" stroke="#ff6644" strokeWidth="1"
            />
            {/* Left face */}
            <polygon
              points={`${sp.x - sw / 2},${sp.y} ${sp.x},${sp.y + hh} ${sp.x},${sp.y + hh + sh} ${sp.x - sw / 2},${sp.y + sh}`}
              fill="#120a02" stroke="#ff6644" strokeWidth="0.8"
            />
            {/* Right face */}
            <polygon
              points={`${sp.x},${sp.y + hh} ${sp.x + sw / 2},${sp.y} ${sp.x + sw / 2},${sp.y + sh} ${sp.x},${sp.y + hh + sh}`}
              fill="#0d0801" stroke="#ff6644" strokeWidth="0.8"
            />
            {/* Port LEDs on top face */}
            {[-18, -9, 0, 9, 18].map((dx, li) => (
              <circle key={li} cx={sp.x + dx} cy={sp.y} r="2" fill="#ff6644" opacity="0.8" filter="url(#glow-o)" />
            ))}
          </g>
        )
      })}

      {/* Traffic lines (leaf top → spine) */}
      <g>
        {ALL_CABS.slice(0, 4).map((cab, i) => {
          const cx = isoX(cab.col, cab.row)
          const cy = isoY(cab.col, cab.row) - CAB_H
          const sp = SPINES[i % 2]
          return (
            <line key={`tl-${i}`}
              x1={cx} y1={cy} x2={sp.x} y2={sp.y + 22}
              stroke="#00ff8825" strokeWidth="1"
              className="landing-traffic-line"
              style={{ animationDelay: `${1.5 + i * 0.1}s` }}
            />
          )
        })}
      </g>

      {/* Packet dots */}
      {ALL_CABS.slice(0, 4).map((cab, i) => {
        const cx = isoX(cab.col, cab.row)
        const cy = isoY(cab.col, cab.row) - CAB_H
        const sp = SPINES[i % 2]
        const color = i % 2 === 0 ? '#00ff88' : '#00aaff'
        return (
          <circle key={`pkt-${i}`} r="3" fill={color} filter="url(#glow-g)">
            <animate attributeName="cx" values={`${cx};${sp.x};${cx}`} dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${2 + i * 0.5}s`} />
            <animate attributeName="cy" values={`${cy};${sp.y + 22};${cy}`} dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${2 + i * 0.5}s`} />
            <animate attributeName="opacity" values="0;1;1;0" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${2 + i * 0.5}s`} />
          </circle>
        )
      })}

      {/* Cabinets */}
      {ALL_CABS.map((cab, idx) => {
        const cx = isoX(cab.col, cab.row)
        const cy = isoY(cab.col, cab.row)
        const hw = TW / 2
        const hh = TH / 2
        const h = CAB_H
        const servers = cab.row === 0 ? (cab.col < 2 ? 4 : 3) : (cab.col < 1 ? 3 : 2)
        const hasLeaf = cab.row === 0 || cab.col < 1
        const pad = 4 // inset from face edges

        // Helper: parallelogram band on the left face from fraction f1 to f2 (0=top, 1=bottom)
        const leftFaceBand = (f1: number, f2: number) => {
          const tl = { x: cx - hw + pad, y: cy - h + f1 * h }
          const tr = { x: cx - pad, y: cy + hh - h + f1 * h }
          const br = { x: cx - pad, y: cy + hh - h + f2 * h }
          const bl = { x: cx - hw + pad, y: cy - h + f2 * h }
          return `${tl.x},${tl.y} ${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}`
        }

        return (
          <g key={`cab-${idx}`} className="landing-cabinet" style={{ animationDelay: `${idx * 0.12}s` }}>
            <IsoBox col={cab.col} row={cab.row} h={CAB_H}
              topFill="#122030" leftFill="#0c1a28" rightFill="#081420"
              stroke="#1a3a5a"
            />

            {/* Leaf switch — filled cyan parallelogram at top of left face */}
            {hasLeaf && (
              <polygon
                points={leftFaceBand(0.04, 0.16)}
                fill="#00aaff" opacity="0.7" filter="url(#glow-c)"
                stroke="#00ddff" strokeWidth="0.5"
              />
            )}

            {/* Server bars — filled green parallelograms on left face */}
            {Array.from({ length: servers }, (_, si) => {
              const top = 0.20 + si * 0.19
              return (
                <polygon key={si}
                  points={leftFaceBand(top, top + 0.13)}
                  fill="#00ff88" opacity="0.65" filter="url(#glow-g)"
                  stroke="#00ff88" strokeWidth="0.3"
                />
              )
            })}

            {/* LED indicators on right face */}
            {[0.15, 0.35, 0.55].map((f, i) => (
              <circle key={i}
                cx={cx + hw - 6} cy={cy - h + f * h}
                r="2" fill={i === 2 ? '#ff6644' : '#00ff88'} filter={i === 2 ? 'url(#glow-o)' : 'url(#glow-g)'}
                className="landing-led" style={{ animationDelay: `${idx * 0.3 + i * 0.5}s` }}
              />
            ))}
          </g>
        )
      })}

      {/* Cooling unit (CRAC) */}
      <g className="landing-cabinet" style={{ animationDelay: '1.0s' }}>
        <IsoBox col={3} row={1} h={44}
          topFill="#0a2030" leftFill="#081822" rightFill="#061018"
          stroke="#00aaff" opacity={0.85}
        />
        {(() => {
          const cx = isoX(3, 1)
          const cy = isoY(3, 1)
          const fanY = cy - 44 + TH * 0.15
          return (
            <>
              {/* Spinning fan on top face */}
              <circle cx={cx} cy={fanY} r="8" fill="none" stroke="#00aaff" strokeWidth="0.8" opacity="0.5" />
              <g>
                <line x1={cx - 7} y1={fanY} x2={cx + 7} y2={fanY} stroke="#00aaff" strokeWidth="1.2" opacity="0.6">
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${fanY}`} to={`360 ${cx} ${fanY}`} dur="1.5s" repeatCount="indefinite" />
                </line>
                <line x1={cx} y1={fanY - 7} x2={cx} y2={fanY + 7} stroke="#00aaff" strokeWidth="1.2" opacity="0.6">
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${fanY}`} to={`360 ${cx} ${fanY}`} dur="1.5s" repeatCount="indefinite" />
                </line>
              </g>
            </>
          )
        })()}
      </g>

      {/* Heat shimmer on hot cabinet (col 2, row 0) */}
      {(() => {
        const cx = isoX(2, 0)
        const cy = isoY(2, 0) - CAB_H - TH / 2 - 2
        return (
          <g opacity="0.5">
            {[-6, 0, 6].map((dx, i) => (
              <line key={i} x1={cx + dx} y1={cy} x2={cx + dx + 1} y2={cy - 18} stroke="#ff6644" strokeWidth="1.2" filter="url(#glow-o)">
                <animate attributeName="y2" values={`${cy - 18};${cy - 26};${cy - 18}`} dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" />
              </line>
            ))}
          </g>
        )
      })()}

      {/* Revenue floating text */}
      {[0, 1].map((i) => {
        const cab = ALL_CABS[i]
        const cx = isoX(cab.col, cab.row)
        const startY = isoY(cab.col, cab.row) - CAB_H - TH / 2
        return (
          <text key={`rev-${i}`} x={cx} textAnchor="middle"
            fontSize="11" fill="#ffaa00" fontFamily="monospace" fontWeight="bold" filter="url(#glow-o)"
          >
            +$12
            <animate attributeName="y" values={`${startY};${startY - 32}`} dur="2.4s" repeatCount="indefinite" begin={`${2.5 + i * 0.8}s`} />
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
