import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/akun-docs/',
  title: "akun",
  description: "Sharing of computer knowledge",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: '文档',
        items: [
          { text: 'cpu-single-cycle项目介绍', link: '/cpu-single-cycle' },
          { text: '安装ubuntu系统', link: '/install-ubuntu' },
          { text: 'riscv指令介绍', link: '/computer/cpu/riscv' },
          { text: 'riscv相关资料', link: '/computer/cpu/riscv-information' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/akun0311/akun-docs' }
    ]
  }
})
