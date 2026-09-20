import { Request, Response } from 'express'
import { select_articles_rss } from '../database/DAO/article'
import { Csite } from '../config'
import client from '../redis/redis'

const RSS_CACHE_KEY = 'blog:cache:rss'
const esc = (s: string) => String(s ?? '').replace(/]]>/g, ']]]]><![CDATA[>')

/** 文章变更后清除 RSS 缓存（best-effort，Redis 不可用不影响主流程） */
export const clearRssCache = () =>
  client.del(RSS_CACHE_KEY).catch((err) => console.error('清除文章列表缓存失败:', err))

/**
 * RSS 2.0 订阅源
 * GET /api/rss → 返回 XML
 */
export const rssController = async (_req: Request, res: Response) => {
  let xml: string | null = null
  // 先从 Redis 缓存中获取 RSS XML
  try {
    xml = await client.get(RSS_CACHE_KEY)
  } catch (err) {
    console.error('获取redis缓存失败:', err)
  }
  // 如果缓存中没有，则从数据库中获取最新的文章数据，并生成 RSS XML
  if (xml === null) {
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

      xml = `<?xml version="1.0" encoding="UTF-8"?>
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
    } catch (err: any) {
      console.error('RSS 生成失败:', err)
      return res.error(err.message || 'RSS 生成失败', 1, 500)
    }
    // 将生成的 RSS XML 缓存到 Redis 中，缓存时间为 60 秒
    try {
      await client.setex(RSS_CACHE_KEY, 60, xml)
    } catch (err) {
      console.error('设置redis缓存失败:', err)
    }
  }
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  return res.send(xml)
}
