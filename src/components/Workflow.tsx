import { useId, useRef, useState } from 'react';
import { Database, Layers, Palette } from 'lucide-react';

const stages = [
  { id: 'cloud', name: '整理数据', product: 'Cloud', icon: Database, input: ['矢量与栅格', '属性与元信息', '项目资源'], output: ['数据集目录', '地图预览', '服务发布'], text: '让分散的空间资源有清晰的位置，也有可继续使用的入口。' },
  { id: 'loom', name: '编辑要素', product: 'Loom', icon: Layers, input: ['图层与要素', '几何与属性', '编辑意图'], output: ['几何调整', '属性修改', '独立数据成果'], text: '让选择、检查与修改围绕同一个对象展开，把注意力留在地图上。' },
  { id: 'design', name: '设计地图', product: 'Design', icon: Palette, input: ['地图样式', '色彩与层次', '设计规则'], output: ['样式预览', 'AI 辅助迭代', '地图表达'], text: '把设计意图写成规则，在地图预览里逐步形成自己的视觉语言。' },
];

export function Workflow() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const step = stages[active];
  return <section className="workflow-section" id="workflow">
    <div className="container workflow-shell" data-reveal>
      <div className="workflow-intro"><h2>从数据，到表达。<br />每一步都清楚。</h2><div><p>管理、编辑与设计各自专注。<br />选择一个环节，看看工作如何展开。</p><a className="text-link" href="/blog/cloud-workspace/">了解我们的产品思路</a></div></div>
      <div className="workflow-tablist" role="tablist" aria-label="空间工作环节">{stages.map((stage, index) => <button type="button" key={stage.id} id={`${id}-${stage.id}`} role="tab" aria-selected={active === index} aria-controls={`${id}-panel`} tabIndex={active === index ? 0 : -1} ref={(node) => { refs.current[index] = node; }} onClick={() => setActive(index)} onKeyDown={(event) => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3; setActive(next); refs.current[next]?.focus(); }}><stage.icon size={20} aria-hidden="true" /><span>{stage.name}</span><small>{stage.product}</small></button>)}</div>
      <div className="workflow-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${step.id}`}>
        <div className="flow-mapping" key={step.id}>
          <div className="mapping-side"><span className="mapping-label">从这里开始</span>{step.input.map((label) => <div key={label}>{label}</div>)}</div>
          <svg className="flow-connectors" viewBox="0 0 320 192" preserveAspectRatio="none" role="img" aria-label="输入与输出的关系示意"><path pathLength="1" d="M0 32H110Q128 32 128 48V64Q128 80 144 80H320M0 96H320M0 160H110Q128 160 128 144V128Q128 112 144 112H320" fill="none" stroke="currentColor" /><circle cx="160" cy="96" r="4" fill="currentColor" /></svg>
          <div className="mapping-side mapping-output"><span className="mapping-label">形成这些成果</span>{step.output.map((label) => <div key={label}>{label}</div>)}</div>
        </div>
        <div className="workflow-caption"><p>{step.text}</p><a href={`/products/${step.id}/`}>认识 {step.product}</a></div>
      </div>
    </div>
  </section>;
}
