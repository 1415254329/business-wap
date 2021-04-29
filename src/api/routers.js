import axios from '@/libs/api.request'

export function getRouterReq (access) {
  return axios.request({
    url: 'get_router',
    params: {
      access
    },
    method: 'get'
  })
}
