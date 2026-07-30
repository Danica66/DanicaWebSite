/**
 * 平铺数组 → 树（根据 parent_id 分组）
 * 返回根节点数组，每个节点包含 children 数组
 */
export function buildTree<T extends { id: number; parent_id: number | null; children?: T[] }>(
  list: T[],
): T[] {
  const map: Record<number, T> = {}
  const roots: T[] = []
  list.forEach(item => { item.children = []; map[item.id] = item })
  list.forEach(item => {
    if (item.parent_id && map[item.parent_id]) {
      map[item.parent_id].children!.push(item)
    } else {
      roots.push(item)
    }
  })
  return roots
}
