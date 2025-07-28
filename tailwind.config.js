// tailwind.config.js
const { mantineBreakpoints } = require('@mantine/core');
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx,css}", // 配置 Tailwind 扫描的文件路径
  ],
  theme: {
    extend: {
      screens: mantineBreakpoints,
    },
  },
  plugins: [], // 注册插件
}
