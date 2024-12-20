import { elDrag } from '@nimble-ui/move';
import type {
  ConfigTypes,
  RunTarge,
  MoveRect,
  MoveRectList,
  Plugin,
  PluginOptions,
  ReturnData,
  SiteInfo,
} from './types';
import {
  getBoundingClientRectByScale,
  getDOMSite,
  getParentTarget,
  isFunctionOrValue,
  objectTransform,
} from '@nimble-ui/utils';
import { DRAG_TYPE, DRAG_ACTIVE, DRAG_DISABLED, DRAG_ID, DRAG_GROUP, DRAG_GROUP_ID } from "@nimble-ui/constant";
import { createElement } from './createEl';

/**
 * 执行插件
 * @param plugins 插件列表
 * @param pluginValue 插件返回值
 * @returns
 */
function handlePlugins(plugins: Plugin[]) {
  const returnValue: Record<string, { down?: any; move?: any }> = {};
  return (
    type: 'down' | 'move' | 'up',
    data: Omit<PluginOptions, 'funValue'>
  ) => {
    const elType = data.type || 'area';
    plugins.forEach((plugin) => {
      const { runTarge, name, allDown } = plugin;

      type == 'down' && allDown?.({...data, type: elType});
      const checked = Array.isArray(runTarge)
        ? runTarge.includes(elType)
        : elType === runTarge;
      if (!checked) return;

      if (!returnValue[name]) returnValue[name] = {};
      plugin[type]?.(
        { ...data, type: elType, funValue: returnValue[name] },
        (val) => {
          returnValue[name][type] = val;
        }
      );
    });
  };
}

/**
 * 获取引用那些插件
 * @param plugins 插件列表
 * @returns
 */
function getCitePlugins(plugins: Plugin[]) {
  return plugins.reduce((acc, cur) => {
    if (Array.isArray(cur.runTarge)) {
      cur.runTarge.forEach((value) => (acc[value] = true));
    } else {
      acc[cur.runTarge] = true;
    }
    return acc;
  }, {} as Record<RunTarge, boolean>);
}

/**
 * 获取移动元素
 * @param target
 * @returns
 */
function getMoveDOM(target?: Element) {
  if (!target) return null;
  return getParentTarget(target, (el) => el.dataset.dragType == 'move');
}

/**
 * 获取所有可移动的的元素位置、大小、设置选择状态
 * @param target 当前拖拽的元素
 * @param canvas 画布元素
 */
function getAllMoveSiteInfo(target: Element, scale: number, canvas: Element, config: ConfigTypes) {
  // 获取所有可以移动的元素
  const moves = canvas.querySelectorAll(`[${DRAG_TYPE}="move"]`);

  // 判断是否点击可操作的元素中
  let type = target.getAttribute(DRAG_TYPE);
  let currentEl: Element | null = null;

  // 获取当前操作的元素
  if (!type || type == 'move') {
    currentEl = getMoveDOM(target);
    currentEl && (type = currentEl?.getAttribute(DRAG_TYPE));
  } else {
    currentEl = canvas.querySelector(`[${DRAG_ACTIVE}="true"]`);
  }

  let currentSite: Omit<MoveRect, 'el'> | null = null;
  const moveSite: MoveRectList = [];
  if (!moves) return { moveSite, currentEl, currentSite, type: null };

  for (let i = 0; i < moves.length; i++) {
    const el = moves[i];
    // 获取元素位置信息
    const { width, height, left, top, bottom, right } =
      getBoundingClientRectByScale(el, scale);
    if (el == currentEl) {
      currentSite = { width, height, left, top, bottom, right };
    } else {
      moveSite.push({ width, height, left, top, el, bottom, right });
    }

    // 移除选择的状态
    el.removeAttribute(DRAG_ACTIVE);
    // 禁止元素拖拽
    const isDisabled = config.disabled?.(el, el?.getAttribute(DRAG_ID));
    isDisabled ? el.setAttribute(DRAG_DISABLED, 'true') : el.removeAttribute(DRAG_DISABLED);
  }

  // 设置选择状态
  currentEl?.setAttribute(DRAG_ACTIVE, 'true');
  return { currentEl, moveSite, currentSite, type: type as RunTarge };
}

/**
 * 获取当前变化的组件
 * @param currentEl 目标元素
 * @param scale 缩放比例
 * @returns
 */
