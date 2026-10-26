import { githubOrg, products } from './site';

export type NavigationLink = { label: string; href: string; description?: string; external?: boolean };
export type NavigationGroup = { title: string; items: NavigationLink[] };
export const productLinks: NavigationLink[] = products.map(product => ({
  label: `Mapseek ${product.id[0].toUpperCase() + product.id.slice(1)}`,
  href: `/products/${product.id}/`, description: product.label,
}));
export const resourceGroups: NavigationGroup[] = [
  { title: '资源', items: [
    { label: '资源中心', href: '/resources/', description: '产品笔记、工程实践与开放项目' },
    { label: '开放生态', href: '/open-source/' },
    { label: '博客文章', href: '/blog/' },
    { label: '地图设计', href: '/blog/design-language/' },
  ] },
  { title: '产品笔记', items: [
    { label: 'Cloud 数据工作空间', href: '/blog/cloud-workspace/' },
    { label: 'Loom 空间编辑', href: '/blog/loom-editing/' },
    { label: 'Design 地图表达', href: '/blog/design-language/' },
  ] },
  { title: '社区', items: [
    { label: 'GitHub', href: githubOrg, external: true },
    { label: '官网源码', href: `${githubOrg}/mapseekai.github.io`, external: true },
    { label: '问题反馈', href: `${githubOrg}/mapseekai.github.io/issues`, external: true },
  ] },
];
export const footerGroups: NavigationGroup[] = [
  { title: '产品', items: [
    { label: '全部产品', href: '/#products' },
    { label: '价格', href: '/pricing/' },
    { label: '产品界面', href: '/#screens' },
  ] },
  { title: 'MAPSEEK', items: productLinks },
  { title: '资源', items: resourceGroups[0].items },
  { title: '社区', items: resourceGroups[2].items },
];
