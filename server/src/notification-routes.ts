import { FastifyInstance } from 'fastify';
import WebPush from 'web-push';
import { z } from 'zod';

const publicKey = 'BI_IgB8KTAKyA_CqBBnq0sLKDq6fkmDO5S6MYbVc1PV7UzfWKPqsaloXvJvq_Nw2kvOsfO_68QN5dsq5zlVMU4M';
const privateKey = 'T094D19Y9BylxcpAbwRRJx6gh-Wjx50yJYkH-Pw6v1g';

WebPush.setVapidDetails('http://localhost:3000', publicKey, privateKey);

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public_key', () => {
    return {
      publicKey
    };
  });

  app.post('/push/register', (request, reply) => {
    console.log(request.body);

    return reply.status(201).send();
  });

  app.post('/push/send', async (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      })
    });

    const { subscription } = sendPushBody.parse(request.body);

    WebPush.sendNotification(subscription, 'Teste');

    return reply.status(201).send();
  });
}