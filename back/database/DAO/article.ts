import { queryRows, queryExec } from '../query'
import { Article, ArticleStatus } from '../../../shared/types'

// 插入文章（写操作返回 ResultSetHeader，可用 insertId 取自增 ID）
export const insert_article = (article: Article) =>
  queryExec(
    'INSERT INTO articles (title, content, summary, cover_image, status, author_id) VALUES (?, ?, ?, ?, ?, ?)',
    [article.title, article.content, article.summary, article.cover_image, article.status, article.author_id]
  )

// 查找文章(分页)：有 keyword 时附加全文检索条件
export const select_article = (page: number, limit: number, keyword: string, status: ArticleStatus) => {
  const offset = (page - 1) * limit
  const fields = 'SELECT id, title, summary, cover_image, author_id, view_count, created_at'
  const base = ' FROM articles WHERE status = ?'
  const fulltext = ' AND MATCH(title, summary) AGAINST(? IN BOOLEAN MODE)'
  const order = ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  return keyword
    ? queryRows(fields + base + fulltext + order, [status, keyword, limit, offset])
    : queryRows(fields + base + order, [status, limit, offset])
}

// 文章总数（分页用）
export const select_article_count = (keyword: string, status: ArticleStatus) => {
  const base = 'SELECT COUNT(*) as total FROM articles WHERE status = ?'
  const fulltext = ' AND MATCH(title, summary) AGAINST(? IN BOOLEAN MODE)'
  return keyword
    ? queryRows(base + fulltext, [status, keyword])
    : queryRows(base, [status])
}

// id 查找文章
export const select_articlebyid = (id: number) =>
  queryRows('SELECT * FROM articles WHERE id = ?', [id])

// id 删除文章
export const delete_articlebyid = (id: number) =>
  queryExec('DELETE FROM articles WHERE id = ?', [id])

// 更新文章
export const update_article = (article: Article, id: number) =>
  queryExec(
    'UPDATE articles SET title = ?, content = ?, summary = ?, cover_image = ?, status = ? WHERE id = ?',
    [
      article.title,
      article.content,
      article.summary,
      article.cover_image,
      article.status ?? 'draft',
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
