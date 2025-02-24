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
          { text: 'single-cycle-cpu项目介绍', link: '/single-cycle-cpu' },
          { text: 'pipeline-cpu项目介绍',     link: '/pipeline-cpu' },
          { text: 'single-cycle启动RT',     link: '/run-RT' },
          { text: '安装ubuntu系统',           link: '/install-ubuntu' },
          { text: 'y86相关',                 link: '/computer/cpu/instruction-set/y86' },
          { text: 'modelsim',               link: '/computer/cpu/modelsim' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/akun0311/akun-docs' }
    ]
  }
})
