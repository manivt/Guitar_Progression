import type { D1Database } from '@cloudflare/workers-types';
import { createPerformance, updatePerformance, deletePerformance } from '../db/performances.js';
import { validatePerformanceInput } from '../validation/performance.js';

export async function handleCreatePerformance(
  request: Request,
  env: { DB: D1Database; CHILD_BIRTH_DATE: string }
): Promise<Response> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validation = validatePerformanceInput(body);

    if (!validation.valid || !validation.data) {
      return new Response(JSON.stringify({ error: validation.errors[0]?.message || 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const performance = await createPerformance(env.DB, validation.data, env.CHILD_BIRTH_DATE);

    return new Response(JSON.stringify(performance), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating performance:', error);
    return new Response(JSON.stringify({ error: 'Unable to create performance' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handleUpdatePerformance(
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

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validation = validatePerformanceInput(body);

    if (!validation.valid || !validation.data) {
      return new Response(JSON.stringify({ error: validation.errors[0]?.message || 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const performance = await updatePerformance(env.DB, performanceId, validation.data, env.CHILD_BIRTH_DATE);

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
    console.error('Error updating performance:', error);
    return new Response(JSON.stringify({ error: 'Unable to update performance' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handleDeletePerformance(
  _request: Request,
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

    const deleted = await deletePerformance(env.DB, performanceId);

    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Performance not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting performance:', error);
    return new Response(JSON.stringify({ error: 'Unable to delete performance' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}