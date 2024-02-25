import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Icon from '../Icon/Icon.vue'

describe('Button.vue', () => { 
  test('basic button', () => {
    // 测试Button组件的挂载后的功能
    const wrapper = mount(Button, {
      props: {
        type: 'primary'
      },
      // slots传入的内容
      slots: {
        default: 'button'
      }
    })
    // 打印挂载后html结果
    console.log(wrapper.html())
    // 测试样式是否生效
    expect(wrapper.classes()).toContain('vk-button--primary')
    // slot
    // get, find 遍历查找wrapper中的元素，返回新的wrapper
    // 返回节点中的文本
    expect(wrapper.get('button').text()).toBe('button')
    // events
    // trigger触发click事件
    wrapper.get('button').trigger('click')
    // emitted输出所有触发的事件
    console.log(wrapper.emitted())
    // 测试触发的事件里是否包括click事件
    expect(wrapper.emitted()).toHaveProperty('click')
  })
  test('disabled', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'disabled'
      }
    })
    // attributes 获取节点中所有属性
    // toBeDefined 确认属性是否存在
    // .element 获取原生的dom节点
    expect(wrapper.attributes('disabled')).toBeDefined()
    // attributes
    expect(wrapper.find('button').element.disabled).toBeDefined()
    wrapper.get('button').trigger('click')
    expect(wrapper.emitted()).not.toHaveProperty('click')
  })
  test('icon', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'arrow-up'
      },
      slots: {
        default: 'icon'
      },
      // stubs 模拟第三方组件
      global: {
        stubs: ['FontAwesomeIcon']
      }
    })
    // findComponent 遍历查找wrapper中的组件，返回新的wrapper
    const iconElement = wrapper.findComponent(FontAwesomeIcon)
    // 判断是否存在
    expect(iconElement.exists()).toBeTruthy()
    expect(iconElement.attributes('icon')).toBe('arrow-up')
  })
  test('loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      },
      slots: {
        default: 'loading'
      },
      global: {
        stubs: ['Icon']
      }
    })
    console.log(wrapper.html())
    const iconElement = wrapper.findComponent(Icon)
    expect(iconElement.exists()).toBeTruthy()
    expect(iconElement.attributes('icon')).toBe('spinner')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})