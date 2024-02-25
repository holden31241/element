import { createApp } from 'vue'
// 使用fortawesome图标库
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'

library.add(fas)
import './styles/index.css'
console.log(App.render?.toString())
createApp(App)
.mount('#app')
