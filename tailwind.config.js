// tailwind.config.js
const { mantineBreakpoints } = require('@mantine/core');
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx,css}", // 配置 Tailwind 扫描的文件路径
    "./src/components/**/*.{ts,tsx}", // 只扫描自己的业务组件，排除node_modules和Mantine相关
    "./src/app/**/*.{ts,tsx}",
    "!./src/components/**/*.stories.tsx", // 排除storybook文件
  ],
  theme: {
    extend: {
      screens: mantineBreakpoints,
    },
  },
  plugins: [], // 注册插件
}
