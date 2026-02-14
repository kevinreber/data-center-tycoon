import { useGameStore } from '@/stores/gameStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function HUD() {
  const { racks, totalPower, addRack, togglePower } = useGameStore()

  return (
    <div className="flex gap-4 mt-4">
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono">BUILD</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addRack('server')}
            className="font-mono text-xs"
          >
            + Server
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addRack('leaf_switch')}
            className="font-mono text-xs"
          >
            + Leaf Switch
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addRack('spine_switch')}
            className="font-mono text-xs"
          >
            + Spine Switch
          </Button>
        </CardContent>
      </Card>

      <Card className="w-48">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono">POWER</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-mono font-bold">{totalPower}W</p>
          <p className="text-xs text-muted-foreground font-mono">
            {racks.length} nodes deployed
          </p>
        </CardContent>
      </Card>

      {racks.length > 0 && (
        <Card className="flex-1 max-w-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono">NODES</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-1 flex-wrap max-h-24 overflow-y-auto">
            {racks.map((r) => (
              <Badge
                key={r.id}
                variant={r.powerStatus ? 'default' : 'secondary'}
                className="cursor-pointer font-mono text-xs"
                onClick={() => togglePower(r.id)}
              >
                {r.type === 'server'
                  ? 'SRV'
                  : r.type === 'leaf_switch'
                    ? 'LEAF'
                    : 'SPINE'}
                {r.powerStatus ? '' : ' OFF'}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
