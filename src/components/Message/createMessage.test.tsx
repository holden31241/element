import { describe, expect,  test, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMessage, closeAll } from './method'

// 模拟完成动画的实现
export const rAF = async () => {
  return new Promise((res) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        res(null)
        await nextTick()
      })
    })
  })
}
function getTopValue(element: Element) {
  // 获取节点的样式
  const styles = window.getComputedStyle(element)
  // 获取样式中的属性
  const topValue = styles.getPropertyValue('top')
  return Number.parseFloat(topValue)
}
describe('createMessage', () => {
  test('调用方法应该创建对应的 Message 组件', async () => {
    const instance = createMessage({ message: 'hello world', duration: 0 })
    await rAF()
    console.log('html', document.body.innerHTML)
    expect(document.querySelector('.vk-message')).toBeTruthy()
    instance.destory()
    await rAF()
    console.log('html2', document.body.innerHTML)
    expect(document.querySelector('.vk-message')).toBeFalsy()
  })
  test('多次调用方法应该创建多个实例', async () => {
    createMessage({ message: 'hello world', duration: 0 })
    createMessage({ message: 'hello world 2', duration: 0 })
    await rAF()
    const elements = document.querySelectorAll('.vk-message')
    expect(elements.length).toBe(2)
    closeAll()
    await rAF()
    expect(document.querySelector('.vk-message')).toBeFalsy()

  })
  test('创建多个实例应该设置正确的 offset', async () => {
    createMessage({ message: 'hello world', duration: 0, offset: 100 })
    createMessage({ message: 'hello world 2', duration: 0, offset: 50 })
    await rAF()
    const elements = document.querySelectorAll('.vk-message')
    expect(elements.length).toBe(2)
    const firstElementTop = getTopValue(elements[0])
    const secondElementTop = getTopValue(elements[1])
    // 在JS-dom 中，对应的 height 返回为零
    expect(firstElementTop).toBe(100)
    expect(secondElementTop).toBe(150)
  })
})