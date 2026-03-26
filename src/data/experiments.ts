export interface Experiment {
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
  status: "research" | "prototype" | "shipped";
}

export const experiments: Experiment[] = [];
