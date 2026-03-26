import 'server-only'

export type Locale = 'en' | 'zh' | 'ja'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  zh: () => import('@/dictionaries/zh.json').then((module) => module.default),
  ja: () => import('@/dictionaries/ja.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries.en()
}
