import 'dotenv/config';

import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, tool, UIMessage } from 'ai';
import Fastify from 'fastify';
import { z } from 'zod';

import { auth } from '../../frontend/src/lib/auth';
import { db } from './db/db';

const app = Fastify({ logger: true });

/**
 * Tests the API connection
 */
app.get('/api', async (request, reply) => {
	return { hello: 'world' };
});

/**
 * Tests the database connection
 */
app.get('/api/db', async (request, reply) => {
	return await db.run('SELECT 42');
});

app.post('/api/chat', async (request, reply) => {
	const { messages } = request.body as { messages: UIMessage[] };

	const result = streamText({
		model: openai.chat('gpt-4o'),
		messages: await convertToModelMessages(messages),
		tools: {
			getWeather: tool({
				description: 'Get the current weather for a specified city. Use this when the user asks about weather.',
				inputSchema: z.object({
					city: z.string().describe('The city to get the weather for'),
				}),
			}),
		},
	});

	const response = result.toUIMessageStreamResponse();
	return response;
});

app.route({
	method: ['GET', 'POST'],
	url: '/api/auth/*',
	async handler(request, reply) {
		try {
			// Construct request URL
			const url = new URL(request.url, `http://${request.headers.host}`);

			// Convert Fastify headers to standard Headers object
			const headers = new Headers();
			Object.entries(request.headers).forEach(([key, value]) => {
				if (value) headers.append(key, value.toString());
			});
			// Create Fetch API-compatible request
			const req = new Request(url.toString(), {
				method: request.method,
				headers,
				body: request.body ? JSON.stringify(request.body) : undefined,
			});
			// Process authentication request
			const response = await auth.handler(req);
			// Forward response to client
			reply.status(response.status);
			response.headers.forEach((value, key) => reply.header(key, value));
			reply.send(response.body ? await response.text() : null);
		} catch (error) {
			app.log.error(error, 'Authentication Error');
			reply.status(500).send({
				error: 'Internal authentication error',
				code: 'AUTH_FAILURE',
			});
		}
	},
});

export default app;
