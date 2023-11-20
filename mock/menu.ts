import type { Menu } from '../types/client'
import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/menu',
    method: 'get',
    timeout: 5000,
    statusCode: 200,
    response: () => ({
      code: 1,
      data: [
        {
          key: '1',
          label: '工作组',
          children: [
            {
              key: '11',
              label: '工作组1',
            },
            {
              key: '12',
              label: '工作组2',
            },
            {
              key: '13',
              label: '工作组3',
            },
            {
              key: '14',
              label: '工作组4',
            },
            {
              key: '15',
              label: '工作组5',
              children: [
                {
                  key: '111',
                  label: '工作组5-1',
                },
                {
                  key: '112',
                  label: '工作组5-2',
                },
              ],
            },
          ],
        },
      ] as Menu[],
      message: 'ok',
    }),
  },
] as MockMethod[]
