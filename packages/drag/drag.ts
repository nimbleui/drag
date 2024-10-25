import { elDrag } from "@nimble-ui/move"
import type { ConfigTypes, MoveRectList, Plugin, PluginOptions, ReturnData } from "./types"
import { getBoundingClientRectByScale, getParentTarget, isFunctionOrValue, objectTransform } from "@nimble-ui/utils"

/**
 * 执行插件
 * @param plugins 插件列表 
 * @param pluginValue 插件返回值
 * @returns 
 */
function handlePlugins(plugins: Plugin[], pluginValue: Record<string, any>) {
  return (type: 'down' | 'move' | 'up', data: Omit<PluginOptions, 'pluginValue' | "target">) => {
    plugins.forEach((plugin) => {
      const { e } = data
      const target = getParentTarget(e.target as HTMLElement, (el) => {
        return el.dataset.dragType === plugin.runTarge
      })
      if (!target) return

      plugin[type]?.({...data, target, pluginValue}, (val) => {
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
  return getParentTarget(target, (el) => el.dataset.dragType == 'move')
}

/**
 * 获取移动元素的位置信息
 * @param target 
 * @returns 
 */
function getMoveDOMSite(target: Element | null, options: ConfigTypes) {
  if (!target) return null
  const scale = isFunctionOrValue(options.scale)
  return getBoundingClientRectByScale(target, scale)
}

/**
 * 获取排除拖拽元素的所有可移动的的元素位置、大小
 * @param target 当前拖拽的元素
 * @param canvas 画布元素
 */
function getAllMoveSiteInfo(target: Element | null, scale: number, canvas?: Element) {
  const moves = canvas?.querySelectorAll('[data-drag-type="move"]')
  const moveSite: MoveRectList = []
  if (!moves) return moveSite
  for (let i = 0; i < moves.length; i++) {
    const el = moves[i];
    if (el == target) continue;
    const { width, height, left, top, bottom, right } = getBoundingClientRectByScale(el, scale);
    moveSite.push({ width, height, left, top, el, bottom, right })
  }
  return moveSite
}

const keys = ['disX', 'disY', 'startX', 'startY', 'moveX', 'moveY', 'isMove'] as Array<'disX' | 'disY' |'startX'| 'startY'| 'moveX'| 'moveY'| 'isMove'>

export function drag(el: () => Element, config: ConfigTypes) {
  const { plugins = [], ...options } = config
  const pluginValue: Record<string, any> = {}
  const pluginType = handlePlugins(plugins, pluginValue)
  const citePlugins = getCitePlugins(plugins)

  return elDrag(el, {
    ...options,
    down(data, e) {
      const values = objectTransform(data, keys);
      // 获取当前移动的元素
      const moveEl = getMoveDOM(e.target as Element);
      // 缩放比例
      const scale = isFunctionOrValue(options.scale) || 1;
      // 移动元素的宽高、大小
      const targetSite = getMoveDOMSite(moveEl, options)!;
      const moves = getAllMoveSiteInfo(moveEl, scale, data.binElement);
      // 画布位置信息
      const canvasSite = getBoundingClientRectByScale(data.binElement!, scale)

      pluginType('down', { canvasEl: data.binElement!, ...values, e, citePlugins, moveEl, scale, moves, targetSite, canvasSite })
      return { moveEl, scale, moves, targetSite, canvasSite }
    },
    move(data, e, value) {
      const down = value.down as ReturnData
      const site = getMoveDOMSite(down.moveEl, options)
      const values = objectTransform(data, keys)
      pluginType('move', { canvasEl: data.binElement!,  e, citePlugins, ...values, ...down })
      down.moveEl && options.changeSiteOrSize?.(down.moveEl, site)
    },
    up(data, e, value) {
      const down = value.down as ReturnData
      const values = objectTransform(data, keys)
      pluginType('up', { canvasEl: data.binElement!,  e, citePlugins, ...values, ...down })
    },
  })
}