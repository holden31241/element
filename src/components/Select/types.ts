import type { VNode } from 'vue'
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}
export type RenderLabelFunc = (option: SelectOption) => VNode
export type CustomFilterFunc = (value: string | number) => SelectOption[]
export type CustomFilterRemoteFunc = (value: string | number) => Promise<SelectOption[]>
export interface SelectProps {
  // v-model
  modelValue: string | number;
  // 选项
  options?: SelectOption[];
  // 一些基本表单属性
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  renderLabel?: RenderLabelFunc;
  filterable?: boolean;
  filterMethod?: CustomFilterFunc;
  remote?: boolean;
  remoteMethod?: CustomFilterRemoteFunc;
}
export interface SelectStates {
  inputValue: string;
  selectedOption: null | SelectOption;
  mouseHover: boolean;
  highlightIndex: number;
}
export interface SelectEmits {
  (e:'change', value: string | number) : void;
  (e:'update:modelValue', value: string | number) : void;
  (e: 'visible-change', value:boolean): void;
  (e: 'clear'): void;
}