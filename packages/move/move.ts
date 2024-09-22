import type { DataTypes, ElType, MouseTouchEvent, OptionsType, LimitInfoType, CallbackReturnValue } from "./types";
import { getTarget, isFunctionOrValue, numScale, sunBoundaryValue } from "./utils";

const defaultData = {
  startX: 0, // 按下鼠标x轴位置
  startY: 0, // 按下鼠标y轴位置
  moveX: 0, // 移动鼠标x轴位置
  moveY: 0, // 移动鼠标y轴位置
  disX: 0, // 鼠标移动x轴的距离
  disY: 0, // 鼠标移动y轴的距离
  endX: 0, // 鼠标抬起x轴的距离
  endY: 0, // 鼠标抬起Y轴的距离
  isMove: false, // 是否移动
  target: null
}

export function elDrag(el: ElType, options?: OptionsType) {
  const { updateOptions, ..._options } = options || {};
  const data: DataTypes = Object.assign({}, defaultData);
  const _value: { limitInfo: LimitInfoType | null; callbackReturnValue: CallbackReturnValue} = {
    limitInfo: null,
    callbackReturnValue: {}
  }

  // 按下事件
  const mousedown = (e: MouseTouchEvent) => {
    // 执行参数更新
    updateOptions?.(_options);

    const res = getTarget(e, el, _options);
    if (!res) return
    data.target = res

    const { clientX, clientY } = numScale(e, _options);
    Object.assign(data, { isMove: true, startX: clientX, startY: clientY })
    _options?.stop && e.stopPropagation(); // 阻止事件冒泡
    _options?.prevent && e.preventDefault(); // 阻止默认事件

    if (_options?.boundary) {
      _value.limitInfo = sunBoundaryValue(res, _options)
    }

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
    document.addEventListener('mouseleave', mouseup);

    document.addEventListener("touchmove", mousemove);
    document.addEventListener("touchend", mouseup);

    const value = _options?.down?.({ ...data }, e, { ..._value.callbackReturnValue })
    if (value) _value.callbackReturnValue.down = value
  }

  const mousemove = (e: MouseTouchEvent) => {
    if (!data.isMove) return
    // 执行参数更新
    updateOptions?.(_options);
    _options?.stop && e.stopPropagation(); // 阻止事件冒泡
    _options?.prevent && e.preventDefault(); // 阻止默认事件

    const { clientX, clientY } = numScale(e);
    const { startX, startY } = data
    let disX = clientX - startX;
    let disY = clientY - startY;

    const { limitInfo, callbackReturnValue } = _value
    if (limitInfo) {
      disX = disX > 0 ? Math.min(limitInfo.r, disX) : Math.max(limitInfo.l, disX);
      disY = disY > 0 ? Math.min(limitInfo.b, disY) : Math.max(limitInfo.t, disY);
    }

    Object.assign(data, { moveX: clientX, moveY: clientY, disX, disY })

    const value = _options?.move?.({ ...data }, e, { ...callbackReturnValue })
    if (value) callbackReturnValue.move = value
  }

  const mouseup = (e: MouseTouchEvent) => {
    if (!data.isMove) return
    // 执行参数更新
    updateOptions?.(_options);
    _options?.stop && e.stopPropagation();
    _options?.prevent && e.preventDefault();
    
    const { clientX: endX, clientY: endY } = numScale(e);
    Object.assign(data, { endX, endY, isMove: false })
    _options?.up?.({ ...data }, e, { ..._value.callbackReturnValue })
    Object.assign(data, defaultData)
    _value.limitInfo = null
    _value.callbackReturnValue = {}

    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    document.removeEventListener('mouseleave', mouseup);

    document.removeEventListener("touchmove", mousemove);
    document.removeEventListener("touchend", mouseup);
  }

  const observe = new MutationObserver(() => {
    const value = isFunctionOrValue(el) as HTMLElement
    if (value) {
      value.addEventListener('mousedown', mousedown);
      value.addEventListener("touchstart", mousedown);
      observe.disconnect()
    }
  })
  observe.observe(document, { childList: true, subtree: true })

  return {
    data,
    observe
  }
}

export default elDrag
