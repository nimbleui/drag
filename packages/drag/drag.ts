import { DataTypes, elDrag, MouseTouchEvent } from "@nimble-ui/move"
import type { ConfigTypes, Plugin } from "./types"
import { getBoundingClientRectByScale, getParentTarget, isFunctionOrValue } from "@nimble-ui/utils"

/**
 * 执行插件
 * @param plugins 插件列表 
 * @param pluginValue 插件返回值
 * @returns 
 */
function handlePlugins(plugins: Plugin[], pluginValue: Record<string, any>) {
  return (type: 'down' | 'move' | 'up', data: { data: DataTypes, e: MouseTouchEvent, citePlugins: Record<string, boolean>, moveEl: HTMLElement | null }) => {
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

/**
 * 获取移动元素
 * @param target 
 * @returns 
 */
function getMoveDOM(target?: Element) {
  if (!target) return null
  return getParentTarget(target, (el) => el.dataset.dragInfo == 'move')
}

/**
 * 获取移动元素的位置信息
 * @param target 
 * @returns 
 */
function getMoveDOMSite(target: HTMLElement | null, options: ConfigTypes) {
  if (!target) return null
  const scale = isFunctionOrValue(options.scale)
  const { top, left, width, height } = getBoundingClientRectByScale(target, scale);
  return {top, left, width, height}
}

export function drag(el: () => Element, config: ConfigTypes) {
  const { plugins = [], ...options } = config
  const pluginValue: Record<string, any> = {}
  const pluginType = handlePlugins(plugins, pluginValue)
  const citePlugins = getCitePlugins(plugins)

  return elDrag(el, {
    ...options,
    down(data, e) {
      const moveEl = getMoveDOM(data.target)
      pluginType('down', { data, e, citePlugins, moveEl })
    },
    move(data, e) {
      const moveEl = getMoveDOM(data.target)
      const site = getMoveDOMSite(moveEl, options)
      pluginType('move', { data, e, citePlugins, moveEl })
      options.changeSiteOrSize?.(moveEl, site)
    },
  })
}