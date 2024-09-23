import { DataTypes, elDrag, MouseTouchEvent } from "@nimble-ui/move"
import type { ConfigTypes, Plugin } from "./types"

function handlePlugins(plugins: Plugin[]) {
  return (type: 'down' | 'move' | 'up', data: { data: DataTypes, e: MouseTouchEvent, value: Record<string, any> }) => {
    plugins.forEach((plugin) => {
      plugin[type]?.(data, (val) => {
        data.value[`${plugin.name}-${type}`] = val
      })
    })
  }
}

export function drag(el: () => Element, config: ConfigTypes) {
  const { plugins = [], ...options } = config
  const pluginType = handlePlugins(plugins)
  const pluginValue: Record<string, any> = {}

  elDrag(el, {
    ...options,
    down(data, e) {
      pluginType('down', { data, e, value: pluginValue })
    },
    move(data, e, value) {
      pluginType('move', { data, e, value: pluginValue })
    },
  })
}