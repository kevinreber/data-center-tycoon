import { useGameStore, SECURITY_TIER_CONFIG, COMPLIANCE_CERT_CONFIG, SECURITY_FEATURE_CONFIG } from '@/stores/gameStore'
import type { SecurityTier } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock, FileCheck, Eye, AlertTriangle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function SecurityPanel() {
  const {
    securityTier, installedSecurityFeatures, upgradeSecurityTier, money,
    complianceCerts, startComplianceAudit, auditCooldown,
    intrusionsBlocked, securityMaintenanceCost,
    reputationScore, staff, tickCount,
  } = useGameStore()

  const currentTierConfig = SECURITY_TIER_CONFIG.find((c) => c.tier === securityTier)
  const tierOrder: SecurityTier[] = ['basic', 'enhanced', 'high_security', 'maximum']
  const currentTierIdx = tierOrder.indexOf(securityTier)

  const secOfficers = staff.filter((s) => s.role === 'security_officer').length

  const totalDefense = installedSecurityFeatures.reduce((sum, fId) => {
    const feat = SECURITY_FEATURE_CONFIG.find((f) => f.id === fId)
    return sum + (feat?.intrusionDefense ?? 0)
  }, 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Security Tier */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="size-3" style={{ color: currentTierConfig?.color ?? '#888' }} />
          <span className="text-xs font-bold" style={{ color: currentTierConfig?.color ?? '#888' }}>
            SECURITY TIER
          </span>
          <Badge
            className="ml-auto font-mono text-xs border"
            style={{
              backgroundColor: `${currentTierConfig?.color ?? '#888'}20`,
              color: currentTierConfig?.color ?? '#888',
              borderColor: `${currentTierConfig?.color ?? '#888'}40`,
            }}
          >
            {currentTierConfig?.label ?? securityTier}
          </Badge>
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Maintenance</span>
            <span className="text-neon-orange tabular-nums">${securityMaintenanceCost}/tick</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Defense Rating</span>
            <span className="text-neon-green tabular-nums">{Math.round(totalDefense * 100)}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Intrusions Blocked</span>
            <span className="text-neon-green tabular-nums">{intrusionsBlocked}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Security Officers</span>
            <span className="text-foreground tabular-nums">{secOfficers}</span>
          </div>
        </div>

        {/* Installed Features */}
        <div className="mb-2">
          <p className="text-xs text-muted-foreground mb-1">Installed Features:</p>
          <div className="flex flex-wrap gap-1">
            {installedSecurityFeatures.map((fId) => {
              const feat = SECURITY_FEATURE_CONFIG.find((f) => f.id === fId)
              return (
                <Tooltip key={fId}>
                  <TooltipTrigger asChild>
                    <Badge className="bg-card border border-border text-xs text-foreground">
                      {feat?.label ?? fId}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-52">
                    {feat?.description}
                    <br />Defense: +{Math.round((feat?.intrusionDefense ?? 0) * 100)}%
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </div>

        {/* Upgrade Options */}
        {currentTierIdx < tierOrder.length - 1 && (
          <div className="flex flex-col gap-1">
            {SECURITY_TIER_CONFIG
              .filter((config) => tierOrder.indexOf(config.tier) > currentTierIdx)
              .map((config) => (
                <Tooltip key={config.tier}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => upgradeSecurityTier(config.tier)}
                      disabled={money < config.cost || tierOrder.indexOf(config.tier) !== currentTierIdx + 1}
                      className="justify-between font-mono text-xs transition-all"
                      style={{
                        borderColor: `${config.color}30`,
                      }}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <Lock className="size-3" style={{ color: config.color }} />
                        {config.label}
                      </span>
                      <span className="text-muted-foreground">${config.cost.toLocaleString()}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-52">
                    {config.description}
                    <br />Maintenance: ${config.maintenancePerTick}/tick
                    <br />Includes: {config.featuresIncluded.join(', ')}
                  </TooltipContent>
                </Tooltip>
              ))}
          </div>
        )}
        {securityTier === 'maximum' && (
          <p className="text-xs text-neon-green/60 italic mt-1">Maximum security achieved.</p>
        )}
      </div>

      {/* Compliance Certifications */}
      <div className="border-t border-border pt-3">
        <div className="flex items-center gap-2 mb-2">
          <FileCheck className="size-3 text-neon-cyan" />
          <span className="text-xs font-bold text-neon-cyan">COMPLIANCE</span>
          {complianceCerts.filter((c) => !c.auditInProgress && c.grantedAtTick > 0).length > 0 && (
            <Badge className="ml-auto bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 font-mono text-xs">
              {complianceCerts.filter((c) => !c.auditInProgress && c.grantedAtTick > 0).length} ACTIVE
            </Badge>
          )}
        </div>
        {auditCooldown > 0 && (
          <p className="text-xs text-neon-yellow/60 mb-2">Audit cooldown: {auditCooldown} ticks</p>
        )}

        {/* Active Certs */}
        {complianceCerts.length > 0 && (
          <div className="flex flex-col gap-1 mb-2 pb-2 border-b border-border/50">
            {complianceCerts.map((cert) => {
              const config = COMPLIANCE_CERT_CONFIG.find((c) => c.id === cert.certId)
              if (!config) return null
              const isExpiringSoon = !cert.auditInProgress && cert.expiresAtTick - tickCount < 30
              return (
                <div key={cert.certId} className="flex items-center justify-between text-xs p-1 rounded border border-border/50">
                  <span style={{ color: config.color }}>{config.label}</span>
                  {cert.auditInProgress ? (
                    <Badge className="bg-neon-yellow/20 text-neon-yellow text-xs border-neon-yellow/30 animate-pulse">
                      AUDITING
                    </Badge>
                  ) : isExpiringSoon ? (
                    <span className="text-neon-red text-xs flex items-center gap-1">
                      <AlertTriangle className="size-3" />
                      {cert.expiresAtTick - tickCount}t
                    </span>
                  ) : (
                    <span className="text-neon-green tabular-nums">{cert.expiresAtTick - tickCount}t</span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Available Audits */}
        <div className="flex flex-col gap-1">
          {COMPLIANCE_CERT_CONFIG.map((config) => {
            const held = complianceCerts.some((c) => c.certId === config.id && !c.auditInProgress && c.grantedAtTick > 0)
            const auditing = complianceCerts.some((c) => c.certId === config.id && c.auditInProgress)
            const meetsSecurityTier = tierOrder.indexOf(securityTier) >= tierOrder.indexOf(config.requirements.minSecurityTier)
            const meetsFeatures = config.requirements.requiredFeatures.every((f) => installedSecurityFeatures.includes(f))
            const meetsRep = reputationScore >= config.requirements.minReputation
            const meetsStaff = secOfficers >= config.requirements.minSecurityOfficers

            return (
              <Tooltip key={config.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startComplianceAudit(config.id)}
                    disabled={auditing || auditCooldown > 0 || money < config.auditCost || !meetsSecurityTier || !meetsFeatures || !meetsRep || !meetsStaff}
                    className="justify-between font-mono text-xs transition-all"
                    style={{ borderColor: `${config.color}30` }}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Eye className="size-3" style={{ color: config.color }} />
                      {held ? 'Re-audit' : 'Audit'}: {config.label}
                    </span>
                    <span className="text-muted-foreground">${config.auditCost.toLocaleString()}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-56">
                  {config.description}
                  <br />Duration: {config.auditDurationTicks} ticks
                  <br />Revenue bonus: +{Math.round(config.revenueBonus * 100)}%
                  <br />Valid for: {config.auditInterval} ticks
                  {!meetsSecurityTier && <><br /><span className="text-neon-red">Needs: {config.requirements.minSecurityTier} security</span></>}
                  {!meetsRep && <><br /><span className="text-neon-red">Needs: {config.requirements.minReputation} reputation</span></>}
                  {!meetsStaff && <><br /><span className="text-neon-red">Needs: {config.requirements.minSecurityOfficers} security officer(s)</span></>}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>
    </div>
  )
}
