<template>
<div
  class="vk-select"
  :class="{'is-disabled': disabled }"
  @click="toggleDropdown"
  @mouseenter="states.mouseHover = true"
  @mouseleave="states.mouseHover = false"
>
  <Tooltip
    placement="bottom-start"
    ref="tooltipRef"
    :popperOptions="popperOptions"
    @click-outside="controlDropdown(false)"
    manual
  >
    <Input 
      v-model="states.inputValue"
      :disabled="disabled"
      :placeholder="filteredPlaceholder"
      ref="inputRef"
      :readonly="!filterable || !isDropdownShow"
      @input="debounceOnFilter"
      @keydown="handleKeydown" 
    >
      <template #suffix>
        <Icon 
          icon="circle-xmark"
          v-if="showClearIcon"
          class="vk-input__clear"
          @mousedown.prevent="NOOP"
          @click.stop="onClear"
        />
        <!-- 阻止冒泡，防止触发父组件的click事件 -->
        <Icon
          v-else
          icon="angle-down" 
          class="header-angle" 
          :class="{ 'is-active': isDropdownShow }"
        />
      </template>
    </Input>
    <template #content>
      <div class="vk-select__loading" v-if="loading"><Icon icon="spinner" spin/></div>
      <div class="vk-select__nodata" v-else-if="filterable && filteredOptions.length === 0">no matching data</div>
      <ul class="vk-select__menu" v-else>
        <template v-for="(item, index) in filteredOptions" :key="index">
          <li 
            class="vk-select__menu-item"
            :class="{'is-disabled': item.disabled, 
            'is-selected': states.selectedOption?.value === item.value,
            'is-highlighted': states.highlightIndex === index }"
            :id="`select-item-${item.value}`"
            @click.stop="itemSelect(item)"
          >
            <RenderVnode :vNode="renderLabel ? renderLabel(item) : item.label" />
          </li>
        </template>
      </ul>
    </template>
  </Tooltip>
</div>  
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import type { Ref } from 'vue'
import { isFunction, debounce, last } from 'lodash-es'
import type { SelectProps, SelectEmits, SelectOption, SelectStates } from './types'
import Tooltip from '../Tooltip/Tooltip.vue'
import type { TooltipInstance } from '../Tooltip/types'
import Input from '../Input/Input.vue'
import Icon from '../Icon/Icon.vue'
import type { InputInstance } from '../Input/types'
import RenderVnode from '../Common/RenderVnode'



defineOptions({
  name: 'VkSelect'
})
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => []
})

const emits = defineEmits<SelectEmits>()

const findOption = (value: string | number) => {
  const option = props.options.find(option => option.value === value)
  return option ? option : null
}
const initialOption = findOption(props.modelValue)
const tooltipRef = ref() as Ref<TooltipInstance>
const inputRef = ref() as Ref<InputInstance>
const states = reactive<SelectStates>({
  inputValue: initialOption ? initialOption.label : '',
  selectedOption: initialOption,
  mouseHover: false,
  highlightIndex: -1
})
watch(() => props.modelValue, async (newValue) => {
  const updateOption = findOption(newValue)
  states.inputValue = updateOption ? updateOption.label : ''
  states.selectedOption = updateOption
  const updatedValue = updateOption ? updateOption.value : ''
  emits('change', updatedValue)
  emits('update:modelValue', updatedValue)
})
// 远程搜索需要的几个值
const timeout = computed(() => (props.remote ? 300 : 0))
const remoteWithEmpty = computed(() => props.remote && props.remoteMethod  && states.inputValue.trim() === '')
const remoteWithValue = computed(() => props.remote && props.remoteMethod  && states.inputValue.trim() !== '')
const isDropdownShow = ref(false)

