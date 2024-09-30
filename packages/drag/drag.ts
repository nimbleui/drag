import { DataTypes, elDrag, MouseTouchEvent } from "@nimble-ui/move"
import type { ConfigTypes, Plugin } from "./types"

/**
 * 执行插件
 * @param plugins 插件列表 
 * @param pluginValue 插件返回值
 * @returns 
 */
function handlePlugins(plugins: Plugin[], pluginValue: Record<string, any>) {
  return (type: 'down' | 'move' | 'up', data: { data: DataTypes, e: MouseTouchEvent, citePlugins: Record<string, boolean> }) => {
    plugins.forEach((plugin) => {
      const checked = plugin.runRequire?.(data.data.target as HTMLElement, data.e) ?? true
      if (!checked) return
      plugin[type]?.({...data, pluginValue}, (val) => {
        pluginValue[`${plugin.name}-${type}`] = val
      })
    })
  }
}

/**
 * 获取引用那些插件
 * @param plugins 插件列表
 * @returns 
 */
function getCitePlugins(plugins: Plugin[]) {
  return plugins.reduce((acc, cur) => {
    acc[cur.name] = true
    return acc
  }, {} as Record<string, boolean>)
}

function getMoveDOMSite(target?: Element) {
  if (!target) return
  
}

export function drag(el: () => Element, config: ConfigTypes) {
  const { plugins = [], ...options } = config
  const pluginValue: Record<string, any> = {}
  const pluginType = handlePlugins(plugins, pluginValue)
  const citePlugins = getCitePlugins(plugins)

  return elDrag(el, {
    ...options,
    down(data, e) {
      pluginType('down', { data, e, citePlugins })
    },
    move(data, e) {
      pluginType('move', { data, e, citePlugins })
      getMoveDOMSite(data.target)
    },
  })
}