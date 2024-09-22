export type ElType = Element | (() => Element)

export interface BaseOptions {
  boundary?: ElType | Window // 拖拽的边界元素
  prevent?: boolean // 阻止默认事件
  stop?: boolean // 阻止事件冒泡
  scale?: number | (() => number | undefined) // 缩放比例
  expand?: number // 边界元素扩大
  agencyTarget?: (el: Element) => Element | undefined | false | void // 判断是否要代理
}

export interface OptionsType extends BaseOptions {
  down?: (data: DataTypes, e: MouseTouchEvent, value: CallbackReturnValue) => void;
  move?: (data: DataTypes, e: MouseTouchEvent, value: CallbackReturnValue) => void;
  up?: (data: DataTypes, e: MouseTouchEvent, value: CallbackReturnValue) => void;
  updateOptions?: (options: Omit<OptionsType, 'updateOptions'>) => void
}

export type MouseTouchEvent = MouseEvent | TouchEvent

export interface DataTypes {
  startX: number; // 按下鼠标x轴位置
  startY: number; // 按下鼠标y轴位置
  moveX: number; // 移动鼠标x轴位置
  moveY: number; // 移动鼠标y轴位置
  disX: number; // 鼠标移动x轴的距离
  disY: number; // 鼠标移动y轴的距离
  endX: number; // 鼠标抬起x轴的距离
  endY: number; // 鼠标抬起Y轴的距离
  isMove: boolean; // 是否移动
  target?: Element | null // 当前移动的元素
}

export type LimitInfoType = { l: number; r: number; t: number; b: number; }
export type CallbackReturnValue = { down?: any; move?: any; up?: any}
