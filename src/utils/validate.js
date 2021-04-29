/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function checkPhone(str) {
  return /^1(3\d|4\d|5\d|6\d|7\d|8\d|9\d)\d{8}$/g.test(str)
}
