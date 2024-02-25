/* eslint-env node */
// 设置eslint的环境
// 配置postcss所需的插件
module.exports = {
  plugins: [
    require('postcss-each-variables'),
    // 循环插件（循环map）
    require('postcss-nested'),
    // 嵌套插件
    require('postcss-each')({
      // 循环插件
      plugins: {
        beforeEach: [
          // 需要在循环前先进行解析
          require('postcss-for'),
          // 数字循环插件
          require('postcss-color-mix')
          // 颜色混合插件
        ]
      }
    }),
  ]
}