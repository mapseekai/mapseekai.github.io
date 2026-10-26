import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, Search, X } from 'lucide-react';
import { posts, products, type Post } from '../content/site';
import { PostCard } from './Home';
import { EditorialArt } from '../components/Art';
import { Endcap, ExternalLink } from '../components/Layout';

const categories = ['全部文章', '产品笔记', '工程手记', '设计思考'] as const;

export function JournalPage() {
  const [category, setCategory] = useState<string>('全部文章');
  const [query, setQuery] = useState('');
  const filtered = posts.filter((post) => (category === '全部文章' || post.category === category) && `${post.title} ${post.summary} ${post.sections.flatMap((section) => section.paragraphs).join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <><section className="container page-intro"><h1>沿途的思考，<span>与发现。</span></h1><p>产品的想法，设计的判断，代码背后的工程实践。<br/>关于我们如何构建，也关于我们正在探索什么。</p></section><section className="container journal-list" aria-label="博客文章"><div className="journal-toolbar"><div className="filter-buttons" role="group" aria-label="文章分类">{categories.map((item) => <button type="button" aria-pressed={category === item} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search-field"><Search size={16}/><span className="sr-only">搜索文章</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文章…"/>{query && <button type="button" aria-label="清空搜索" onClick={() => setQuery('')}><X size={14}/></button>}</label></div><div className="results-summary mono" role="status">{filtered.length} 篇文章</div>{filtered.length ? <div className="post-grid">{filtered.map((post) => <PostCard post={post} key={post.slug}/>)}</div> : <div className="empty-state"><Search size={30}/><h2>还没有找到相关文章。</h2><p>试试“地图”“栅格”或“Worker”。</p><button type="button" className="button button-outline" onClick={() => { setQuery(''); setCategory('全部文章'); }}>重置筛选</button></div>}</section><Endcap/></>;
}

export function ArticlePage({ post }: { post: Post }) {
  const related = products.find((item) => item.id === post.relatedProduct);
  return <><article className="article-page container"><a className="back-link" href="/blog/"><ArrowLeft size={14}/>全部文章</a><header className="article-header"><h1>{post.title}</h1><p>{post.summary}</p><div className="article-byline"><span className="author-mark">M</span><span>MapseekAI 编辑手记</span><span>{post.readTime}阅读</span></div></header><EditorialArt type={post.visual}/><div className="article-layout"><aside className="article-toc" aria-label="文章目录"><span className="mono">文章目录</span>{post.sections.map((section, index) => <a href={`#section-${index+1}`} key={section.heading}>{section.heading}</a>)}</aside><div className="article-body">{post.sections.map((section, index) => <section id={`section-${index+1}`} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}{post.links && <div className="article-links"><h2>继续探索</h2>{post.links.map((link) => <ExternalLink href={link.href} key={link.href}>{link.label}<ArrowUpRight size={15}/></ExternalLink>)}</div>}{related && <a className="article-product" href={`/products/${related.id}/`}><span>认识 {related.label}<strong>{related.name}</strong></span><ArrowUpRight size={24}/></a>}<div className="article-end mono">MapseekAI 编辑手记</div></div></div></article><section className="container section"><div className="section-heading"><h2>继续阅读</h2><a className="text-link" href="/blog/">所有文章<ArrowUpRight size={15}/></a></div><div className="post-grid">{posts.filter((item) => item.slug !== post.slug).slice(0,3).map((item) => <PostCard key={item.slug} post={item}/>)}</div></section></>;
}
