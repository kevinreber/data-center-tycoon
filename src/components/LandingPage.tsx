import { useState } from 'react'
import { Server, Network, Thermometer, Zap, DollarSign, Globe, Shield, Cpu, Play, Eye, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LandingHero } from '@/components/LandingHero'

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
    <main className={`fixed inset-0 z-[200] bg-background flex flex-col items-center overflow-y-auto font-mono transition-opacity duration-500 ${exiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none scanlines z-10" aria-hidden="true" />

      {/* Hero section */}
      <header className="flex flex-col items-center justify-center w-full max-w-4xl px-4 pt-12 md:pt-16 pb-6 relative z-20">
        {/* Version badge */}
        <span className="text-[10px] tracking-widest text-neon-cyan/60 border border-neon-cyan/20 rounded px-2 py-0.5 mb-4 landing-fade-in" style={{ animationDelay: '0.1s' }}>
          v0.6.2
        </span>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-[0.2em] text-neon-green text-glow-green landing-title mb-2">
          DATA CENTER TYCOON
        </h1>
        <p className="text-sm md:text-base text-muted-foreground tracking-widest mb-1 landing-fade-in" style={{ animationDelay: '0.3s' }} role="doc-subtitle">
          DATA CENTER SIMULATOR
        </p>
        <div className="flex items-center gap-2 mb-8 landing-fade-in" style={{ animationDelay: '0.5s' }}>
          <span className="h-px w-12 bg-neon-green/30" />
          <span className="text-[10px] text-neon-green/50 tracking-widest">BUILD &middot; CONNECT &middot; SCALE</span>
          <span className="h-px w-12 bg-neon-green/30" />
        </div>

        {/* Hero illustration (same hardware art as the game) */}
        <div className="w-full max-w-xl mb-8 landing-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="relative rounded-xl border border-neon-green/20 bg-card/80 p-4 glow-green overflow-hidden">
            <LandingHero />
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
      </header>

      {/* Feature grid */}
      <section className="w-full max-w-4xl px-4 pb-12 relative z-20" aria-label="Game features">
        <h2 className="sr-only">Game Features</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map((feat, i) => (
            <article
              key={feat.label}
              className="rounded-lg border border-border/50 bg-card/60 p-3 hover:border-neon-green/30 hover:bg-card/80 transition-colors duration-300 landing-fade-in"
              style={{ animationDelay: `${1.2 + i * 0.1}s` }}
            >
              <feat.icon className={`size-5 ${feat.color} mb-2`} aria-hidden="true" />
              <h3 className="text-xs font-bold text-foreground mb-1">{feat.label}</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{feat.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border/30 py-4 text-center relative z-20 landing-fade-in" style={{ animationDelay: '2.2s' }}>
        <p className="text-[10px] text-muted-foreground/50 tracking-wider">
          DC TYCOON v0.6.2 &middot; BUILT WITH REACT + PHASER + ZUSTAND
        </p>
      </footer>
    </main>
  )
}
