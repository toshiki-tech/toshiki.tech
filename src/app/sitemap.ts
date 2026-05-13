import { MetadataRoute } from 'next'
import { products } from '@/data/products'
import { getAllWritingSlugs } from '@/lib/writing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://toshiki.tech'

  const routes = ['', '/products', '/writing', '/work-with-me', '/about'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    })
  )

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/p/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const writingEntries = await getAllWritingSlugs()
  const writingRoutes = writingEntries.map(({ slug, locale }) => ({
    url: `${baseUrl}/${locale}/writing/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...routes, ...productRoutes, ...writingRoutes]
}
