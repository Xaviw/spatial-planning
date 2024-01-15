import { defineMock } from '@alova/mock'

export default defineMock({
  '/api/config': () => {
    return {
      code: 1,
      data: {
        mapStyle: 'blue',
        scalebar: true,
        scalebarPosition: [null, 5, null, 25],
        toolbar: true,
        toolbarPosition: [null, null, 5, 5],
        controlbar: true,
        controlbarPosition: [37, null, 5, null],
      },
      message: 'ok',
    }
  },
  '[POST]/api/config': () => {
    return {
      code: 1,
      data: true,
      message: 'ok',
    }
  },
})
