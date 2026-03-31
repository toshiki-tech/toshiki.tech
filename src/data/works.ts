export interface Work {
  id: string;
  translations: {
    en: {
      title: string;
      description: string;
    };
    zh: {
      title: string;
      description: string;
    };
    ja: {
      title: string;
      description: string;
    };
    'zh-tw': {
      title: string;
      description: string;
    };
  };
  techStack: string[];
  imageUrl?: string;
  url?: string;
}

export const works: Work[] = [
  {
    id: "corp-redesign",
    translations: {
      en: {
        title: "Educational Institution Portal",
        description: "Built with Next.js and Tailwind, this high-performance website for a Japanese educational institution integrates consulting, marketing, and registration conversion, optimizing both SEO and UX."
      },
      zh: {
        title: "教育培训机构官网",
        description: "基于 Next.js 与 Tailwind 构建，为日本教育培训机构打造了一体化咨询、推广与报名转化的高性能网站，兼顾 SEO 优化与用户体验，有效提升品牌曝光与转化效率。"
      },
      ja: {
        title: "教育研修機関向けポータルサイト",
        description: "Next.jsとTailwindをベースに、日本の教育研修機関向けにコンサルティング、マーケティング、申し込みコンバージョンを一体化した高性能サイトを構築。SEOとUXを両立。"
      },
      'zh-tw': {
        title: "教育培訓機構官網",
        description: "基於 Next.js 與 Tailwind 構建，為日本教育培訓機構打造了一體化諮詢、推廣與報名轉化的高性能網站，兼顧 SEO 優化與用戶體驗，有效提升品牌曝光與轉化效率。"
      }
    },
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    imageUrl: "/images/works/corp-redesign.png",
    url: "https://dcxy.jp"
  },
  {
    id: "ai-crm",
    translations: {
      en: {
        title: "AI CRM Integration",
        description: "Designed and implemented an automated lead scoring system for a sales team, integrating with OpenAI API."
      },
      zh: {
        title: "AI CRM 深度集成",
        description: "为销售团队设计并实现了一套自动线索评分系统，深度集成了 OpenAI API。"
      },
      ja: {
        title: "AI CRM 統合",
        description: "OpenAI APIと連携し、セールスチーム向けの自動リードスコアリングシステムを設計・実装。"
      },
      'zh-tw': {
        title: "AI CRM 深度集成",
        description: "為銷售團隊設計並實現了一套自動線索評分系統，深度集成了 OpenAI API。"
      }
    },
    techStack: ["Python", "FastAPI", "OpenAI", "React"],
    imageUrl: "/images/works/ai-crm.png",
  },
  {
    id: "inventory-dash",
    translations: {
      en: {
        title: "Product Inventory Dashboard",
        description: "A real-time inventory tracking system for a local retail chain, focusing on speed and intuitive UX."
      },
      zh: {
        title: "产品库存实时仪表盘",
        description: "为当地零售连锁店打造的实时库存追踪系统，专注于响应速度和直观的用户体验。"
      },
      ja: {
        title: "在庫管理ダッシュボード",
        description: "ローカル小売チェーン向けのリアルタイム在庫追跡システム。スピードと直感的なUXに重点を置いています。"
      },
      'zh-tw': {
        title: "產品庫存實時儀表盤",
        description: "為當地零售連鎖店打造的實時庫存追蹤系統，專注於響應速度和直觀的用户體驗。"
      }
    },
    techStack: ["TypeScript", "PostgreSQL", "Next.js"],
    imageUrl: "/images/works/inventory-dash.png",
  }
];
