export function getRotationDegrees(element: Element) {
  const style = window.getComputedStyle(element);
  const matrix = style.transform;
  if (matrix !== 'none') {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = +values[0];
    const b = +values[1];
    const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return angle < 0 ? angle + 360 : angle; // 将角度转换为正值
  }
  return 0; // 如果没有旋转，则返回0
}