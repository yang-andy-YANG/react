import { message } from 'antd'
import { hashHistory } from 'react-router'
import * as ajaxFun from './ajax'

export const ajax = ajaxFun
export function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

const logOut = () => {
  sessionStorage.clear()
  hashHistory.push('/login')
}

export const createAjaxAction = (api, startAction, endAction) => (data, cb, reject) =>
  (dispatch) => {
    let respon
    let newData = data
    startAction && dispatch(startAction())
    // 每个请求带上token
    const token = sessionStorage.getItem('token')
    if (token) {
      if (!newData) {
        newData = {}
      }
      newData.token = token || null
    }
    newData = isArray(newData) ? newData : [newData]
    api(...newData)
      .then(response => response.json())
      .then((resp) => {
        respon = resp
        endAction && dispatch(endAction({ req: newData, res: resp }))
      })
      .then(() => {
        switch (respon.status) {
        case 1:
          cb && cb(respon)
          break
        case 0:
          if (typeof (reject) === 'function') {
            reject(respon)
          } else {
            message.error(respon.msg)
          }
          break
        case -1:
          logOut()
          break
        default:
          console.log('status的返回值不是0或1')
          // logOut()
        }
      })
      .catch(error => console.log(error)) // eslint-disable-line no-use-before-define

    /* api({ ...newData })
      .then(response => response.data)
      .then((resp) => {
        respon = resp
        endAction && dispatch(endAction({ req: newData, res: resp }))
      })
      .then(() => {
        switch (respon.status) {
        case 1:
          cb && cb(respon)
          break
        case 0:
          if (typeof (reject) === 'function') {
            reject(respon)
          } else {
            message.error(respon.msg)
          }
          break
        case -1:
          logOut()
          break
        default:
          console.log('status的返回值不是0或1')
          // logOut()
        }
      })
      .catch(catchError) // eslint-disable-line no-use-before-define */
  }
