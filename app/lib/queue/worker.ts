import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION, Session } from '@shopify/shopify-api';
import { restResources } from '@shopify/shopify-api/rest/admin/2025-04';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import prisma from 'app/db.server';
import { jobHandlers } from './job-handlers';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  family: 0,
});

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: process.env.SCOPES?.split(',') || [],
  hostName: process.env.SHOPIFY_APP_URL?.replace(/https?:\/\//, '') || '',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  restResources,
  sessionStorage: new PrismaSessionStorage(prisma),
});

const worker = new Worker(
  'shopify',
  async (job) => {
    console.log('Processing job:', job.name, job.data);
    const { shop } = job.data;

    if (shop) {
      // retrieve the store's session, which contains its shopify access token
      const dbSession = await prisma.session.findFirst({
        where: { shop },
      });

      if (!dbSession || !dbSession.accessToken) {
        throw new Error(`No session or access token found in database for shop: ${shop}`);
      }

      // create a shopify admin api graphql client
      const graphql = new shopify.clients.Graphql({
        session: new Session({
          id: dbSession.id,
          shop,
          state: dbSession.state,
          isOnline: false,
          accessToken: dbSession.accessToken,
        }),
      });

      if (!graphql) {
        throw new Error(`Failed to initialize graphql client for shop: ${shop}`);
      }

      // get the handler for this job name from the registry
      const handler = jobHandlers[job.name];

      if (!handler) {
        console.warn(`No handler found for job type: ${job.name}`);
        return;
      }

      await handler({ job, graphql });
    }
  },
  { connection },
);

export default worker;
