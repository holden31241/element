import type { VNode, ComponentInternalInstance } from 'vue'
export interface MessageProps {
  message?: string | VNode;
  duration?: number;
  showClose?: boolean;
  type?: 'success'| 'info'| 'warning'| 'danger';
  onDestory: () => void;
  id: string;
  zIndex: number;
  offset?: number;
  transitionName?: string;
}
export interface MessageContext {
  id: string;
  vnode: VNode;
  vm: ComponentInternalInstance;
  props: MessageProps;
  destory: () => void;
}
// Omit 除去接口中某些属性的新接口
export type CreateMessageProps = Omit<MessageProps, 'onDestory' | 'id' | 'zIndex'>