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
  };
  techStack: string[];
  imageUrl?: string;
}

export const works: Work[] = [
  {
    id: "corp-redesign",
    translations: {
      en: {
        title: "Corporate Website Redesign",
        description: "Built a high-performance, SEO-optimized landing page for a Japanese tech consultancy using Next.js and Tailwind."
      },
      zh: {
        title: "企业官网重构",
        description: "使用 Next.js 和 Tailwind 为一家日本技术咨询公司构建了高性能、SEO 优化的落地页。"
      },
      ja: {
        title: "コーポレートサイトのリニューアル",
        description: "Next.jsとTailwindを使用し、日本の技術コンサルティング会社向けに高性能でSEO最適化されたランディングページを構築。"
      }
    },
    techStack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    imageUrl: "/images/works/corp-redesign.png",
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
      }
    },
    techStack: ["TypeScript", "PostgreSQL", "Next.js"],
    imageUrl: "/images/works/inventory-dash.png",
  }
];
