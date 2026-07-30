/**
 * HTML 实体转义
 */
function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return str.replace(/[&<>"']/g, c => map[c])
}

/** 转义正则特殊字符 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 高亮文本中的关键词（大小写不敏感），返回安全 HTML 字符串
 * @param text    原始文本
 * @param keyword 搜索关键词，为空时仅转义后返回
 */
export function highlightText(text: string, keyword: string): string {
  if (!keyword) return escapeHtml(text)
  const escaped = escapeHtml(text)
  const escapedKw = escapeRegex(escapeHtml(keyword))
  const regex = new RegExp(`(${escapedKw})`, 'gi')
  return escaped.replace(regex, '<mark>$1</mark>')
}
