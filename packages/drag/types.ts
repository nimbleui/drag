import type { OptionsType, BaseOptions, ElType, DataTypes, MouseTouchEvent } from "@nimble-ui/move"
export { ElType, OptionsType, DataTypes, MouseTouchEvent }

export interface PluginOptions {
  data: DataTypes;
  e: MouseTouchEvent; // 事件对象
  pluginValue: Record<string, any>; // 插件返回的值
  citePlugins: Record<string, boolean>; // 记录已引用的插件
  moveEl: HTMLElement | null; // 移动的元素
  scale: number; // 缩放比例
}

type PluginReturnValue = (data: any) => void

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
  changeSiteOrSize?:(target: HTMLElement | null, data: SiteInfo | null) => void;
}