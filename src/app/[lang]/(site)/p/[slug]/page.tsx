import { products, localizeAppStoreUrl } from '@/data/products';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Cpu, ArrowRight, Users, Upload, Download, Apple, Puzzle, ExternalLink, Smartphone } from 'lucide-react';
import { Locale, getDictionary } from '@/lib/get-dictionary';
import ZoomableImage from '@/components/ZoomableImage';
import { ZOOM_LABELS } from '@/lib/zoom-labels';
import { detectStore, STORE_LABELS } from '@/lib/external-store';
import { createClient } from '@supabase/supabase-js';
import { getFeatureFlags } from '@/lib/yomi-feature-flags';

export async function generateStaticParams() {
  const locales: Locale[] = ['en', 'zh', 'ja', 'zh-tw'];
  const params: { lang: Locale; slug: string }[] = [];

  for (const locale of locales) {
    for (const product of products) {
      params.push({ lang: locale, slug: product.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: { params: { lang: Locale; slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return {};
  const t = product.translations[params.lang];
  return {
    title: `${t.title} | Toshiki Tech`,
    description: t.subtitle,
  };
}

export default async function ProductDetailPage({ params }: { params: { lang: Locale; slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  const dict = await getDictionary(params.lang);

  if (!product) {
    notFound();
  }

  const t = product.translations[params.lang];

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ''
  );
  const flags = await getFeatureFlags(supa);
  const communityEnabled = flags.community_enabled;

  return (
    <div className="min-h-screen bg-[var(--background-start-rgb)]">
      {/* Product Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)]" />

        <div className="container-custom">
          <Link href={`/${params.lang}/products`} className="inline-flex items-center gap-2 mb-16 text-sm font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors group">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            {params.lang === 'en' ? 'Back to Products' : (params.lang === 'zh' || params.lang === 'zh-tw') ? (params.lang === 'zh' ? '返回产品列表' : '返回產品列表') : 'プロダクト一覧へ'}
          </Link>

          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] text-xs font-black uppercase tracking-widest border border-[rgb(var(--accent))]/20">
              Official Product Location
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-[var(--foreground-rgb)]">
              {t.title}
            </h1>
            <p className="text-2xl md:text-3xl font-medium text-[var(--muted-foreground)] max-w-2xl mx-auto italic">
              &quot;{t.subtitle}&quot;
            </p>
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto leading-relaxed">
              {t.description}
            </p>
          </div>
        </div>
      </section>

      {/* Product Layout */}
      <section className="py-24 border-t border-[var(--border)] bg-[var(--muted)]/20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-12 order-2 lg:order-1">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">
                  {params.lang === 'en' ? 'Core Features' : (params.lang === 'zh' || params.lang === 'zh-tw') ? (params.lang === 'zh' ? '核心功能' : '核心功能') : '主な機能'}
                </h2>
                <p className="text-[var(--muted-foreground)]">
                  {params.lang === 'en'
                    ? 'Built by a developer to solve real-world Japanese immersion pain points.'
                    : params.lang === 'zh'
                      ? '由开发者亲历打造，旨在解决日语沉浸学习中的核心痛点。'
                      : params.lang === 'zh-tw'
                        ? '由開發端親歷打造，旨在解決日語沉浸學習中的核心痛點。'
                        : '開発者自らが日本語学習で直面した課題を解決するために設計されています。'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {t.features.map((feature, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-9 h-9 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="flex items-center">
                      <p className="font-bold text-base leading-snug">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-12">
              {/* Primary Image */}
              <div className={`${product.portraitImageUrl ? 'aspect-[3/4.5] md:aspect-[3/4.5] lg:aspect-[2/3]' : 'aspect-[4/5] md:aspect-square'} bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden relative group`}>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
                {product.imageUrl ? (
                  <ZoomableImage
                    src={product.portraitImageUrl || product.imageUrl}
                    alt={t.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    zoomLabel={ZOOM_LABELS[params.lang].zoom}
                    closeLabel={ZOOM_LABELS[params.lang].close}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4 opacity-40">
                      <Cpu size={80} className="mx-auto text-[var(--muted-foreground)]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery Preview */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {product.gallery.map((img, i) => (
                    <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                      <ZoomableImage
                        src={img}
                        alt={`${t.title} — ${i + 1}`}
                        className="w-full h-full object-cover"
                        zoomLabel={ZOOM_LABELS[params.lang].zoom}
                        closeLabel={ZOOM_LABELS[params.lang].close}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      {product.downloads && (() => {
        const d = product.downloads!;
        const labels = {
          en: {
            eyebrow: 'Download',
            title: `Get ${t.title} for your desktop`,
            subtitle: 'Free, offline, no account required.',
            version: 'Version',
            recommended: 'Recommended',
            mac: 'macOS',
            macArm: 'Apple Silicon (M1 / M2 / M3 / M4)',
            macIntel: 'Intel',
            windows: 'Windows',
            winExe: 'Installer (.exe)',
            winMsi: 'MSI installer',
            viewRelease: 'View all releases on GitHub',
            download: 'Download',
          },
          zh: {
            eyebrow: '下载',
            title: `下载 ${t.title} 桌面版`,
            subtitle: '免费、离线，无需注册账号。',
            version: '版本',
            recommended: '推荐',
            mac: 'macOS',
            macArm: 'Apple 芯片 (M1 / M2 / M3 / M4)',
            macIntel: 'Intel 芯片',
            windows: 'Windows',
            winExe: '安装程序 (.exe)',
            winMsi: 'MSI 安装包',
            viewRelease: '在 GitHub 查看全部版本',
            download: '下载',
          },
          ja: {
            eyebrow: 'ダウンロード',
            title: `${t.title} デスクトップ版をダウンロード`,
            subtitle: '無料・オフライン・アカウント不要。',
            version: 'バージョン',
            recommended: '推奨',
            mac: 'macOS',
            macArm: 'Apple Silicon (M1 / M2 / M3 / M4)',
            macIntel: 'Intel',
            windows: 'Windows',
            winExe: 'インストーラ (.exe)',
            winMsi: 'MSI インストーラ',
            viewRelease: 'GitHub ですべてのリリースを見る',
            download: 'ダウンロード',
          },
          'zh-tw': {
            eyebrow: '下載',
            title: `下載 ${t.title} 桌面版`,
            subtitle: '免費、離線，無需註冊帳號。',
            version: '版本',
            recommended: '推薦',
            mac: 'macOS',
            macArm: 'Apple 晶片 (M1 / M2 / M3 / M4)',
            macIntel: 'Intel 晶片',
            windows: 'Windows',
            winExe: '安裝程式 (.exe)',
            winMsi: 'MSI 安裝包',
            viewRelease: '在 GitHub 查看所有版本',
            download: '下載',
          },
        }[params.lang];

        const mac = d.platforms.filter((p) => p.os.startsWith('macos'));
        const win = d.platforms.filter((p) => p.os.startsWith('windows'));

        const osLabel = (os: typeof d.platforms[number]['os']) => {
          switch (os) {
            case 'macos-arm': return labels.macArm;
            case 'macos-intel': return labels.macIntel;
            case 'windows-exe': return labels.winExe;
            case 'windows-msi': return labels.winMsi;
          }
        };

        const renderPlatformList = (items: typeof d.platforms) => (
          <div className="space-y-3">
            {items.map((p) => (
              <a
                key={p.os}
                href={p.url}
                className={`group flex items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${
                  p.recommended
                    ? 'border-[rgb(var(--accent))]/40 bg-[rgb(var(--accent))]/5 hover:bg-[rgb(var(--accent))]/10'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-[rgb(var(--accent))]/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-bold text-sm truncate">{osLabel(p.os)}</span>
                  {p.recommended && (
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[rgb(var(--accent))]/15 text-[rgb(var(--accent))]">
                      {labels.recommended}
                    </span>
                  )}
                </div>
                <Download size={18} className="shrink-0 text-[var(--muted-foreground)] group-hover:text-[rgb(var(--accent))] transition-colors" />
              </a>
            ))}
          </div>
        );

        return (
          <section id="download" className="py-24 border-t border-[var(--border)] scroll-mt-20">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[rgb(var(--accent))]">
                    {labels.eyebrow}
                  </h2>
                  <h3 className="text-4xl font-black tracking-tight">{labels.title}</h3>
                  <p className="text-lg text-[var(--muted-foreground)]">
                    {labels.subtitle} <span className="font-mono text-sm ml-2">{labels.version} {d.version}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mac.length > 0 && (
                    <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-bold tracking-tight">{labels.mac}</h4>
                        <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)]">.dmg</span>
                      </div>
                      {renderPlatformList(mac)}
                    </div>
                  )}
                  {win.length > 0 && (
                    <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-bold tracking-tight">{labels.windows}</h4>
                        <span className="text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)]">.exe / .msi</span>
                      </div>
                      {renderPlatformList(win)}
                    </div>
                  )}
                </div>

                {d.releaseUrl && (
                  <div className="text-center">
                    <a
                      href={d.releaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors"
                    >
                      {labels.viewRelease}
                      <ArrowRight size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Get the App Section (for products without direct downloads but with store links) */}
      {!product.downloads && product.externalLinks.length > 0 && product.slug !== 'yomiplay' && (() => {
        const link = product.externalLinks[0];
        const kind = detectStore(link.url);
        const labels = STORE_LABELS[params.lang][kind];
        const Icon = kind === 'app-store' ? Apple : kind === 'chrome-store' ? Puzzle : ExternalLink;
        const sectionTitle = {
          en: `Get ${t.title}`,
          zh: `获取 ${t.title}`,
          'zh-tw': `取得 ${t.title}`,
          ja: `${t.title} を入手`,
        }[params.lang];
        const eyebrow = {
          en: 'Available on',
          zh: '获取渠道',
          'zh-tw': '取得渠道',
          ja: '入手先',
        }[params.lang];
        const subtitle = {
          'app-store': {
            en: 'Tap below to open the App Store on your iPhone or iPad.',
            zh: '点击下方按钮在 iPhone 或 iPad 上打开 App Store。',
            'zh-tw': '點擊下方按鈕在 iPhone 或 iPad 上開啟 App Store。',
            ja: '下のボタンをタップして、iPhone または iPad で App Store を開きます。',
          },
          'chrome-store': {
            en: 'Install the extension from the Chrome Web Store.',
            zh: '从 Chrome 网上应用店安装扩展。',
            'zh-tw': '從 Chrome 線上應用程式商店安裝擴充功能。',
            ja: 'Chrome ウェブストアから拡張機能をインストールします。',
          },
          'other': { en: '', zh: '', 'zh-tw': '', ja: '' },
        }[kind][params.lang];

        return (
          <section id="get-app" className="py-24 border-t border-[var(--border)] scroll-mt-20">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto space-y-10">
                <div className="text-center space-y-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[rgb(var(--accent))]">
                    {eyebrow}
                  </h2>
                  <h3 className="text-4xl font-black tracking-tight">{sectionTitle}</h3>
                  {subtitle && (
                    <p className="text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">{subtitle}</p>
                  )}
                </div>

                <div className="flex justify-center">
                  <a
                    href={localizeAppStoreUrl(link.url, params.lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-black text-white font-bold text-lg hover:bg-black/85 transition-colors shadow-xl"
                  >
                    <Icon size={28} />
                    <span>{labels.long}</span>
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* YomiPlay — Dual-platform download */}
      {product.slug === 'yomiplay' && (() => {
        const dl = {
          en: {
            eyebrow: 'Available on',
            heading: 'Get YomiPlay',
            sub: 'Download on iOS or get the Android APK — start reading with audio in minutes.',
            ios: 'Download on the App Store',
            android: 'Download Android APK',
            allPlatforms: 'All platforms & versions',
          },
          zh: {
            eyebrow: '下载渠道',
            heading: '下载 YomiPlay',
            sub: '在 iOS 上下载，或获取安卓 APK — 几分钟内开启带音频的沉浸阅读体验。',
            ios: '在 App Store 下载',
            android: '下载安卓 APK',
            allPlatforms: '查看全部平台及版本',
          },
          'zh-tw': {
            eyebrow: '下載渠道',
            heading: '下載 YomiPlay',
            sub: '在 iOS 上下載，或取得安卓 APK — 幾分鐘內開啟帶音訊的沉浸閱讀體驗。',
            ios: '在 App Store 下載',
            android: '下載安卓 APK',
            allPlatforms: '查看全部平台及版本',
          },
          ja: {
            eyebrow: '入手先',
            heading: 'YomiPlay を入手',
            sub: 'iOS は App Store から、Android は APK を直接ダウンロード。',
            ios: 'App Store からダウンロード',
            android: 'Android APK をダウンロード',
            allPlatforms: 'すべてのプラットフォーム・バージョン',
          },
        }[params.lang];

        return (
          <section id="get-app" className="py-24 border-t border-[var(--border)] scroll-mt-20">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto space-y-10">
                <div className="text-center space-y-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[rgb(var(--accent))]">{dl.eyebrow}</h2>
                  <h3 className="text-4xl font-black tracking-tight">{dl.heading}</h3>
                  <p className="text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">{dl.sub}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
                  <a
                    href="https://apps.apple.com/jp/app/yomiplay/id6760715932"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-black text-white font-bold hover:bg-black/85 transition-colors shadow-xl text-center"
                  >
                    <Apple size={32} />
                    <span className="text-sm">{dl.ios}</span>
                  </a>

                  <a
                    href="/api/yomiplay/apk/download"
                    className="group flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-[rgb(var(--accent))]/30 bg-[rgb(var(--accent))]/5 text-center hover:bg-[rgb(var(--accent))]/10 transition-colors"
                  >
                    <Smartphone size={32} className="text-[rgb(var(--accent))]" />
                    <span className="font-bold text-sm">{dl.android}</span>
                  </a>
                </div>

                <div className="text-center">
                  <Link
                    href={`/${params.lang}/yomiplay/download`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors"
                  >
                    {dl.allPlatforms}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* YomiPlay — Pricing summary */}
      {product.slug === 'yomiplay' && (() => {
        const pr = {
          en: {
            eyebrow: 'Pricing',
            heading: 'Simple, transparent pricing',
            sub: 'Start for free. Upgrade when you\'re ready.',
            plans: [
              { name: 'Free', price: '¥0', period: '', badge: null, tagline: '1 hour/month of free speech-to-text — experience the core listening workflow at no cost.' },
              { name: 'Premium Monthly', price: '¥180', period: '/mo', badge: null, tagline: 'Unlock unlimited subtitle generation, shadowing, TTS, and audio/video subtitle import, export & sharing.' },
              { name: 'Premium Yearly', price: '¥1,480', period: '/yr', badge: 'Save 31%', tagline: 'All Premium features at the best value — roughly 2 months free vs. monthly.' },
              { name: 'Lifetime', price: '¥2,980', period: '', badge: 'One-time', tagline: 'Pay once, use forever. No recurring fees, all future Premium updates included.' },
            ],
            cta: 'View full pricing',
          },
          zh: {
            eyebrow: '价格',
            heading: '简单透明的定价',
            sub: '免费开始使用，准备好时再升级。',
            plans: [
              { name: '免费版', price: '¥0', period: '', badge: null, tagline: '每月 1 小时语音转文字配额，免费体验核心精听功能。' },
              { name: 'Premium 月付', price: '¥180', period: '/月', badge: null, tagline: '解锁无限字幕生成、跟读、文本朗读及音视频字幕资源导入导出分享功能。' },
              { name: 'Premium 年付', price: '¥1,480', period: '/年', badge: '省 31%', tagline: '全部 Premium 功能，最划算之选 —— 相比月付约省 2 个月。' },
              { name: 'Premium 买断', price: '¥2,980', period: '', badge: '一次付清', tagline: '一次付费，永久使用。无定期扣费，含未来全部 Premium 更新。' },
            ],
            cta: '查看完整价格方案',
          },
          'zh-tw': {
            eyebrow: '價格',
            heading: '簡單透明的定價',
            sub: '免費開始使用，準備好時再升級。',
            plans: [
              { name: '免費版', price: '¥0', period: '', badge: null, tagline: '每月 1 小時語音轉文字配額，免費體驗核心精聽功能。' },
              { name: 'Premium 月付', price: '¥180', period: '/月', badge: null, tagline: '解鎖無限字幕生成、跟讀、文字朗讀及音視頻字幕資源導入導出分享功能。' },
              { name: 'Premium 年付', price: '¥1,480', period: '/年', badge: '省 31%', tagline: '全部 Premium 功能，最划算之選 —— 相比月付約省 2 個月。' },
              { name: 'Premium 買斷', price: '¥2,980', period: '', badge: '一次付清', tagline: '一次付費，永久使用。無定期扣費，含未來全部 Premium 更新。' },
            ],
            cta: '查看完整價格方案',
          },
          ja: {
            eyebrow: '料金',
            heading: 'シンプルで透明な料金体系',
            sub: '無料で始めて、準備ができたらアップグレード。',
            plans: [
              { name: '無料版', price: '¥0', period: '', badge: null, tagline: '毎月1時間の音声テキスト変換枠付き、無料でコア精聴機能をお試しいただけます。' },
              { name: 'Premium 月払い', price: '¥180', period: '/月', badge: null, tagline: '無制限の字幕生成・シャドーイング・読み上げ、音声／動画字幕リソースのインポート・エクスポート・共有を解放。' },
              { name: 'Premium 年払い', price: '¥1,480', period: '/年', badge: '31% お得', tagline: 'すべての Premium 機能を最もお得に。月額換算で約2ヶ月分お得です。' },
              { name: '買い切り', price: '¥2,980', period: '', badge: '一括払い', tagline: '一度の購入で永久に利用可能。継続課金なし、今後の Premium アップデートもすべて含まれます。' },
            ],
            cta: '詳細な料金プランを見る',
          },
        }[params.lang];

        return (
          <section className="py-24 border-t border-[var(--border)]">
            <div className="container-custom">
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[rgb(var(--accent))]">{pr.eyebrow}</h2>
                  <h3 className="text-4xl font-black tracking-tight">{pr.heading}</h3>
                  <p className="text-lg text-[var(--muted-foreground)]">{pr.sub}</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {pr.plans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`relative pt-6 p-5 rounded-2xl border flex flex-col gap-4 ${
                        plan.badge === (params.lang === 'en' ? 'Save 31%' : params.lang === 'ja' ? '31% お得' : '省 31%')
                          ? 'border-[rgb(var(--accent))]/50 bg-[rgb(var(--accent))]/5'
                          : 'border-[var(--border)] bg-[var(--card)]'
                      }`}
                    >
                      {plan.badge && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-[rgb(var(--accent))] text-white whitespace-nowrap">
                          {plan.badge}
                        </span>
                      )}
                      <div>
                        <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider leading-tight">{plan.name}</p>
                        <p className="text-3xl font-black mt-1 tracking-tight">
                          {plan.price}
                          <span className="text-sm font-normal text-[var(--muted-foreground)]">{plan.period}</span>
                        </p>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed flex-1">{plan.tagline}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 text-center">
                  <p className="text-xs text-[var(--muted-foreground)] max-w-xl mx-auto">
                    {params.lang === 'en'
                      ? 'Prices above apply to the Android version. iOS pricing is set by the App Store and may differ.'
                      : params.lang === 'zh'
                        ? '以上价格仅适用于 Android 版本。iOS 版本价格由 App Store 决定，以 App Store 内显示为准。'
                        : params.lang === 'zh-tw'
                          ? '以上價格僅適用於 Android 版本。iOS 版本價格由 App Store 決定，以 App Store 內顯示為準。'
                          : '上記の価格は Android 版の料金です。iOS 版は App Store の価格が適用されます。'}
                  </p>
                  <Link
                    href={`/${params.lang}/yomiplay/pricing`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--muted-foreground)] hover:text-[rgb(var(--accent))] transition-colors"
                  >
                    {pr.cta}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Community Section - YomiPlay only */}
      {product.slug === 'yomiplay' && communityEnabled && (
        <section className="py-24 border-t border-[var(--border)]">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[rgb(var(--accent))]">
                  {params.lang === 'en' ? 'Community' : params.lang === 'zh' ? '社区' : params.lang === 'zh-tw' ? '社區' : 'コミュニティ'}
                </h2>
                <h3 className="text-4xl font-black tracking-tight">
                  {params.lang === 'en'
                    ? 'Subtitle Sharing Platform'
                    : params.lang === 'zh'
                      ? '字幕分享平台'
                      : params.lang === 'zh-tw'
                        ? '字幕分享平台'
                        : '字幕共有プラットフォーム'}
                </h3>
                <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
                  {params.lang === 'en'
                    ? 'Browse and download community-shared .yomi subtitle files, or upload your own polished subtitles to help other learners.'
                    : params.lang === 'zh'
                      ? '浏览和下载社区分享的 .yomi 字幕文件，或上传你精修的字幕帮助其他学习者。'
                      : params.lang === 'zh-tw'
                        ? '瀏覽和下載社區分享的 .yomi 字幕檔案，或上傳你精修的字幕幫助其他學習者。'
                        : 'コミュニティが共有する .yomi 字幕ファイルをダウンロード、またはあなたの字幕をアップロードして他の学習者をサポートしましょう。'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  href={`/${params.lang}/yomiplay/community`}
                  className="group p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3 hover:border-[rgb(var(--accent))]/50 hover:bg-[rgb(var(--accent))]/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] mx-auto group-hover:bg-[rgb(var(--accent))]/20 transition-colors">
                    <Download size={24} />
                  </div>
                  <h4 className="font-bold group-hover:text-[rgb(var(--accent))] transition-colors">
                    {params.lang === 'en' ? 'Download Subtitles' : params.lang === 'zh' ? '下载字幕' : params.lang === 'zh-tw' ? '下載字幕' : '字幕をダウンロード'}
                  </h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {params.lang === 'en'
                      ? 'Find high-quality .yomi files for podcasts, news, and more.'
                      : params.lang === 'zh'
                        ? '获取播客、新闻等内容的高质量 .yomi 字幕文件。'
                        : params.lang === 'zh-tw'
                          ? '取得播客、新聞等內容的高品質 .yomi 字幕檔案。'
                          : 'ポッドキャスト、ニュースなどの高品質な .yomi ファイルを取得。'}
                  </p>
                </Link>
                <Link
                  href={`/${params.lang}/yomiplay/community/upload`}
                  className="group p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3 hover:border-[rgb(var(--accent))]/50 hover:bg-[rgb(var(--accent))]/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] mx-auto group-hover:bg-[rgb(var(--accent))]/20 transition-colors">
                    <Upload size={24} />
                  </div>
                  <h4 className="font-bold group-hover:text-[rgb(var(--accent))] transition-colors">
                    {params.lang === 'en' ? 'Share Your Work' : params.lang === 'zh' ? '分享你的成果' : params.lang === 'zh-tw' ? '分享你的成果' : 'あなたの成果を共有'}
                  </h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {params.lang === 'en'
                      ? 'Upload polished subtitles to help learners with lower-spec devices.'
                      : params.lang === 'zh'
                        ? '上传精修字幕，帮助设备性能较低的学习者。'
                        : params.lang === 'zh-tw'
                          ? '上傳精修字幕，幫助裝置效能較低的學習者。'
                          : '精修した字幕をアップロードし、低スペックデバイスの学習者を支援。'}
                  </p>
                </Link>
                <Link
                  href={`/${params.lang}/yomiplay/community`}
                  className="group p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3 hover:border-[rgb(var(--accent))]/50 hover:bg-[rgb(var(--accent))]/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgb(var(--accent))]/10 flex items-center justify-center text-[rgb(var(--accent))] mx-auto group-hover:bg-[rgb(var(--accent))]/20 transition-colors">
                    <Users size={24} />
                  </div>
                  <h4 className="font-bold group-hover:text-[rgb(var(--accent))] transition-colors">
                    {params.lang === 'en' ? 'Community Driven' : params.lang === 'zh' ? '社区驱动' : params.lang === 'zh-tw' ? '社區驅動' : 'コミュニティ主導'}
                  </h4>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {params.lang === 'en'
                      ? 'Built by learners, for learners. Quality subtitles from real users.'
                      : params.lang === 'zh'
                        ? '学习者为学习者打造，来自真实用户的高质量字幕。'
                        : params.lang === 'zh-tw'
                          ? '學習者為學習者打造，來自真實用戶的高品質字幕。'
                          : '学習者が学習者のために。実際のユーザーによる高品質字幕。'}
                  </p>
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href={`/${params.lang}/yomiplay/community`}
                  className="btn-primary inline-flex gap-2 items-center px-8 py-3 rounded-xl font-bold"
                >
                  {params.lang === 'en' ? 'Explore Community' : params.lang === 'zh' ? '进入社区' : params.lang === 'zh-tw' ? '進入社區' : 'コミュニティを見る'}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* YomiPlay Resources Hub — YomiPlay only */}
      {product.slug === 'yomiplay' && (() => {
        const r = {
          en: {
            eyebrow: 'Resources',
            heading: 'Explore More',
            groups: [
              { title: 'Product', links: [ { href: 'pricing', label: 'Pricing' }, { href: 'download', label: 'Download' }, { href: 'changelog', label: 'Changelog' }, { href: 'roadmap', label: 'Roadmap' } ] },
              { title: 'Support', links: [ { href: 'help', label: 'Help Center' }, { href: 'contact', label: 'Contact' } ] },
              { title: 'Legal', links: [ { href: 'terms', label: 'Terms of Use' }, { href: 'privacy', label: 'Privacy Policy' }, { href: 'refund', label: 'Refund Policy' }, { href: 'legal', label: 'Legal Notice' } ] },
            ],
          },
          zh: {
            eyebrow: '资源',
            heading: '了解更多',
            groups: [
              { title: '产品', links: [ { href: 'pricing', label: '价格方案' }, { href: 'download', label: '下载' }, { href: 'changelog', label: '更新记录' }, { href: 'roadmap', label: '开发路线图' } ] },
              { title: '支持', links: [ { href: 'help', label: '帮助中心' }, { href: 'contact', label: '联系我们' } ] },
              { title: '法律条款', links: [ { href: 'terms', label: '使用条款' }, { href: 'privacy', label: '隐私政策' }, { href: 'refund', label: '退款政策' }, { href: 'legal', label: '特商法标示' } ] },
            ],
          },
          'zh-tw': {
            eyebrow: '資源',
            heading: '了解更多',
            groups: [
              { title: '產品', links: [ { href: 'pricing', label: '價格方案' }, { href: 'download', label: '下載' }, { href: 'changelog', label: '更新記錄' }, { href: 'roadmap', label: '開發路線圖' } ] },
              { title: '支援', links: [ { href: 'help', label: '幫助中心' }, { href: 'contact', label: '聯絡我們' } ] },
              { title: '法律條款', links: [ { href: 'terms', label: '使用條款' }, { href: 'privacy', label: '隱私政策' }, { href: 'refund', label: '退款政策' }, { href: 'legal', label: '特商法標示' } ] },
            ],
          },
          ja: {
            eyebrow: 'リソース',
            heading: 'もっと詳しく',
            groups: [
              { title: 'プロダクト', links: [ { href: 'pricing', label: '料金プラン' }, { href: 'download', label: 'ダウンロード' }, { href: 'changelog', label: '更新履歴' }, { href: 'roadmap', label: 'ロードマップ' } ] },
              { title: 'サポート', links: [ { href: 'help', label: 'ヘルプセンター' }, { href: 'contact', label: 'お問い合わせ' } ] },
              { title: '規約・法務', links: [ { href: 'terms', label: '利用規約' }, { href: 'privacy', label: 'プライバシーポリシー' }, { href: 'refund', label: '返金ポリシー' }, { href: 'legal', label: '特定商取引法表記' } ] },
            ],
          },
        }[params.lang];

        return (
          <section className="py-24 border-t border-[var(--border)]">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[rgb(var(--accent))]">{r.eyebrow}</h2>
                  <h3 className="text-4xl font-black tracking-tight">{r.heading}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {r.groups.map((g) => (
                    <div key={g.title} className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-[var(--muted-foreground)]">{g.title}</h4>
                      <ul className="space-y-2.5">
                        {g.links.map((l) => (
                          <li key={l.href}>
                            <Link
                              href={`/${params.lang}/yomiplay/${l.href}`}
                              className="group inline-flex items-center gap-1.5 font-bold hover:text-[rgb(var(--accent))] transition-colors"
                            >
                              {l.label}
                              <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Tech Breakdown */}
      <section className="py-24 border-t border-[var(--border)]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[rgb(var(--accent))]">
                {params.lang === 'en' ? 'Technical Stack' : (params.lang === 'zh' || params.lang === 'zh-tw') ? (params.lang === 'zh' ? '技术栈详情' : '技術棧詳情') : '技術スタック詳細'}
              </h2>
              <h3 className="text-4xl font-black tracking-tight">
                {params.lang === 'en' ? 'Powered by.' : (params.lang === 'zh' || params.lang === 'zh-tw') ? (params.lang === 'zh' ? '驱动产品的技术' : '驅動產品的技術') : 'プロダクトを支える技術'}
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.techStack.map((tech) => (
                <div key={tech} className="p-4 text-center rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                  <p className="font-mono text-xs font-bold uppercase">{tech}</p>
                </div>
              ))}
            </div>

            <div className="card p-12 text-center space-y-8 bg-black text-white dark:border-[var(--muted)]">
              <h4 className="text-2xl font-bold">
                {params.lang === 'en'
                  ? 'Interested in the implementation?'
                  : params.lang === 'zh'
                    ? '对此项目的实现感兴趣吗？'
                    : params.lang === 'zh-tw'
                      ? '對此項目的實現感興趣嗎？'
                      : 'この実装に興味がありますか？'}
              </h4>
              <p className="text-gray-400">
                {params.lang === 'en'
                  ? 'This project is part of the Toshiki Tech internal ecosystem.'
                  : params.lang === 'zh'
                    ? '该项目是 Toshiki Tech 内部生态系统的一部分。'
                    : params.lang === 'zh-tw'
                      ? '該項目是 Toshiki Tech 內部生態系統的一部分。'
                      : 'このプロジェクトは Toshiki Tech の内部エコシステムの一部です。'}
              </p>
              <Link href={`/${params.lang}/work-with-me`} className="btn-primary inline-flex gap-2 items-center">
                {dict.common.nav.workWithMe}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
