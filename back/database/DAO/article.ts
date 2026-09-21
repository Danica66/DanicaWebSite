import { queryRows, queryExec } from '../query'
import { Article, ArticleStatus } from '../../../shared/types'

// 标签列的占位默认值：等同于“没有标签”（老数据可能残留这个值）
const EMPTY_TAGS = "('', 'EMPTY STRING')"
// 归一化标签：占位值 / 空串一律返回空串
const tagCol = `IF(tag IN ${EMPTY_TAGS}, '', tag) AS tag`

// 插入文章（写操作返回 ResultSetHeader，可用 insertId 取自增 ID）
export const insert_article = (article: Article) =>
  queryExec(
    'INSERT INTO articles (title, content, summary, cover_image, status, tag) VALUES (?, ?, ?, ?, ?, ?)',
    [article.title, article.content, article.summary, article.cover_image, article.status, article.tag ?? '']
  )

// 查找文章(分页)：可选 keyword 全文检索 / tag 标签过滤
export const select_article = (page: number, limit: number, keyword: string, status: ArticleStatus, tag = '') => {
  const offset = (page - 1) * limit
  let sql = `SELECT id, title, summary, cover_image, view_count, created_at, ${tagCol} FROM articles WHERE status = ?`
  const params: any[] = [status]
  if (tag) {
    sql += ' AND tag = ?'
    params.push(tag)
  }
  if (keyword) {
    sql += ' AND MATCH(title, summary) AGAINST(? IN BOOLEAN MODE)'
    params.push(keyword)
  }
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)
  return queryRows(sql, params)
}

// 文章总数（分页用）
export const select_article_count = (keyword: string, status: ArticleStatus, tag = '') => {
  let sql = 'SELECT COUNT(*) as total FROM articles WHERE status = ?'
  const params: any[] = [status]
  if (tag) {
    sql += ' AND tag = ?'
    params.push(tag)
  }
  if (keyword) {
    sql += ' AND MATCH(title, summary) AGAINST(? IN BOOLEAN MODE)'
    params.push(keyword)
  }
  return queryRows(sql, params)
}

// 标签聚合（标签云用）：仅已发布、排除空标签，按文章数降序
export const select_tags = () =>
  queryRows(
    `SELECT tag, COUNT(*) as count FROM articles WHERE status = 'published' AND tag NOT IN ${EMPTY_TAGS} GROUP BY tag ORDER BY count DESC, tag ASC`
  )

// id 查找文章（用 SELECT *：真实表结构与 sql dump 有出入，写死列名容易踩空列）
export const select_articlebyid = (id: number) =>
  queryRows('SELECT * FROM articles WHERE id = ?', [id])

// id 删除文章
export const delete_articlebyid = (id: number) =>
  queryExec('DELETE FROM articles WHERE id = ?', [id])

// 更新文章
export const update_article = (article: Article, id: number) =>
  queryExec(
    'UPDATE articles SET title = ?, content = ?, summary = ?, cover_image = ?, status = ?, tag = ? WHERE id = ?',
    [
      article.title,
      article.content,
      article.summary,
      article.cover_image,
      article.status ?? 'draft',
      article.tag ?? '',
      id,
    ]
  )

// 增加浏览量
export const update_article_viewcount = (id: number) =>
  queryExec('UPDATE articles SET view_count = view_count + 1 WHERE id = ?', [id])

// RSS: 获取最近文章（不需要分页，需要摘要）
export const select_articles_rss = (limit: number = 20) =>
  queryRows(
    "SELECT id, title, summary, cover_image, created_at FROM articles WHERE status = 'published' ORDER BY created_at DESC LIMIT ?",
    [limit]
  )
