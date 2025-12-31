import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../../../backend/src/db/db';
import * as schema from '../../../backend/src/db/schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
});
