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
export type MoveRectList = MoveRect[]

export interface ReturnData {
  moveEl: Element | null; // 移动的元素
  scale: number; // 缩放比例
  moves: MoveRectList; // 排除当前拖拽以外的可移动元素位置信息
  targetSite: Omit<MoveRect, 'el'>; // 当前拖拽元素位置信息
  canvasSite: Omit<MoveRect, 'el'>; // 画布元素位置信息
}

export interface PluginOptions extends ReturnData {
  canvasEl: Element; // 画布元素
  disX: number; // 鼠标移动x轴的距离
  disY: number; // 移动鼠标y轴位置
  startX: number; // 按下鼠标x轴位置
  startY: number; // 按下鼠标y轴位置
  moveX: number; // 移动鼠标x轴位置
  moveY: number; // 移动鼠标y轴位置
  isMove: boolean; // 是否移动
  e: MouseTouchEvent; // 事件对象
  pluginValue: Record<string, any>; // 插件返回的值
  citePlugins: Record<string, boolean>; // 记录已引用的插件
  target: HTMLElement; // 事件元素
}



type PluginReturnValue = (data: any) => void
export type RunTarge =  'move' | 'dot' | 'canvas' | 'rotate'
export interface Plugin {
  /**
   * @description 插件的名称
   */
  name: string;
  /**
   * 修改配置
   */
  options?: (options: OptionsType) => void;
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
   * 执行的条件
   * @param target 事件源
   * @param e 事件对象
   * @returns 
   */
  runRequire?: (target: HTMLElement, e: MouseTouchEvent) => boolean;
  /**
   * @description 鼠标在那种元素上才执行
   */
  runTarge: RunTarge
}

interface SiteInfo {
  top: number;
  left: number;
  width: number;
  height: number;
}
export interface ConfigTypes extends BaseOptions {
  plugins?: Plugin[] // 插件
  // 改变位置或者大小触发这个方法
  changeSiteOrSize?:(target: Element | null, data: SiteInfo | null) => void;
}