function getMoveSite(scale: number, canvasSite: Omit<MoveRect, "el">) {
  const currentEl = document.querySelector(`[${DRAG_ACTIVE}='true']`);
  const result: { list: SiteInfo[], obj: { [key: string]: SiteInfo } } = { list: [], obj: {} };
  if (!currentEl) return result;

  const site = getDOMSite(currentEl);
  const isGroup = currentEl?.getAttribute(DRAG_GROUP);
  // 判断当前是否组元素
  if (!isGroup) {
    result.list.push({ ...site, el: currentEl });
    const id = currentEl.getAttribute(DRAG_ID);
    if (id) result.obj[id] = { ...site, el: currentEl };
    return result;
  }

  const els = currentEl.querySelectorAll(`[${DRAG_GROUP_ID}]`);
  els.forEach((el) => {
    // 获元素对于浏览器视口位置大小
    const { width, left, top, height } = getBoundingClientRectByScale(el, scale);
    const { width: w, height: h, angle } = getDOMSite(el);
    // 获取元素的中心点坐标
    const center = {
      x: left - canvasSite.left + width / 2,
      y: top - canvasSite.top + height / 2
    }

    const id = el.getAttribute(DRAG_ID);
    const values = { left: center.x - w / 2, top: center.y - h / 2, angle: angle + site.angle, width: w, height: h };
    const moveEl = document.querySelector(`[${DRAG_GROUP_ID}='${el.getAttribute(DRAG_GROUP_ID)}'][${DRAG_TYPE}='move']`);
    if (!moveEl) return;
    const move = moveEl as HTMLElement;
    move.style.top = `${values.top}px`;
    move.style.left = `${values.left}px`;
    move.style.width = `${values.width}px`;
    move.style.height = `${values.height}px`;
    move.style.transform = `rotate(${values.angle}deg)`;

    result.list.push({ ...values, el: moveEl });
    if (id) result.obj[id] = { ...values, el: moveEl };
  })

  return result;
}

const keys = [
  'disX',
  'disY',
  'startX',
  'startY',
  'moveX',
  'moveY',
  'isMove',
] as Array<
  'disX' | 'disY' | 'startX' | 'startY' | 'moveX' | 'moveY' | 'isMove'
>;

export function drag(el: () => Element, config: ConfigTypes) {
  const { plugins = [], scale, changeSiteOrSize } = config;
  const pluginType = handlePlugins(plugins);
  const usePlugins = getCitePlugins(plugins);

  return elDrag(el, {
    scale,
    stop: true,
    prevent: true,
    down(data, e) {
      const values = objectTransform(data, keys);
      // 缩放比例
      const s = isFunctionOrValue(scale) || 1;
      // 移动元素的宽高、大小
      const { moveSite, currentEl, currentSite, type } = getAllMoveSiteInfo(
        e.target as Element,
        s,
        data.binElement!,
        config
      );
      // 判断是否禁用
      if (currentEl?.getAttribute(DRAG_DISABLED) == 'true') return;
      // 画布位置信息
      const canvasSite = getBoundingClientRectByScale(data.binElement!, s);
      // 点击的元素
      const eventTarget = e.target as HTMLElement;
      // 创建点
      const createEl = createElement({
        ...usePlugins,
        target: currentEl,
        canvas: data.binElement!,
      });
      createEl();

      pluginType('down', {
        ...values,
        e,
        type,
        scale: s,
        moveSite,
        currentEl,
        currentSite,
        canvasSite,
        eventTarget,
        canvasEl: data.binElement!,
      });
      return {
        createEl,
        currentEl,
        scale,
        moveSite,
        currentSite,
        canvasSite,
        eventTarget,
        type,
      };
    },
    move(data, e, value) {
      const down = value.down as ReturnData;
      const values = objectTransform(data, keys);
      pluginType('move', { canvasEl: data.binElement!, e, ...values, ...down });

      if (down.currentEl) down.createEl();
      const { list, obj } = getMoveSite(down.scale, down.canvasSite);
      if (list.length) changeSiteOrSize?.({ list, obj });
    },
    up(data, e, value) {
      const down = value.down as ReturnData;
      const values = objectTransform(data, keys);
      pluginType('up', { canvasEl: data.binElement!, e, ...values, ...down });
    },
  });
}
