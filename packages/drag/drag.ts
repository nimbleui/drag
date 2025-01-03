import move from '@nimble-ui/move';
import type {
  ConfigTypes,
  RunTarge,
  MoveRect,
  MoveRectList,
  Plugin,
  PluginOptions,
  Common,
  SiteInfo,
  EventType,
  HandleEvent,
  KeyEqualFun,
} from './types';
import {
  delAttr,
  getBoundingClientRectByScale,
  getDOMSite,
  getParentTarget,
  getRotationDegrees,
  handleAttr,
  isFunction,
  isFunctionOrValue,
  objectTransform,
  selectDOM,
  setStyle,
} from '@nimble-ui/utils';
import { DRAG_TYPE, DRAG_ACTIVE, DRAG_GROUP_ID, DRAG_GROUP } from "@nimble-ui/constant";
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
    data: Omit<PluginOptions, 'funValue'> & { keyEqual: KeyEqualFun}
  ) => {
    const elType = data.type || 'canvas';
    plugins.forEach((plugin) => {
      const { runTarge, name, allDown, keyDown } = plugin;
      const checkedKey = data.keyEqual(keyDown);
      if (!checkedKey) return;

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
  const moves = selectDOM(canvas, `[${DRAG_TYPE}="move"]`, true);

  // 判断是否点击可操作的元素中
  let type = handleAttr(target, 'type');
  let currentEl: Element | null = null;

  // 获取当前操作的元素
  if (!type || type == 'move') {
    currentEl = getMoveDOM(target);
    currentEl && (type = handleAttr(currentEl, 'type'));
  } else {
    currentEl = selectDOM(canvas, `[${DRAG_ACTIVE}="true"]`);
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
    delAttr(el, 'active');
    // 获取id
    const id = handleAttr(el, 'id');
    // 禁止元素拖拽
    const isDisabled = config.disabled?.(el, id);
    isDisabled ? handleAttr(el, 'disabled', 'true') : delAttr(el, 'disabled');

    // 是否等比例缩放
    const isEqualRatio = config.equalRatio?.(el, id);
    isEqualRatio ? handleAttr(el, 'ratio', 'true') : delAttr(el, 'ratio');
  }

  // 设置选择状态
  handleAttr(currentEl, 'active', 'true');
  return { currentEl, moveSite, currentSite, type: type as RunTarge };
}

/**
 * 获取当前变化的组件
 * @param currentEl 目标元素
 * @param scale 缩放比例
 * @returns
 */
function getMoveSite(scale: number, canvasSite: Omit<MoveRect, "el">) {
  const currentEl = selectDOM(document, `[${DRAG_ACTIVE}='true']`);
  const result: { list: SiteInfo[], obj: { [key: string]: SiteInfo } } = { list: [], obj: {} };
  if (!currentEl) return result;

  const site = getDOMSite(currentEl);
  const isGroup = handleAttr(currentEl, 'group');
  // 判断当前是否组元素
  if (!isGroup) {
    result.list.push({ ...site, el: currentEl });
    const id = handleAttr(currentEl, 'id');
    if (id) result.obj[id] = { ...site, el: currentEl };
    return result;
  }

  const els = selectDOM(currentEl, `[${DRAG_GROUP_ID}]`, true);
  els?.forEach((el) => {
    // 获元素对于浏览器视口位置大小
    const { width, left, top, height } = getBoundingClientRectByScale(el, scale);
    const { width: w, height: h, angle } = getDOMSite(el);
    // 获取元素的中心点坐标
    const center = {
      x: left - canvasSite.left + width / 2,
      y: top - canvasSite.top + height / 2
    }

    const id = handleAttr(el, 'id');
    const values = { left: center.x - w / 2, top: center.y - h / 2, angle: angle + site.angle, width: w, height: h };
    const moveEl = selectDOM(document, `[${DRAG_GROUP_ID}='${handleAttr(el, 'groupId')}'][${DRAG_TYPE}='move']`);
    if (!moveEl) return;
    const move = moveEl as HTMLElement;
    setStyle(move, [values.left, values.top, values.width, values.height])
    move.style.transform = `rotate(${values.angle}deg)`;

    result.list.push({ ...values, el: moveEl });
    if (id) result.obj[id] = { ...values, el: moveEl };
  })
  return result;
}

/** 取消选中 */
function uncheck(el: () => Element) {
  return () => {
    const canvasEl = el();
    delAttr(selectDOM(canvasEl, `[${DRAG_ACTIVE}='true']`), 'active');
    selectDOM(canvasEl, '.drag-mask')?.setAttribute('style', 'display: none;');
    const group = selectDOM(canvasEl, DRAG_GROUP);
    group && canvasEl.removeChild(group);
    const moves = selectDOM(canvasEl, `[${DRAG_TYPE}="move"]`, true);
    moves?.forEach((el) => el.setAttribute("style", 'display: none;'))
  }
}

/**
 * 创建事件 
 */
function createBindEvent() {
  const all = new Map<EventType, Array<HandleEvent>>();

  return {
    on: (type: EventType, handler: HandleEvent) => {
      const handlers = all.get(type);
      if (handlers) {
        handlers.push(handler)
      } else {
        all.set(type, [handler])
      }
    },
    emit(type: RunTarge | null, event: { scale: number; canvasSite: Omit<MoveRect, "el"> }, status?: 'start' | 'end') {
      const key = type == 'dot' ? 'resize' : type == 'rotate' ? 'rotate' : type == 'move' ? 'drag' : ''
      if (!key) return;
      const list = all.get(`${key}${status ? '-' + status : ''}` as EventType);
      const data = getMoveSite(event.scale, event.canvasSite);
      list?.forEach((handler) => handler(data));

      !status && all.get('change')?.forEach((handler) => handler(data));
    }
  }
}

function bindKeyUp() {
  const data = { key: 0, event: null as null | KeyboardEvent }
  const keyDown = (e: KeyboardEvent) => {
    data.event = e;
    data.key = e.keyCode;
  }

  const keyUp = () => {
    data.key = 0;
    data.event = null;
  };
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp)

  return {
    keyEqual: ((key) => {
      if (!key && !data.key) return true;
      if (data.key && !key || !data.key && key) return false;
      return isFunction(key) ? key(data.event) : data.key == key
    }) as KeyEqualFun,
    remove: () => {
      document.removeEventListener("keyup", keyUp);
      document.removeEventListener('keydown', keyDown);
    }
  }
}

/** 处理八点的显隐 */
function hidAndVisible(currentEl: Element | null, canvas: Element) {
  const content = canvas.querySelector('.drag-mask');
  if (currentEl) {
    const t = currentEl as HTMLElement;
    setStyle(content, [t.offsetLeft, t.offsetTop, t.offsetWidth, t.offsetHeight, 'block']);
    (content as HTMLElement).style.border = '1px solid #1677ff';
    (content as HTMLElement).style.transform = `rotate(${getRotationDegrees(t)}deg)`;
  } else {
    (content as HTMLElement).style.display = 'none'
  }
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
  const { plugins = [], scale, changeSiteOrSize, limitBoundary } = config;
  const pluginType = handlePlugins(plugins);
  const usePlugins = getCitePlugins(plugins);
  const keyword = bindKeyUp();
  const events = createBindEvent();

  const data = move(el, {
    scale,
    stop: true,
    prevent: true,
    boundary: limitBoundary ? el : undefined,
    init(canvas) {
      createElement({...usePlugins, canvas })
    },
    changeTarget(el, e) {
      let target = e.target as HTMLElement;

      // 如果是点就获取选中
      const attr = handleAttr(target, 'type')
      if (attr == 'dot' || attr == 'rotate') {
        return selectDOM(el, `[${DRAG_ACTIVE}='true']`) || el
      }

      while (target != el) {
        if (target.getAttribute(DRAG_TYPE) == 'move') return target;
        if (!target.parentElement) break;
        target = target.parentElement;
      }
      return el.querySelector(`[${DRAG_TYPE}='area']`) || el;
    },
    down(data, done) {
      const values = objectTransform(data, keys);
      // 缩放比例
      const s = isFunctionOrValue(scale) || 1;
      // 移动元素的宽高、大小
      const { moveSite, currentEl, currentSite, type } = getAllMoveSiteInfo(
        data.e.target as Element,
        s,
        data.binElement!,
        config
      );
      // 判断是否禁用
      if (handleAttr(currentEl, 'disabled') == 'true') return;
      // 画布位置信息
      const canvasSite = getBoundingClientRectByScale(data.binElement!, s);
      // 点击的元素
      const eventTarget = data.e.target as HTMLElement;
      // 创建点
      hidAndVisible(currentEl, data.binElement!)
      events.emit(type, { scale: s, canvasSite }, 'start');

      pluginType('down', {
        ...values,
        e: data.e,
        type,
        scale: s,
        moveSite,
        currentEl,
        currentSite,
        canvasSite,
        eventTarget,
        canvasEl: data.binElement!,
        keyEqual: keyword.keyEqual,
      });
      done({
        currentEl,
        scale: s,
        moveSite,
        currentSite,
        canvasSite,
        eventTarget,
        type,
      })
    },
    move(data) {
      const down = data.value.down as Common;
      const values = objectTransform(data, keys);
      pluginType('move', { canvasEl: data.binElement!, e: data.e, ...values, ...down, keyEqual: keyword.keyEqual, });

      hidAndVisible(down.currentEl, data.binElement!);
      const { list, obj } = getMoveSite(down.scale, down.canvasSite);
      if (list.length) changeSiteOrSize?.({ list, obj });
      events.emit(down.type, { scale: down.scale, canvasSite: down.canvasSite });
    },
    up(data) {
      const down = data.value.down as Common;
      const values = objectTransform(data, keys);
      pluginType('up', { canvasEl: data.binElement!, e: data.e, ...values, ...down, keyEqual: keyword.keyEqual });
      events.emit(down?.type, { scale: down.scale, canvasSite: down.canvasSite }, "end");
    },
  });

  return {
    on: events.on,
    data: data.data,
    uncheck: uncheck(el),
    destroy: () => {
      keyword.remove();
      data.observe.disconnect();
    }
  }
}
