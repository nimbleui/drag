import type { OptionsType, ElType, DataTypes, MouseTouchEvent, CallbackReturnValue } from "@nimble-ui/move"
export { ElType, OptionsType, DataTypes, MouseTouchEvent }

export interface PluginOptions {
  data: DataTypes;
  e: MouseTouchEvent;
  value: Record<string, any>;
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
}

export interface ConfigTypes extends OptionsType {
  plugins?: Plugin[]
}