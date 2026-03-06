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
  return (
    <svg viewBox="0 0 480 320" className="w-full max-w-xl mx-auto" aria-label="Isometric data center illustration">
      <defs>
        {/* Glow filters */}
        <filter id="glow-g" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-c" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-o" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Floor grid lines */}
      <g opacity="0.15" stroke="#00ff88" strokeWidth="0.5">
        {Array.from({ length: 9 }, (_, i) => {
          const x = 80 + i * 40
          return <line key={`v${i}`} x1={x} y1={240 - (i * 5)} x2={x + 80} y2={280 - (i * 5)} />
        })}
        {Array.from({ length: 5 }, (_, i) => {
          const y = 250 + i * 8
          return <line key={`h${i}`} x1={80 + i * 20} y1={y} x2={400 + i * 20} y2={y} />
        })}
      </g>

      {/* Cabinet Row 1 - 4 cabinets */}
      {[0, 1, 2, 3].map((i) => (
        <g key={`cab1-${i}`} className="landing-cabinet" style={{ animationDelay: `${i * 0.15}s` }}>
          <IsoCabinet x={120 + i * 70} y={170 - i * 10} servers={i < 3 ? 4 : 2} hasLeaf={i < 3} />
        </g>
      ))}

      {/* Cabinet Row 2 - 3 cabinets */}
      {[0, 1, 2].map((i) => (
        <g key={`cab2-${i}`} className="landing-cabinet" style={{ animationDelay: `${0.6 + i * 0.15}s` }}>
          <IsoCabinet x={155 + i * 70} y={205 - i * 10} servers={i < 2 ? 3 : 1} hasLeaf={i < 2} />
        </g>
      ))}

      {/* Spine switches at top */}
      {[0, 1].map((i) => (
        <g key={`spine-${i}`} className="landing-spine" style={{ animationDelay: `${1.1 + i * 0.2}s` }}>
          <IsoSpine x={200 + i * 80} y={90 - i * 5} />
        </g>
      ))}

      {/* Traffic lines (leaf→spine) */}
      <g className="landing-traffic">
        {/* Links from row 1 cabinets to spines */}
        <TrafficLine x1={145} y1={155} x2={215} y2={82} delay={1.5} />
        <TrafficLine x1={215} y1={145} x2={215} y2={82} delay={1.6} />
        <TrafficLine x1={145} y1={155} x2={295} y2={77} delay={1.7} />
        <TrafficLine x1={285} y1={135} x2={295} y2={77} delay={1.8} />
        {/* Links from row 2 cabinets to spines */}
        <TrafficLine x1={180} y1={190} x2={215} y2={82} delay={1.9} />
        <TrafficLine x1={250} y1={180} x2={295} y2={77} delay={2.0} />
      </g>

      {/* Animated packet dots along traffic lines */}
      <g className="landing-packets">
        <PacketDot cx1={145} cy1={155} cx2={215} cy2={82} delay={2.2} color="#00ff88" />
        <PacketDot cx1={215} cy1={145} cx2={295} cy2={77} delay={2.5} color="#00aaff" />
        <PacketDot cx1={285} cy1={135} cx2={215} cy2={82} delay={2.8} color="#00ff88" />
        <PacketDot cx1={180} cy1={190} cx2={295} cy2={77} delay={3.1} color="#00aaff" />
      </g>

      {/* LED blink indicators on cabinets */}
      {[0, 1, 2].map((i) => (
        <circle
          key={`led-${i}`}
          cx={130 + i * 70}
          cy={152 - i * 10}
          r="2"
          fill="#00ff88"
          filter="url(#glow-g)"
          className="landing-led"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}

      {/* Heat shimmer lines on hot cabinet */}
      <g className="landing-heat" opacity="0.5">
        <line x1={310} y1={135} x2={312} y2={120} stroke="#ff6644" strokeWidth="1" filter="url(#glow-o)">
          <animate attributeName="y2" values="120;115;120" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1={315} y1={133} x2={317} y2={118} stroke="#ff6644" strokeWidth="1" filter="url(#glow-o)">
          <animate attributeName="y2" values="118;112;118" dur="2.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.3s" repeatCount="indefinite" />
        </line>
      </g>

      {/* Cooling unit */}
      <g className="landing-cabinet" style={{ animationDelay: '1.3s' }}>
        <rect x={370} y={175} width={30} height={35} rx="2" fill="#0a1520" stroke="#00aaff" strokeWidth="1" opacity="0.8" />
        <text x={385} y={196} textAnchor="middle" fontSize="7" fill="#00aaff" fontFamily="monospace" filter="url(#glow-c)">CRAC</text>
        {/* Fan animation */}
        <g transform="translate(385, 185)">
          <circle r="5" fill="none" stroke="#00aaff" strokeWidth="0.5" opacity="0.4" />
          <line x1="-4" y1="0" x2="4" y2="0" stroke="#00aaff" strokeWidth="0.8" opacity="0.6">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1.5s" repeatCount="indefinite" />
          </line>
        </g>
      </g>

      {/* Dollar signs floating up (revenue) */}
      {[0, 1, 2].map((i) => (
        <text
          key={`dollar-${i}`}
          x={150 + i * 65}
          fontSize="9"
          fill="#ffaa00"
          fontFamily="monospace"
          fontWeight="bold"
          filter="url(#glow-o)"
          className="landing-dollar"
          style={{ animationDelay: `${2.5 + i * 0.8}s` }}
        >
          +$12
          <animate attributeName="y" values="145;120" dur="2.4s" repeatCount="indefinite" begin={`${2.5 + i * 0.8}s`} />
          <animate attributeName="opacity" values="0;1;1;0" dur="2.4s" repeatCount="indefinite" begin={`${2.5 + i * 0.8}s`} />
        </text>
      ))}
    </svg>
  )
}

