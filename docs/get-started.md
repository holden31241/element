# 仿 ElementPlus 组件库

仿ElementPlus组件库，地址： [https://github.com/holden31241](https://github.com/holden31241)


## 开始使用

**全局使用**


```js
// 引入所有组件
import VElement from '@vikingmute/v-element'
// 引入样式
import '@vikingmute/v-element/dist/style.css'

import App from './App.vue'
// 全局使用
createApp(App).use(VElement).mount('#app')
```

```vue
<template>
  <vk-button>我是 VkButton</vk-button>
</template>
```

**单个导入**



```vue
<template>
  <Button>我是 VkButton</Button>
</template>
<script>
  import { Button } from ' @vikingmute/v-element'
  export default {
    components: { Button },
  }
</script>
```


