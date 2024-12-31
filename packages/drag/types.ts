import type {
  MoveOptionsType,
  MoveBaseOptions,
  MoveElType,
  MoveDataTypes,
  MoveMouseTouchEvent,
} from '@nimble-ui/move';
export { MoveElType, MoveOptionsType, MoveDataTypes, MoveMouseTouchEvent };

export interface MoveRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  el: Element;
}
export type MoveRectList = MoveRect[];

interface Common {
  /** 移动的元素 */
  currentEl: Element | null;
  /** 缩放比例 */
  scale: number;
  /** 排除当前拖拽以外的可移动元素位置信息 */
  moveSite: MoveRectList;
  /** 当前拖拽元素位置信息 */
  currentSite: Omit<MoveRect, 'el'> | null;
  /** 画布元素位置信息 */
  canvasSite: Omit<MoveRect, 'el'>;
  /** 点击的元素 */
  eventTarget: HTMLElement;
  /** 元素类型 */
  type: RunTarge | null;
}

export interface ReturnData extends Common {
  createEl: () => Element | void;
}

export interface PluginOptions extends Common {
  /**  画布元素 */
  canvasEl: Element;
  /** 鼠标移动x轴的距离 */
  disX: number;
  /** 移动鼠标y轴位置 */
  disY: number;
  /** 按下鼠标x轴位置 */
  startX: number;
  /** 按下鼠标y轴位置 */
  startY: number;
  /** 移动鼠标x轴位置 */
  moveX: number;
  /** 移动鼠标y轴位置 */
  moveY: number;
  /** 是否移动 */
  isMove: boolean;
  /** 事件对象 */
  e: MoveMouseTouchEvent;
  /** 函数的返回值 */
  funValue: { down?: any; move?: any; up?: any };
}

type PluginReturnValue = (data: any) => void;
export type RunTarge = 'move' | 'dot' | 'rotate' | 'canvas';
export interface Plugin {
  /**
   * @description 插件的名称
   */
  name: string;
  /**
   * @description 鼠标在那种元素上才执行
   */
  runTarge: RunTarge | RunTarge[];
  /**
   * 鼠标按下执行
   * @param data 事件对象等
   * @param done 保存值给其他回调函数用
   */
  down?: (data: PluginOptions, done: PluginReturnValue) => void;
  /**
   * 鼠移动执行
   * @param data 事件对象等
   * @param done 保存值给其他回调函数用
   */
  move?: (data: PluginOptions, done: PluginReturnValue) => void;
  /**
   * 鼠标抬起执行
   * @param data 事件对象等
   * @param done 保存值给其他回调函数用
   */
  up?: (data: PluginOptions, done: PluginReturnValue) => void;
  /**
   * 按下就触发
   * @param data 事件对象等 
   * @returns 
   */
  allDown?: (data: Omit<PluginOptions, 'funValue'>) => void;
  /**
   * @description 配合按键
   */
  keyDown?: KeyDownType;
}

export interface SiteInfo {
  el: Element;
  top: number;
  left: number;
  width: number;
  height: number;
  angle: number;
}

export interface ChangeParams {
  list: SiteInfo[];
  obj: { [key: string]: SiteInfo };
}

export interface ConfigTypes {
  /** 插件 */
  plugins?: Plugin[];
  /** 限制移出画布 */
  limitBoundary?: boolean;
  /** 缩放比例 */
  scale?: number | (() => number);
  /**
   * 改变位置、大小、旋转角度触发这个方法
   * @param target 当前移动的元素
   * @param data 大小、位置、角度信息
   * @returns {void}
   */
  changeSiteOrSize?: (data: ChangeParams) => void;
  /**  修改元素的颜色 */
  changeStyle?: () => ({
    guideline?: { color?: string };
    dot?: { background?: string; borderColor?: string };
    group?: { background?: string; borderColor?: string };
    rotate?: { background?: string; borderColor?: string };
  });
  /**
   * 禁止拖拽，或者直接在元素添加 data-drag-disabled="true"
   * @param target 当前点击的元素 
   * @param id 获取元素属性 data-drag-id 值
   * @returns {boolean}
   */
  disabled?: (target: Element | null, id?: string | null) => boolean;
  /**
   * 等比例缩放
   * @param target 当前点击的元素
   * @param id 获取元素属性 data-drag-id 值
   * @returns 
   */
  equalRatio?: (target: Element | null, id?: string | null) => boolean;
}

export type EventType =
  "change" |
  "drag" |
  "drag-start" |
  "drag-end" |
  "resize" |
  "resize-start" |
  "resize-end" |
  "rotate" |
  "rotate-start" |
  "rotate-end"
export type HandleEvent = (data: ChangeParams) => void;

type KeyDownType = number | ((e: KeyboardEvent | null) => boolean);
export type KeyEqualFun = (key?: KeyDownType) => boolean;
