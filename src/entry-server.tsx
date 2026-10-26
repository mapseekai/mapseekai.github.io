import { renderToString } from 'react-dom/server';
import { StrictMode } from 'react';
import { App } from './App';
export { routes, metadata, projects, products, posts, normalizePath } from './content/site';

export function render(path: string) {
  return renderToString(<StrictMode><App path={path}/></StrictMode>);
}
