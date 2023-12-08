import Mock from 'mockjs'
import type { GetSiderParams } from '@sp/shared/apis'
import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/sider',
    method: 'get',
    timeout: 1000,
    statusCode: 200,
    response: ({ query }) => ({
      code: 1,
      data: genList(8, 50, false, query as GetSiderParams),
      message: 'ok',
    }),
  },
  {
    url: '/api/sider',
    method: 'post',
    timeout: 1000,
    statusCode: 200,
    response: () => ({
      code: 1,
      data: true,
      message: 'ok',
    }),
  },
] as MockMethod[]

function genList(
  min: number,
  max: number,
  isInModal: boolean,
  params: GetSiderParams,
) {
  const functions = Object.values(generationFunctions)
  return Array.from({ length: Mock.Random.natural(min, max) }).map(() => {
    return {
      ...functions[Mock.Random.natural(0, functions.length - 1)](
        isInModal,
        params,
      ),
      id: Mock.Random.id(),
      status: params.filter ? true : Mock.Random.boolean(),
      menuIds: isInModal
        ? undefined
        : params.menuId
        ? [params.menuId]
        : Mock.Random.shuffle(['1', '11', '12', '13', '121', '122']).slice(
            0,
            Mock.Random.natural(1, 3),
          ),
      position: isInModal ? undefined : params.position,
    }
  })
}

const generationFunctions = {
  genTitle(isInModal: boolean, params: GetSiderParams): any {
    return {
      type: 'Title',
      props: {
        title: Mock.Random.ctitle(),
        modalData: isInModal ? [] : genList(3, 18, true, params),
        modalTitle: Mock.Random.ctitle(),
        modalWidth: Mock.Random.natural(25, 80) + 'rem',
      },
    }
  },

  genSubTitle() {
    return {
      type: 'SubTitle',
      props: {
        title: Mock.Random.ctitle(),
      },
    }
  },

  genDataCard() {
    return {
      type: 'DataCard',
      props: {
        title: Mock.Random.ctitle(),
        content: Mock.Random.natural(1, 999),
        img: Mock.Random.image(
          `${Mock.Random.natural(300, 400)}x${Mock.Random.natural(200, 300)}`,
          Mock.Random.color(),
          Mock.Random.color(),
        ),
      },
    }
  },

  genDescription() {
    const column = Mock.Random.natural(2, 3)
    return {
      type: 'Description',
      props: {
        layout: 'horizontal',
        column,
        data: Array.from({ length: Mock.Random.natural(4, 10) }).map(() => ({
          label: Mock.Random.cword(2, 4),
          value: Mock.Random.csentence(2, 6),
        })),
      },
    }
  },

  genTable() {
    const column = Mock.Random.natural(3, 8)
    return {
      type: 'Table',
      props: {
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
      type: 'FileList',
      props: {
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
      type: 'Carousel',
      props: {
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
      type: 'Collapse',
      props: {
        title: Mock.Random.ctitle(),
        content: `<p>${Mock.Random.cparagraph()}</p>`,
      },
    }
  },

  genTimeline() {
    return {
      type: 'Timeline',
      props: {
        data: Array.from({ length: Mock.Random.natural(3, 7) }).map(() => ({
          content: Mock.Random.ctitle(),
          color: Mock.Random.color(),
        })),
      },
    }
  },

  genPieChart() {
    return {
      type: 'PieChart',
      props: {
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
      type: 'LineChart',
      props: {
        xAxis: Array.from({ length: num }).map(() => Mock.Random.cword(1, 4)),
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
      type: 'BarChart',
      props: {
        xAxis: Array.from({ length: num }).map(() => Mock.Random.cword(1, 4)),
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
      type: 'Progress',
      props: {
        data: Array.from({ length: Mock.Random.natural(3, 10) }).map(() => ({
          name: Mock.Random.ctitle(),
          value: Mock.Random.natural(0, 100),
        })),
      },
    }
  },
}
