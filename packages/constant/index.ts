const DATA = 'data-drag-';
export const DRAG_ID = `${DATA}id`; // id
export const DRAG_TYPE = `${DATA}type`; // 元素类型
export const DRAG_ACTIVE = `${DATA}active`; // 选择中
export const DRAG_DISABLED = `${DATA}disabled`; // 禁用
export const DRAG_SITE = `${DATA}site`; // 圆点位置
export const DRAG_GROUP = `${DATA}group`; // 是否组合
export const DRAG_GROUP_ID = `${DATA}group-id`; // 组合id
export const DRAG_EQUAL_RATIO = `${DATA}equal-ratio`; // 等比例缩放

export const ATTR_KEY = {
  id: DRAG_ID,
  site: DRAG_SITE,
  group: DRAG_GROUP,
  type: DRAG_TYPE,
  active: DRAG_ACTIVE,
  groupId: DRAG_GROUP_ID,
  ratio: DRAG_EQUAL_RATIO,
  disabled: DRAG_DISABLED,
}
