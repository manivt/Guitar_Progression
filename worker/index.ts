import { handleGetPerformances, handleGetPerformance } from './routes/performances';
import { handleCreatePerformance, handleUpdatePerformance, handleDeletePerformance } from './routes/adminPerformances';

export interface Env {
  DB: D1Database;
  CHILD_BIRTH_DATE: string;
  CHILD_DISPLAY_NAME: string;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith('/api/admin/performances')) {
      const adminPath = path.replace('/api/admin/performances', '');
      
      if (request.method === 'POST' && adminPath === '') {
        return handleCreatePerformance(request, env);
      }
      
      const idMatch = adminPath.match(/^\/(\d+)$/);
      if (idMatch) {
        const id = idMatch[1];
        if (request.method === 'PUT') {
          return handleUpdatePerformance(request, env, id);
        }
        if (request.method === 'DELETE') {
          return handleDeletePerformance(request, env, id);
        }
      }
    }

    if (path === '/api/performances') {
      if (request.method === 'GET') {
        return handleGetPerformances(request, env);
      }
    }

    const performanceMatch = path.match(/^\/api\/performances\/(\d+)$/);
    if (performanceMatch) {
      if (request.method === 'GET') {
        return handleGetPerformance(request, env, performanceMatch[1]);
      }
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;