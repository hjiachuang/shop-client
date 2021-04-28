export default {

  /**
   * @param {string} key 键名
   * @param {any} value 键值
   * @param {string} moduleName 模块名
   * @return {boolean} 返回设置session的状态
   */
  setItem (key, value, moduleName) {
    const storageData = this.getStorage(moduleName)
    storageData[key] = value
    return this.setStorage(moduleName, storageData)
  },

  /**
   * @param {string} key 键名
   * @param {string} moduleName 模块名
   * @return {any} 返回模块中对应键名的键值
   */
  getItem (key, moduleName) {
    return this.getStorage(moduleName)[key]
  },

  /**
   * @param {string} key 键名
   * @param {string} moduleName 模块名
   * @return {boolean} 返回清除模块对应键名内容的状态
   */
  clearItem (key, moduleName) {
    const storageData = this.getStorage(moduleName)
    delete storageData[key]
    return this.setStorage(moduleName, storageData)
  },

  /**
   * @param {string} moduleName 模块名
   * @return {boolean} 返回清除模块的状态
   */
  clearModule (moduleName) {
    return window.sessionStorage.removeItem(moduleName)
  },

  /**
   * @return {boolean} 返回清除所有sessionStorage的状态
   */
  clearAll () {
    return window.sessionStorage.clear()
  },

  /**
   * @param {string} moduleName 模块名
   * @return {Object} 返回指定模块名的所有内容
   */
  getStorage (moduleName) {
    return JSON.parse(window.sessionStorage.getItem(moduleName) || '{}')
  },

  /**
   * @param {string} moduleName 模块名
   * @param {any} value 模块的内容
   * @return {boolean} 返回设置指定模块名的内容的状态
   */
  setStorage (moduleName, value) {
    return window.sessionStorage.setItem(moduleName, JSON.stringify(value))
  }
}
