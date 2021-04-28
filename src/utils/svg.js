/**
 *
 * @param {svg data} svg
 * 返回svg对象转换的base64图片
 */
export const svgToBase64 = (svg) => {
  return `data:image/svg+xml;base64,${window.btoa(svg)}`
}
