import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from '@vue/runtime-core'
import { createApp } from 'vuiter'

describe('Console Renderer', () => {
  // it('should render the App component correctly', () => {
  //   // 创建组件
  //   const App = defineComponent({
  //     setup() {
  //       const message = ref('Hello Console UI!')
        
  //       return () => h('div', {
  //         style: {
  //           width: '20',
  //           height: '3'
  //         }
  //       }, message.value)
  //     }
  //   })

  //   // 模拟控制台输出
  //   const mockLog = vi.fn()
  //   const container = {
  //     log: mockLog
  //   }

  //   // 创建和挂载应用
  //   const app = createApp(App)
  //   app.mount(container)

  //   // 验证输出
  //   expect(mockLog).toHaveBeenCalledTimes(1)
  //   expect(mockLog).toHaveBeenCalledWith(
  //     '┌────────────────────┐\n' +
  //     '│Hello Console UI!   │\n' +
  //     '│                    │\n' +
  //     '│                    │\n' +
  //     '└────────────────────┘\n'
  //   )
  // })

  // 添加更多测试用例以验证不同场景
  it('should render empty div correctly', () => {
    const EmptyApp = defineComponent({
      setup() {
        return () => h('div', {
          style: {
            width: '10',
            height: '1'
          }
        }, '')
      }
    })

    const mockLog = vi.fn()
    const container = {
      log: mockLog
    }

    const app = createApp(EmptyApp)
    app.mount(container)

    expect(mockLog).toHaveBeenCalledWith(
      '┌──────────┐\n' +
      '│          │\n' +
      '└──────────┘\n'
    )
  })
})
