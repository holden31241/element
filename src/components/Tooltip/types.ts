import type { Placement, Options } from '@popperjs/core'
export interface TooltipProps {
  content? : string;
  trigger?: 'hover' | 'click';
  placement?: Placement;
  manual?: boolean;
  // partial 把某个接口类型中定义的所有属性变成可选的
  popperOptions?: Partial<Options>;
  transition?: string;
  openDelay?: number;
  closeDelay?: number;
}

export interface TooltipEmits {
  (e: 'visible-change', value: boolean) : void;
  (e: 'click-outside', value: boolean) : void;
}

export interface TooltipInstance {
  show: () => void;
  hide: () => void;
}