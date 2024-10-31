import { elDrag } from "@nimble-ui/move"
import type { ConfigTypes, RunTarge, MoveRect, MoveRectList, Plugin, PluginOptions, ReturnData } from "./types"
import { getBoundingClientRectByScale, getParentTarget, isFunctionOrValue, objectTransform } from "@nimble-ui/utils"
import { createElement } from "./createEl"

/**
 * 执行插件
 * @param plugins 插件列表 
 * @param pluginValue 插件返回值
 * @returns 
 */
function handlePlugins(plugins: Plugin[]) {
  const returnValue: Record<string, { down?: any; move?: any }> = {}
  return (type: 'down' | 'move' | 'up', data: Omit<PluginOptions, 'funValue' | "target">) => {
    const elType = data.type || 'canvas';
    plugins.forEach((plugin) => {
      if (elType !== plugin.runTarge) return
      if (!returnValue[plugin.name]) {
        returnValue[plugin.name] = {}
      }

      plugin[type]?.({ ...data, funValue: returnValue[plugin.name] }, (val) => {
        returnValue[plugin.name][type] = val
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
    acc[cur.runTarge] = true
    return acc
  }, {} as Record<RunTarge, boolean>)
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
 * 获取所有可移动的的元素位置、大小、设置选择状态
 * @param target 当前拖拽的元素
 * @param canvas 画布元素
 */
function getAllMoveSiteInfo(target: Element, scale: number, canvas: Element) {
  const moves = canvas?.querySelectorAll('[data-drag-type="move"]')
  // 判断是否点击可操作的元素中
  let type = target.getAttribute("data-drag-type")
  let currentEl: Element | null = null

  if (!type || type == 'move') {
    currentEl = getMoveDOM(target);
    currentEl && (type = currentEl?.getAttribute("data-drag-type"));
  } else {
    currentEl = canvas.querySelector('[data-drag-active="true"]');
  }

  let currentSite: Omit<MoveRect, 'el'> | null = null
  const moveSite: MoveRectList = [];
  if (!moves) return { moveSite, currentEl, currentSite, type: null };

  for (let i = 0; i < moves.length; i++) {
    const el = moves[i];
    const { width, height, left, top, bottom, right } = getBoundingClientRectByScale(el, scale);
    if (el == currentEl) {
      currentEl.setAttribute("data-drag-active", 'true');
      currentSite = { width, height, left, top, bottom, right }
    } else {
      // 如果当前元素不是操作元素就移出选择的状态
      !type && el.removeAttribute('data-drag-active')
      moveSite.push({ width, height, left, top, el, bottom, right })
    }
  }

  return { currentEl, moveSite, currentSite, type: type as RunTarge };
}

const keys = ['disX', 'disY', 'startX', 'startY', 'moveX', 'moveY', 'isMove'] as Array<'disX' | 'disY' |'startX'| 'startY'| 'moveX'| 'moveY'| 'isMove'>

export function drag(el: () => Element, config: ConfigTypes) {
  const { plugins = [], ...options } = config
  const pluginType = handlePlugins(plugins)
  const usePlugins = getCitePlugins(plugins)

  return elDrag(el, {
    ...options,
    down(data, e) {
      const values = objectTransform(data, keys);
      // 缩放比例
      const scale = isFunctionOrValue(options.scale) || 1;
      // // 移动元素的宽高、大小
      const { moveSite, currentEl, currentSite, type } = getAllMoveSiteInfo(e.target as Element, scale, data.binElement!);
      // 画布位置信息
      const canvasSite = getBoundingClientRectByScale(data.binElement!, scale);
      // 点击的元素
      const eventTarget = e.target as HTMLElement;
      // 创建点
      const createEl= createElement({ ...usePlugins, target: currentEl, canvas: data.binElement! });
      createEl()

      pluginType('down', {
        ...values,
        e,
        type,
        scale,
        moveSite,
        currentEl,
        currentSite,
        canvasSite,
        eventTarget,
        canvasEl: data.binElement!,
      })
      return { createEl, currentEl, scale, moveSite, currentSite, canvasSite, eventTarget, type }
    },
    move(data, e, value) {
      const down = value.down as ReturnData
      const values = objectTransform(data, keys)
      pluginType('move', { canvasEl: data.binElement!,  e, ...values, ...down })

      if (down.currentEl) {
        const site = getBoundingClientRectByScale(down.currentEl, down.scale)
        options.changeSiteOrSize?.(down.currentEl, site);
        down.createEl();
      }
    },
    up(data, e, value) {
      const down = value.down as ReturnData
      const values = objectTransform(data, keys)
      pluginType('up', { canvasEl: data.binElement!,  e, ...values, ...down })
    },
  })
}