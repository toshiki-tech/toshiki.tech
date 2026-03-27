import { MetadataRoute } from 'next'
import { products } from '@/data/products'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toshiki.tech'

  const routes = ['', '/products', '/works', '/ai-lab', '/work-with-me', '/about'].map(
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

  return [...routes, ...productRoutes]
}
