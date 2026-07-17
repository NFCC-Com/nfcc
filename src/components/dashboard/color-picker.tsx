import { HexColorPicker } from 'react-colorful'

import { Button } from '#/components/ui/button.tsx'
import { Input } from '#/components/ui/input.tsx'
import { Label } from '#/components/ui/label.tsx'
import { Popover, PopoverContent, PopoverPositioner, PopoverTrigger } from '#/components/ui/popover.tsx'

const PRESETS = [
  '#0b1220',
  '#ea580c',
  '#ffffff',
  '#000000',
  '#1d4ed8',
  '#059669',
  '#b91c1c',
  '#7c3aed',
  '#d97706',
  '#db2777',
  '#0891b2',
  '#65a30d',
]

type ColorPickerProps = {
  value: string
  onChange: (hex: string) => void
  label: string
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs">{label}</Label>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="size-9 shrink-0 rounded-md border-2 p-0"
              style={{ borderColor: 'var(--border)', backgroundColor: value }}
              aria-label={`Pick ${label.toLowerCase()} color`}
            />
          </PopoverTrigger>
          <PopoverPositioner align="start" sideOffset={8}>
            <PopoverContent className="w-56 p-3">
            <HexColorPicker
              color={value}
              onChange={onChange}
              style={{ width: '100%', height: 160 }}
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {PRESETS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className="size-5 rounded-sm border border-border ring-offset-background transition-shadow hover:ring-2 hover:ring-ring focus:ring-2 focus:ring-ring"
                  style={{ backgroundColor: hex }}
                  onClick={() => onChange(hex)}
                  aria-label={`Set color ${hex}`}
                />
              ))}
            </div>
          </PopoverContent>
          </PopoverPositioner>
        </Popover>

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 min-w-0 font-mono text-xs"
        />
      </div>
    </div>
  )
}
