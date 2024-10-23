import { elDrag } from "@nimble-ui/move"
import type { ConfigTypes, MoveRectList, Plugin, PluginOptions } from "./types"
import { getBoundingClientRectByScale, getParentTarget, isFunctionOrValue } from "@nimble-ui/utils"

/**
 * 执行插件
 * @param plugins 插件列表 
 * @param pluginValue 插件返回值
 * @returns 
 */
function handlePlugins(plugins: Plugin[], pluginValue: Record<string, any>) {
  return (type: 'down' | 'move' | 'up', data: Omit<PluginOptions, 'pluginValue'>) => {
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
  return { top, left, width, height }
}

/**
 * 获取排除拖拽元素的所有可移动的的元素位置、大小
 * @param target 当前拖拽的元素
 * @param canvas 画布元素
 */
function getAllMoveSiteInfo(target: Element | null, scale: number, canvas?: Element) {
  const moves = canvas?.querySelectorAll('[data-drag-info="move"]')
  const moveSite: MoveRectList = []
  if (!moves) return moveSite
  for (let i = 0; i < moves.length; i++) {
    const el = moves[i];
    if (el == target) continue;
    const { width, height, left, top } = getBoundingClientRectByScale(el, scale);
    moveSite.push({ width, height, left, top, el })
  }
  return moveSite
}

export function drag(el: () => Element, config: ConfigTypes) {
  const { plugins = [], ...options } = config
  const pluginValue: Record<string, any> = {}
  const pluginType = handlePlugins(plugins, pluginValue)
  const citePlugins = getCitePlugins(plugins)

  return elDrag(el, {
    ...options,
    down(data, e) {
      const { binElement } = data
      const target = getMoveDOM(data.target)
      const scale = isFunctionOrValue(options.scale) || 1
      const moves = getAllMoveSiteInfo(target, scale, binElement) 
      const targetSite = getMoveDOMSite(target, options)!;

      pluginType('down', { data, e, citePlugins, target, scale, moves, targetSite })
      return { target, scale, moves }
    },
    move(data, e, value) {
      const { target } = value.down
      const site = getMoveDOMSite(target, options)
      pluginType('move', { data, e, citePlugins, ...value.down })
      options.changeSiteOrSize?.(target, site)
    },
    up(data, e, value) {
      pluginType('up', { data, e, citePlugins, ...value.down })
    },
  })
}