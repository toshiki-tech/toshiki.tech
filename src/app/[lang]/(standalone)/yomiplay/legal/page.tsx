import { Locale } from '@/lib/get-dictionary';
import { Metadata } from 'next';

const content = {
  en: {
    title: 'Legal Notice (Specified Commercial Transactions Act)',
    description: 'Legal notice for YomiPlay based on the Japanese Specified Commercial Transactions Act.',
    notice: 'This notice is based on Japanese law. The Japanese version prevails.',
    rows: [
      { label: 'Seller', value: 'YomiPlay' },
      { label: 'Operator', value: 'DU BIAOQI' },
      { label: 'Address', value: 'Disclosed without delay upon request.' },
      { label: 'Phone', value: 'Disclosed without delay upon request.' },
      { label: 'Email', value: 'toshiki.tech.jp@gmail.com' },
      { label: 'Price', value: 'The price shown on each plan page (Premium: ¥180/month, ¥1,480/year, or ¥2,980 one-time purchase).' },
      { label: 'Payment method', value: 'Credit card (Stripe).' },
      { label: 'Delivery time', value: 'Available for use immediately after payment is completed.' },
      { label: 'Refunds', value: 'Due to the nature of digital products, returns and refunds are not accepted in principle.' },
      { label: 'Cancellation', value: 'You may cancel at any time from the settings screen or the account management page.' },
    ],
  },
  zh: {
    title: '特定商业交易法相关标示',
    description: '基于日本《特定商业交易法》对 YomiPlay 的相关标示。',
    notice: '本标示依据日本法律制定。如有歧义，以日语版本为准。',
    rows: [
      { label: '销售事业者', value: 'YomiPlay' },
      { label: '运营负责人', value: 'DU BIAOQI' },
      { label: '所在地', value: '收到请求后将立即予以披露。' },
      { label: '电话号码', value: '收到请求后将立即予以披露。' },
      { label: '电子邮箱', value: 'toshiki.tech.jp@gmail.com' },
      { label: '销售价格', value: '各方案页面所标示的价格（Premium 月费 ¥180 / 年费 ¥1,480 / 买断 ¥2,980）。' },
      { label: '支付方式', value: '信用卡（Stripe）。' },
      { label: '商品提供时间', value: '付款完成后即可立即使用。' },
      { label: '退货・退款', value: '鉴于数字商品的性质，原则上不接受退货与退款。' },
      { label: '解约方式', value: '可随时通过设置画面或会员管理页面解除合约。' },
    ],
  },
  'zh-tw': {
    title: '特定商業交易法相關標示',
    description: '基於日本《特定商業交易法》對 YomiPlay 的相關標示。',
    notice: '本標示依據日本法律制定。如有歧義，以日語版本為準。',
    rows: [
      { label: '銷售事業者', value: 'YomiPlay' },
      { label: '營運負責人', value: 'DU BIAOQI' },
      { label: '所在地', value: '收到請求後將立即予以揭露。' },
      { label: '電話號碼', value: '收到請求後將立即予以揭露。' },
      { label: '電子郵箱', value: 'toshiki.tech.jp@gmail.com' },
      { label: '銷售價格', value: '各方案頁面所標示的價格（Premium 月費 ¥180 / 年費 ¥1,480 / 買斷 ¥2,980）。' },
      { label: '支付方式', value: '信用卡（Stripe）。' },
      { label: '商品提供時間', value: '付款完成後即可立即使用。' },
      { label: '退貨・退款', value: '鑑於數位商品的性質，原則上不接受退貨與退款。' },
      { label: '解約方式', value: '可隨時透過設定畫面或會員管理頁面解除合約。' },
    ],
  },
  ja: {
    title: '特定商取引法に基づく表記',
    description: '特定商取引法に基づく YomiPlay の表記です。',
    notice: '日本語表記が優先されます。',
    rows: [
      { label: '販売事業者', value: 'YomiPlay' },
      { label: '運営責任者', value: 'DU BIAOQI' },
      { label: '所在地', value: '請求があった場合、遅滞なく開示いたします。' },
      { label: '電話番号', value: '請求があった場合、遅滞なく開示いたします。' },
      { label: 'メールアドレス', value: 'toshiki.tech.jp@gmail.com' },
      { label: '販売価格', value: '各プランページに表示された価格（Premium 月額 ¥180 / 年額 ¥1,480 / 買い切り ¥2,980）' },
      { label: '支払方法', value: 'クレジットカード（Stripe）' },
      { label: '商品の提供時期', value: '決済完了後直ちにご利用いただけます。' },
      { label: '返品・返金', value: 'デジタル商品の性質上、原則として返品・返金はできません。' },
      { label: '解約方法', value: '設定画面または会員管理ページからいつでも解約できます。' },
    ],
  },
};

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }): Promise<Metadata> {
  const t = content[lang] || content.en;
  return {
    title: `${t.title} | Toshiki Tech`,
    description: t.description,
  };
}

export default function YomiPlayLegalPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = content[lang] || content.en;

  return (
    <div className="container-custom py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {t.title}
      </h1>
      <p className="text-sm text-[var(--muted-foreground)] mb-8">
        {t.notice}
      </p>

      <div className="overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {t.rows.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-[var(--border)] last:border-b-0 align-top"
              >
                <th
                  scope="row"
                  className="w-1/3 bg-[var(--muted)] px-4 py-3 text-left font-semibold text-[var(--foreground-rgb)] border-r border-[var(--border)]"
                >
                  {row.label}
                </th>
                <td className="px-4 py-3 text-[var(--muted-foreground)] leading-relaxed">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