const popperOptions: any = {
  modifiers: [
    {
      // 设置偏移量
      name: 'offset',
      options: {
        offset: [0, 9],
      },
    },
    {
      // 使下拉框和输入框宽度相等
      name: "sameWidth",
      enabled: true,
      fn: ({ state }: { state: any }) => {
          state.styles.popper.width = `${state.rects.reference.width}px`;
      },
      phase: "beforeWrite",
      requires: ["computeStyles"],
    }
  ],
}
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
      if (!isDropdownShow.value) {
        controlDropdown(true)
      } else {
        if (states.highlightIndex > -1 && filteredOptions.value[states.highlightIndex]) {
          itemSelect(filteredOptions.value[states.highlightIndex])
        } else {
          controlDropdown(false)
        }
      }
      break
    case 'Escape':
      if (isDropdownShow.value) {
        controlDropdown(false)
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      // states.highlightIndex = -1
      if (filteredOptions.value.length > 0) {
        if (states.highlightIndex === -1 || states.highlightIndex === 0) {
          states.highlightIndex = filteredOptions.value.length - 1
        } else {
          // move up
          states.highlightIndex--
        }
      }
      break
    case 'ArrowDown':
      e.preventDefault()
      // states.highlightIndex = -1
      if (filteredOptions.value.length > 0) {
        if (states.highlightIndex === -1 || states.highlightIndex === (filteredOptions.value.length - 1)) {
          states.highlightIndex = 0
        } else {
          // move up
          states.highlightIndex++
        }
      }
      break
    default:
      break;
  }
}

// clear function
const showClearIcon = computed(() => {
  // 不是 multiple，hover进去，并且有值(有待思考), 并且必须要有选择过选项
  return props.clearable && states.mouseHover && states.inputValue.trim() !== '' && states.selectedOption
})
const onClear = () => {
  states.selectedOption = null
  states.inputValue = ''
  emits('clear')
  emits('change', '')
  emits('update:modelValue', '')
}
const NOOP = () => {}
// remote 
const loading = ref(false)
// filtered options
const filteredOptions = ref<SelectOption[]>(props.options)
watch(() => props.options, (newOptions) => {
  filteredOptions.value = newOptions
})
// 之前是否选中了对应的内容
// 这个是用来给可 filtered 的内容提供帮助的
// placeholder
const filteredPlaceholder = computed(() => {
  return   (props.filterable && states.selectedOption && isDropdownShow.value) 
  ? states.selectedOption.label : props.placeholder
})
const generateFilterOptions = async (searchValue: string) => {
  if (!props.filterable) return
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(searchValue)
  } else if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) { 
    loading.value = true
    try {
      filteredOptions.value = await props.remoteMethod(searchValue)
      // 在结果生成以后再展示，否则生成的下拉菜单上面箭头图标位置不对
      if (remoteWithValue.value && !isDropdownShow.value) {
        await nextTick()
        tooltipRef.value?.show()
      }
    } catch (e) {
      console.error(e)
      filteredOptions.value = []
    } finally {
      loading.value = false
    }
  } else {
    filteredOptions.value = props.options.filter(option => option.label.includes(searchValue))
  }
  states.highlightIndex = -1
}
const onFilter = () => {
  generateFilterOptions(states.inputValue)
}
// 防抖
const debounceOnFilter = debounce(() => {

  onFilter()

}, timeout.value)

const controlDropdown = (show: boolean) => {
  if (show) {
    // 假如是filter 模式，再次选择需要清空 Input
    if (props.filterable && states.selectedOption) {
      states.inputValue = ''
    }
    // 空值的时候 remote 模式下，不需要展示
    if (remoteWithEmpty.value) {
      return
    }
    // 生成默认选项
    if (props.filterable) {    
      generateFilterOptions(states.inputValue)
    }
    tooltipRef.value.show()
  } else {
    tooltipRef.value.hide()
    if (props.filterable) {
      // blur 的时候将之前选的值回重新显示在 input 中
      states.inputValue = states.selectedOption ? states.selectedOption.label : ''
    }
    states.highlightIndex = -1
  }
  isDropdownShow.value = show
  emits('visible-change', show)
}
const toggleDropdown = () => {
  if (props.disabled) return
  if (isDropdownShow.value) {
    controlDropdown(false)
  } else {
    controlDropdown(true)
  }
}
const itemSelect = (e: SelectOption) => {
  if (e.disabled) return
  states.inputValue = e.label
  states.selectedOption = e
  emits('change', e.value)
  emits('update:modelValue', e.value)
  controlDropdown(false)
  if (!props.filterable) {
    inputRef.value.ref.focus()
  }
}
</script>