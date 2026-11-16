import { blogArticles as defaultArticles } from './defaultBlogs'
import { getArticles } from './cms'

export type BlogArticle = typeof defaultArticles[number]
export const blogArticles = getArticles<BlogArticle[]>(defaultArticles)
export const blogTopics = ['All articles', ...new Set(blogArticles.map(article => article.category))]
export function readingMinutes(article: BlogArticle) {
  return Math.max(1, Math.ceil(article.sections.map(section => section.text).join(' ').split(/\s+/).length / 200))
}
