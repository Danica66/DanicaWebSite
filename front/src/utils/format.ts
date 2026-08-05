/** 格式化日期为 YYYY-MM-DD */
export function formatDate(d: string | Date | undefined): string {
  if (!d) return ''
  const s = typeof d === 'string' ? d : d.toISOString()
  return s.slice(0, 10)
}
