import type { OverlayModule } from '#/overlays'

const modules: Record<string, OverlayModule> = import.meta.glob(
  './**/index.ts',
  {
    eager: true,
    import: 'default',
  },
)

const overlays: Record<string, OverlayModule> = {}
for (const path in modules) {
  const name = modules[path]?.type
  if (name) {
    overlays[name] = modules[path]
  }
}

const overlayOptions = Object.values(overlays).map(v => ({
  label: v.name,
  value: v.type,
}))

export { overlays, overlayOptions }
