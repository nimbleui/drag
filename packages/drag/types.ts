import type { OptionsType, ElType, DataTypes } from "@nimble-ui/move"
export { ElType }

export interface Plugin {
  enforce: "down" | 'move' | 'up';
  options?: (options: OptionsType) => void;
  fun?: (data: DataTypes) => void
}

export interface ConfigTypes extends OptionsType {
  plugins: Plugin[]
}