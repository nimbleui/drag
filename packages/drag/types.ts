import type { OptionsType, BaseOptions, ElType, DataTypes, MouseTouchEvent } from "@nimble-ui/move"
export { ElType, OptionsType, DataTypes, MouseTouchEvent }

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
  e: MouseTouchEvent;
  /** 函数的返回值 */
  funValue: { down?: any; move?: any, up?: any };
}

type PluginReturnValue = (data: any) => void;
export type RunTarge = 'move' | 'dot' | 'canvas' | 'rotate' | 'group';
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
}

interface SiteInfo {
  top: number;
  left: number;
  width: number;
  height: number;
  angle: number;
}

interface ElsOption {
  /**
   * @description 当前操作的元素
   */
  targe: Element | null;
  /**
   * @description 八个点元素
   */
  dots: Array<Element>;
  /**
   * @description 八个点的父元素
   */
  dotWarp: Element;
  /**
   * @description 组元素
   */
  group: Element | null;
  /**
   * @description 旋转元素
   */
  rotate: Element | null;
}

export interface ConfigTypes {
  /** 插件 */
  plugins?: Plugin[]
  /** 限制移出画布 */
  limitBoundary?: boolean;
  /** 缩放比例 */
  scale?: number | (() => number);
  /**
   * 改变位置、大小、旋转角度触发这个方法
   * @param target 当前移动的元素
   * @param data 大小、位置、角度信息
   * @returns 
   */
  changeSiteOrSize?: (target: Element | null, data: SiteInfo) => void;
  downEls?: (els: ElsOption) => void;
  moveEls?: (els: ElsOption) => void;
  upEls?: (els: ElsOption) => void;
}