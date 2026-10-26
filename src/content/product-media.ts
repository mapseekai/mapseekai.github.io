import type { ProductId } from './site';

export type ProductMedia = {
  /** Public path, e.g. /screenshots/cloud-overview.webp. Null intentionally shows a labelled slot. */
  src: string | null;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

/** The homepage and product pages share these three slots. Never insert a generated interface as product evidence. */
export const productMedia: Record<ProductId, ProductMedia> = {
  cloud: {
    src: null,
    alt: 'Mapseek Cloud 的真实产品界面：数据目录与地图预览',
    caption: '数据目录与地图预览',
    width: 1600,
    height: 1000,
  },
  loom: {
    src: null,
    alt: 'Mapseek Loom 的真实产品界面：几何编辑与属性面板',
    caption: '几何编辑与属性面板',
    width: 1600,
    height: 1000,
  },
  design: {
    src: null,
    alt: 'Mapseek Design 的真实产品界面：地图样式与 AI 设计工作台',
    caption: '地图样式与 AI 设计工作台',
    width: 1600,
    height: 1000,
  },
};
