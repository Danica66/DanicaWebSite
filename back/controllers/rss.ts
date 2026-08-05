import { Request, Response } from 'express'
import { select_articles_rss } from '../database/DAO/article'
import { Csite } from '../config'

const esc = (s: string) => String(s ?? '').replace(/]]>/g, ']]]]><![CDATA[>')

/**
 * RSS 2.0 订阅源
 * GET /api/rss → 返回 XML
 */
export const rssController = async (_req: Request, res: Response) => {
  try {
    const articles = await select_articles_rss(20)

    // 拼装 RSS XML (转义 ]]> 防止 XSS)
    const items = articles.map((a: any) => `
    <item>
      <title><![CDATA[${esc(a.title)}]]></title>
      <link>${Csite.url}/article/${a.id}</link>
      <description><![CDATA[${esc(a.summary)}]]></description>
      <pubDate>${new Date(a.created_at).toUTCString()}</pubDate>
      <guid isPermaLink="true">${Csite.url}/article/${a.id}</guid>
    </item>`).join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(Csite.title)}</title>
    <link>${esc(Csite.url)}</link>
    <description>${esc(Csite.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    return res.send(xml)
  } catch (err: any) {
    console.error('RSS 生成失败:', err)
    return res.error(err.message || 'RSS 生成失败', 1, 500)
  }
}
