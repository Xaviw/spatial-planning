import { defineMock } from '@alova/mock'

export default defineMock({
  '/config': () => {
    return {
      code: 1,
      data: {
        viewMode: '3D',
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
  '[PUT]/config': () => {
    return {
      code: 1,
      data: true,
      message: 'ok',
    }
  },
})
