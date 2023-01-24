import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';

const app = Fastify();
const prisma = new PrismaClient();

app.register(cors);

app.get('/', (req, res) => {
  return {};
});

app.listen({
  port: 3000
});