/** Isometric cabinet with servers */
function IsoCabinet({ x, y, servers, hasLeaf }: { x: number; y: number; servers: number; hasLeaf: boolean }) {
  const w = 32
  const h = 50
  return (
    <g>
      {/* Cabinet frame - left face */}
      <polygon
        points={`${x},${y} ${x - w / 2},${y + h / 4} ${x - w / 2},${y + h / 4 + h} ${x},${y + h}`}
        fill="#0c1a28"
        stroke="#1a3a5a"
        strokeWidth="0.8"
      />
      {/* Cabinet frame - right face */}
      <polygon
        points={`${x},${y} ${x + w / 2},${y + h / 4} ${x + w / 2},${y + h / 4 + h} ${x},${y + h}`}
        fill="#081420"
        stroke="#1a3a5a"
        strokeWidth="0.8"
      />
      {/* Cabinet frame - top face */}
      <polygon
        points={`${x},${y} ${x - w / 2},${y + h / 4} ${x},${y + h / 2} ${x + w / 2},${y + h / 4}`}
        fill="#122030"
        stroke="#1a3a5a"
        strokeWidth="0.8"
      />

      {/* Server slots (green bars on left face) */}
      {Array.from({ length: servers }, (_, i) => (
        <line
          key={i}
          x1={x - w / 2 + 3}
          y1={y + h / 4 + 8 + i * 10}
          x2={x - 3}
          y2={y + 4 + i * 10}
          stroke="#00ff88"
          strokeWidth="3"
          opacity="0.7"
          filter="url(#glow-g)"
        />
      ))}

      {/* Leaf switch on top (cyan) */}
      {hasLeaf && (
        <line
          x1={x - w / 2 + 3}
          y1={y + h / 4 + 4}
          x2={x - 3}
          y2={y}
          stroke="#00aaff"
          strokeWidth="2.5"
          opacity="0.8"
          filter="url(#glow-c)"
        />
      )}
    </g>
  )
}

/** Isometric spine switch */
function IsoSpine({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 20} y={y} width={40} height={14} rx="2" fill="#1a1005" stroke="#ff6644" strokeWidth="1" />
      <line x1={x - 15} y1={y + 7} x2={x + 15} y2={y + 7} stroke="#ff6644" strokeWidth="2" opacity="0.6" filter="url(#glow-o)" />
      <text x={x} y={y + 10} textAnchor="middle" fontSize="6" fill="#ff6644" fontFamily="monospace" opacity="0.8">SPINE</text>
    </g>
  )
}

/** Animated traffic line */
function TrafficLine({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="#00ff8844"
      strokeWidth="1"
      strokeDasharray="4 4"
      className="landing-traffic-line"
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

/** Animated packet dot moving along a path */
function PacketDot({ cx1, cy1, cx2, cy2, delay, color }: { cx1: number; cy1: number; cx2: number; cy2: number; delay: number; color: string }) {
  return (
    <circle r="2.5" fill={color} filter="url(#glow-g)">
      <animate attributeName="cx" values={`${cx1};${cx2};${cx1}`} dur="3s" repeatCount="indefinite" begin={`${delay}s`} />
      <animate attributeName="cy" values={`${cy1};${cy2};${cy1}`} dur="3s" repeatCount="indefinite" begin={`${delay}s`} />
      <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" begin={`${delay}s`} />
    </circle>
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
