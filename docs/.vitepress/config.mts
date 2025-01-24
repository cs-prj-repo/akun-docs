import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/akun-docs/',
  title: "CS-Knowledge",
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
          { text: 'cpu-pipeline项目介绍', link: '/cpu-pipeline' },
          { text: '安装ubuntu系统', link: '/install-ubuntu' },
          { text: 'y86相关', link: '/computer/cpu/instruction-set/y86' },
          { text: 'modelsim', link: '/computer/cpu/modelsim' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/akun0311/akun-docs' }
    ]
  }
})
