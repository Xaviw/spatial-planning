import { Random } from 'mockjs'

export default {
  genTitle() {
    return {
      type: 'Title',
      props: {
        title: Random.ctitle(),
      },
    }
  },

  genSubTitle() {
    return {
      type: 'SubTitle',
      props: {
        title: Random.ctitle(),
      },
    }
  },

  genDataCard() {
    return {
      type: 'DataCard',
      props: {
        title: Random.ctitle(),
        content: Random.natural(1, 999),
        img:
          Random.image(
            `${Random.natural(300, 400)}x${Random.natural(200, 300)}`,
            Random.color(),
            Random.color(),
          ) + '.png',
      },
    }
  },

  genDescription() {
    const column = Random.natural(2, 3)
    return {
      type: 'Description',
      props: {
        layout: 'horizontal',
        column,
        data: Array.from({ length: Random.natural(4, 10) }).map(() => ({
          label: Random.cword(2, 4),
          value: Random.csentence(2, 6),
        })),
      },
    }
  },

  genTable() {
    const column = Random.natural(3, 8)
    return {
      type: 'Table',
      props: {
        data: [
          Array.from({ length: column }).map(() => Random.ctitle(1, 4)),
          ...Array.from({ length: Random.natural(3, 10) }).map(() =>
            Array.from({ length: column }).map(() => Random.natural(1, 999)),
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
            title: 'office',
            src: 'newteach.pbworks.com/f/ele+newsletter.docx',
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
            src: 'https://github.com/Xaviw/spatial-planning/archive/refs/heads/main.zip',
          },
        ],
      },
    }
  },

  genCarousel() {
    return {
      type: 'Carousel',
      props: {
        data: Array.from({ length: Random.natural(3, 5) }).map(
          () =>
            Random.image(
              `${Random.natural(300, 400)}x${Random.natural(200, 300)}`,
              Random.color(),
              Random.color(),
            ) + '.png',
        ),
      },
    }
  },

  genCollapse() {
    return {
      type: 'Collapse',
      props: {
        title: Random.ctitle(),
        content: `<p>${Random.cparagraph()}</p>`,
      },
    }
  },

  genTimeline() {
    return {
      type: 'Timeline',
      props: {
        data: Array.from({ length: Random.natural(3, 7) }).map(() => ({
          content: Random.ctitle(),
          color: Random.color(),
        })),
      },
    }
  },

  genPieChart() {
    return {
      type: 'PieChart',
      props: {
        data: Array.from({ length: Random.natural(3, 8) }).map(() => ({
          name: Random.cword(2, 4),
          value: Random.natural(1, 99),
        })),
      },
    }
  },

  genLineChart() {
    const num = Random.natural(4, 10)
    return {
      type: 'LineChart',
      props: {
        xAxis: Array.from({ length: num }).map(() => Random.cword(1, 4)),
        series: Array.from({ length: Random.natural(1, 4) }).map(() => ({
          name: Random.cword(1, 4),
          data: Array.from({ length: num }).map(() => Random.natural(1, 99)),
          stack: Random.boolean(),
          smooth: Random.boolean(),
        })),
      },
    }
  },

  genBarChart() {
    const num = Random.natural(4, 10)
    return {
      type: 'BarChart',
      props: {
        xAxis: Array.from({ length: num }).map(() => Random.cword(1, 4)),
        series: Array.from({ length: Random.natural(1, 4) }).map(() => ({
          name: Random.cword(1, 4),
          data: Array.from({ length: num }).map(() => Random.natural(1, 99)),
        })),
      },
    }
  },

  genProgress() {
    return {
      type: 'Progress',
      props: {
        data: Array.from({ length: Random.natural(3, 10) }).map(() => ({
          name: Random.ctitle(),
          value: Random.natural(0, 100),
        })),
      },
    }
  },
}
