import request from '../utils/request'

export const getFeature = () => {
  return request({
    url: '/api/get/feature'
  })
}

export const getMusic = () => {
  return request({
    url: '/api/get/musicAll'
  })
}

