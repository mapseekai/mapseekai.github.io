import { Github } from '../components/Brand';
import { useState } from 'react';
import { ArrowUpRight, Code2 } from 'lucide-react';
import { githubOrg, projects } from '../content/site';
import { Endcap, ExternalLink } from '../components/Layout';

export function EcosystemPage() {
  const [filter, setFilter] = useState('全部项目');
  const shown = projects.filter((project) => filter === '全部项目' || (filter === '开源代码' ? project.external : !project.external));
  return <><section className="container page-intro"><h1>产品之下，<span>开放生长。</span></h1><p>引擎、运行时、设计规范和小工具。<br/>让基础能力持续打磨，让思考与代码被更多人使用。</p><ExternalLink className="text-link" href={githubOrg}><Github size={17}/>访问 GitHub 组织<ArrowUpRight size={15}/></ExternalLink></section><section className="container project-directory" aria-label="技术生态项目"><div className="directory-toolbar"><div className="filter-buttons" role="group" aria-label="项目类型">{['全部项目', '开源代码', '技术笔记'].map((item) => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><span className="mono results-summary" role="status">{shown.length} 个项目</span></div><div className="project-directory-grid">{shown.map((project) => <article key={project.name} className="directory-card"><div className="directory-card-header"><Code2 size={22}/><span>{project.external ? '开源代码' : '技术笔记'}</span></div><h2>{project.name}</h2><div className="directory-kind">{project.kind}</div><p>{project.description}</p><div className="directory-card-bottom"><span className="mono">{project.language}</span>{project.external ? <ExternalLink href={project.href}>GitHub<ArrowUpRight size={15}/></ExternalLink> : <a href={project.href}>阅读技术笔记<ArrowUpRight size={15}/></a>}</div></article>)}</div><p className="directory-note">开源代码链接指向公开仓库；技术笔记记录引擎方向与设计思考。</p></section><Endcap/></>;
}
