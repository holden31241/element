<template>
<div
  class="vk-collapse-item"
  :class="{
    'is-disabled': disabled
  }"
>
  <div 
    class="vk-collapse-item__header"
    :class="{
      'is-disabled': disabled,
      'is-active': isActive
    }"
    :id="`item-header-${name}`" 
    @click="handleClick"
  >
    <slot name="title">{{title}}</slot>
    <!-- 插槽默认内容为title，可以覆盖掉该插槽 -->
    <!-- 添加图标旋转样式 -->
    <Icon icon="angle-right" class="header-angle" />
  </div>
  <!-- transition实现v-show动画 -->
  <Transition name="slide" v-on="transitionEvents">
    <div class="vk-collapse-item__wrapper" v-show="isActive">
      <div class="vk-collapse-item__content" :id="`item-content-${name}`">
        <slot/>
      </div>
    </div>
  </Transition>
</div>
</template>
<script setup lang="ts">
import { inject, computed } from 'vue'
import type { CollapseItemProps } from './types'
import { collapseContextKey } from './types'
import Icon from '../Icon/Icon.vue'
defineOptions({
  name: 'VkCollapseItem'
})
const props = defineProps<CollapseItemProps>()
const collapseContext = inject(collapseContextKey)
const isActive = computed(() => collapseContext?.activeNames.value.includes(props.name))
const handleClick = () => {
  if (props.disabled) { return }
  collapseContext?.handleItemClick(props.name)
}
// 为tranistion组件定义事件
// Record<K,T> K为键的类型，T为值的类型
const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  beforeEnter(el) {
    el.style.height = '0px'
    el.style.overflow = 'hidden'
  },
  enter(el) {
    // scrollHeight可以获取组件隐藏高度
    el.style.height = `${el.scrollHeight}px`
  },
  afterEnter(el) {
    el.style.height = ''
    el.style.overflow = ''
  },
  beforeLeave(el) { 
    el.style.height = `${el.scrollHeight}px`
    el.style.overflow = 'hidden'
  },
  leave(el) {
    el.style.height = '0px'
  },
  afterLeave(el) {
    el.style.height = ''
    el.style.overflow = ''
  }

}
</script>