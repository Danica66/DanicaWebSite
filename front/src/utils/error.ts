/** 从 axios 错误对象提取后端返回的 message，否则取 fallback */
export function getErrMsg(err: any, fallback: string): string {
  return err?.response?.data?.message || fallback
}
