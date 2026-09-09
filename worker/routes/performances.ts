import type { D1Database } from '@cloudflare/workers-types';
import { getAllPerformances, getPerformanceById } from '../db/performances';

export async function handleGetPerformances(
  request: Request,
  env: { DB: D1Database; CHILD_BIRTH_DATE: string }
): Promise<Response> {
  try {
    const performances = await getAllPerformances(env.DB, env.CHILD_BIRTH_DATE);
    return new Response(JSON.stringify({ performances }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching performances:', error);
    return new Response(JSON.stringify({ error: 'Unable to fetch performances' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handleGetPerformance(
  request: Request,
  env: { DB: D1Database; CHILD_BIRTH_DATE: string },
  id: string
): Promise<Response> {
  try {
    const performanceId = parseInt(id, 10);
    if (isNaN(performanceId)) {
      return new Response(JSON.stringify({ error: 'Invalid performance ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const performance = await getPerformanceById(env.DB, performanceId, env.CHILD_BIRTH_DATE);
    if (!performance) {
      return new Response(JSON.stringify({ error: 'Performance not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(performance), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching performance:', error);
    return new Response(JSON.stringify({ error: 'Unable to fetch performance' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}