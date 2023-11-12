import Mock from 'mockjs'
import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/sider',
    method: 'get',
    response: () => genList(8, 50, false),
  },
] as MockMethod[]

function genList(min: number, max: number, isInModal: boolean) {
  const functions = Object.values(generationFunctions)
  return Array.from({ length: Mock.Random.natural(min, max) }).map(() =>
    functions[Mock.Random.natural(0, functions.length - 1)](isInModal),
  )
}

const generationFunctions = {
  genTitle(isInModal: boolean): any {
    return {
      id: Mock.Random.id(),
      componentType: 'Title',
      componentProps: {
        title: Mock.Random.ctitle(),
        modalData: isInModal ? [] : genList(3, 18, true),
        modalTitle: Mock.Random.ctitle(),
        modalWidth: Mock.Random.natural(25, 80) + 'rem',
      },
    }
  },

  genSubTitle() {
    return {
      id: Mock.Random.id(),
      componentType: 'Title',
      componentProps: {
        title: Mock.Random.ctitle(),
      },
    }
  },

  genDataCard() {
    return {
      id: Mock.Random.id(),
      componentType: 'Title',
      componentProps: {
        title: Mock.Random.ctitle(),
        content: Mock.Random.natural(1, 999),
        imgSrc: Mock.Random.image(
          `${Mock.Random.natural(300, 400)}x${Mock.Random.natural(200, 300)}`,
          Mock.Random.color(),
          Mock.Random.color(),
        ),
      },
    }
  },

  genDescription() {
    const column = Mock.Random.natural(1, 3)
    return {
      id: Mock.Random.id(),
      componentType: 'Description',
      componentProps: {
        column,
        data: Array.from({ length: Mock.Random.natural(4, 10) }).map(() => ({
          label: Mock.Random.cword(2, 4),
          value: Mock.Random.csentence(2, 10),
          span: Mock.Random.natural(1, column),
        })),
      },
    }
  },

  genTable() {
    const column = Mock.Random.natural(3, 8)
    return {
      id: Mock.Random.id(),
      componentType: 'Table',
      componentProps: {
        data: [
          Array.from({ length: column }).map(() => Mock.Random.ctitle(1, 4)),
          ...Array.from({ length: Mock.Random.natural(3, 10) }).map(() =>
            Array.from({ length: column }).map(() =>
              Mock.Random.natural(1, 999),
            ),
          ),
        ],
      },
    }
  },

  genFileList() {
    return {
      id: Mock.Random.id(),
      componentType: 'FileList',
      componentProps: {
        data: [
          {
            title: '图片',
            img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          },
          {
            title: '文档',
            src: 'https://static-1252421604.cos.ap-guangzhou.myqcloud.com/vdp.docx',
          },
          {
            title: 'pdf',
            src: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
          },
          {
            title: '表格',
            src: '3.xlsx',
          },
          {
            title: 'ppt',
            src: 'https://static-1252421604.cos.ap-guangzhou.myqcloud.com/vdp.pptx',
          },
          {
            title: '视频',
            src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
          },
          {
            title: '音频',
            src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
          },
          {
            title: '其他',
            src: '7.x',
          },
        ],
      },
    }
  },

  genCarousel() {
    return {
      id: Mock.Random.id(),
      componentType: 'Carousel',
      componentProps: {
        data: Array.from({ length: Mock.Random.natural(3, 5) }).map(() =>
          Mock.Random.image(
            `${Mock.Random.natural(300, 400)}x${Mock.Random.natural(200, 300)}`,
            Mock.Random.color(),
            Mock.Random.color(),
          ),
        ),
      },
    }
  },

  genCollapse() {
    return {
      id: Mock.Random.id(),
      componentType: 'Collapse',
      componentProps: {
        title: Mock.Random.ctitle(),
        content: `<p>${Mock.Random.cparagraph()}</p>`,
      },
    }
  },

  genTimeline() {
    return {
      id: Mock.Random.id(),
      componentType: 'Timeline',
      componentProps: {
        data: Array.from({ length: Mock.Random.natural(3, 7) }).map(() => ({
          content: Mock.Random.ctitle(),
          color: Mock.Random.color(),
        })),
      },
    }
  },

  genPieChart() {
    return {
      id: Mock.Random.id(),
      componentType: 'PieChart',
      componentProps: {
        data: Array.from({ length: Mock.Random.natural(3, 8) }).map(() => ({
          name: Mock.Random.cword(2, 4),
          value: Mock.Random.natural(1, 99),
        })),
      },
    }
  },

  genLineChart() {
    const num = Mock.Random.natural(4, 10)
    return {
      id: Mock.Random.id(),
      componentType: 'LineChart',
      componentProps: {
        xAxis: Array.from({ length: Mock.Random.natural(1, 6) }).map(() =>
          Mock.Random.cword(1, 4),
        ),
        series: Array.from({ length: Mock.Random.natural(1, 4) }).map(() => ({
          name: Mock.Random.cword(1, 4),
          data: Array.from({ length: num }).map(() =>
            Mock.Random.natural(1, 99),
          ),
          stack: Mock.Random.boolean(),
          smooth: Mock.Random.boolean(),
        })),
      },
    }
  },

  genBarChart() {
    const num = Mock.Random.natural(4, 10)
    return {
      id: Mock.Random.id(),
      componentType: 'BarChart',
      componentProps: {
        xAxis: Array.from({ length: Mock.Random.natural(1, 6) }).map(() =>
          Mock.Random.cword(1, 4),
        ),
        series: Array.from({ length: Mock.Random.natural(1, 4) }).map(() => ({
          name: Mock.Random.cword(1, 4),
          data: Array.from({ length: num }).map(() =>
            Mock.Random.natural(1, 99),
          ),
        })),
      },
    }
  },

  genProgress() {
    return {
      id: Mock.Random.id(),
      componentType: 'Progress',
      componentProps: {
        data: Array.from({ length: Mock.Random.natural(3, 10) }).map(() => ({
          name: Mock.Random.ctitle(),
          value: Mock.Random.natural(0, 100),
        })),
      },
    }
  },
}
