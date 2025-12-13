// import 'dotenv/config';
// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import { readFileSync } from 'fs';
// import path from 'path';
// import swaggerUi from 'swagger-ui-express';
// import yaml from 'yaml';
// import { ApolloServer } from 'apollo-server-express';
// import { PrismaClient } from '@prisma/client';
// import { MongoClient } from 'mongodb';

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Health
// app.get('/api/healthz', (_req: Request, res: Response) => res.json({ ok: true }));

// // Swagger
// const openapiPath = path.join(process.cwd(), 'openapi.yaml');
// const openapiDoc = yaml.parse(readFileSync(openapiPath, 'utf8'));
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

// // Prisma
// const prisma = new PrismaClient();

// // Mongo
// const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
// const mongoDbName = process.env.MONGO_DB || 'turbineops';
// let mongoClient: MongoClient | null = null;
// (async () => {
//   try {
//     mongoClient = new MongoClient(mongoUrl);
//     await mongoClient.connect();
//     console.log('Mongo connected');
//   } catch (e) {
//     console.warn('Mongo unavailable yet:', (e as Error).message);
//   }
// })();

// // Simple REST stubs
// app.get('/api/turbines', async (_req: Request, res: Response) => {
//   const data = await prisma.turbine.findMany({ take: 50 });
//   res.json(data);
// });

// app.post('/api/turbines', async (req: Request, res: Response) => {
//   const { name, manufacturer, mwRating, lat, lng } = req.body || {};
//   if (!name) return res.status(400).json({ error: 'name required' });
//   const t = await prisma.turbine.create({ data: { name, manufacturer, mwRating, lat, lng } });
//   res.status(201).json(t);
// });

// // SSE for plan notifications
// const sseClients = new Set<Response>();
// app.get('/api/events', (req: Request, res: Response) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders();
//   res.write(`event: ping
// data: ok

// `);
//   sseClients.add(res);
//   req.on('close', () => sseClients.delete(res));
// });

// function notifyPlan(inspectionId: string) {
//   for (const client of sseClients) {
//     client.write(`event: plan
// data: ${JSON.stringify({ inspectionId, at: new Date().toISOString() })}

// `);
//   }
// }

// // GraphQL
// type Finding = {
//   category: string;
//   notes?: string | null;
//   severity: number;
//   estimatedCost?: number;
// };

// type Inspection = {
//   id: string;
//   findings: Finding[];
// };

// const typeDefs = readFileSync(path.join(process.cwd(), 'src/graphql/schema.graphql'), 'utf8');
// const resolvers = {
//   Query: {
//     inspection: async (_: any, { id }: { id: string }) => prisma.inspection.findUnique({
//       where: { id },
//       include: { turbine: true, findings: true, repairPlan: true },
//     }),
//     repairPlan: async (_: any, { inspectionId }: { inspectionId: string }) => prisma.repairPlan.findUnique({ where: { inspectionId } }),
//   },
//   Mutation: {
//     generateRepairPlan: async (_: any, { inspectionId }: { inspectionId: string }) => {
//       const inspection = await prisma.inspection.findUnique({ where: { id: inspectionId }, include: { findings: true } });
//       if (!inspection) throw new Error('Inspection not found');

//       // Severity rule: if category=BLADE_DAMAGE and notes contain "crack", min severity=4
//       const adjusted = inspection.findings.map((f: Finding) => {
//         const hasCrack = (f.notes || '').toLowerCase().includes('crack');
//         const severity = (f.category === 'BLADE_DAMAGE' && hasCrack) ? Math.max(4, f.severity) : f.severity;
//         return { ...f, severity };
//       });

//       const total = adjusted.reduce((s: number, f: Finding) => s + Number(f.estimatedCost || 0), 0);
//       const maxSeverity = Math.max(0, ...adjusted.map((f: Finding) => f.severity));
//       const priority = maxSeverity >= 5 ? 'HIGH' : (maxSeverity >= 3 ? 'MEDIUM' : 'LOW');

//       const plan = await prisma.repairPlan.upsert({
//         where: { inspectionId },
//         update: { priority: priority as any, totalEstimatedCost: total, snapshotJson: adjusted },
//         create: { inspectionId, priority: priority as any, totalEstimatedCost: total, snapshotJson: adjusted },
//       });

//       notifyPlan(inspectionId);

//       // mongo log (best-effort)
//       try {
//         if (mongoClient) {
//           const db = mongoClient.db(mongoDbName);
//           await db.collection('ingestion_logs').insertOne({
//             kind: 'PLAN_GENERATED',
//             inspectionId,
//             at: new Date(),
//             total,
//             priority,
//           });
//         }
//       } catch {}

//       return plan;
//     },
//   },
// };

// const server = new ApolloServer({ typeDefs, resolvers });
// (async () => {
//   await server.start();
//   server.applyMiddleware({ app: app as express.Application, path: '/graphql' });

//   const port = Number(process.env.PORT || 4000);
//   app.listen(port, () => console.log(`Backend on http://localhost:${port}`));
// })();


/////////////////////////////////


import express, { Request, Response, NextFunction } from 'express';
import bodyparser from 'body-parser'; // the body-parser middleware is used to parse incoming request bodies , so that the data sent by client (JSON or URl Encoded params) can be easily accessed
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import http from 'http';

import helmet from 'helmet';

import config from '../src/config/config';
import routes from './routes';
import databaseConfiguration from '../src/config/databaseConfiguration';

// Create the express app instance
const app = express();
app.use(morgan('dev'));

// Parse incoming req bodies as URl-Encoded data and JSON size limitsCORS_ORIGINS
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ limit: '10mb' }));

// Configure CORS options with dynamic validation based on config
interface CorsOptionsDelegate extends CorsOptions {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
}

const corsOptionsDelegate: CorsOptionsDelegate = {
  origin: (origin, callback) => {
    // Allow all origins if config allows '*'
    if (config.SERVER.CORS_ORIGINS[0] === '*') {
      callback(null, true);
    }
    else if (!origin || config.SERVER.CORS_ORIGINS.includes(origin)) {
      // Allow if origin is undefined (eg : server to server) or is in whitelist
      callback(null, true);
    }
    else {
      // Block other origins with error
      callback(new Error('BLOCKED BY CORS RULE'));
    }
  },
};
app.use(cors({
  ...corsOptionsDelegate,
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE', // Added 'methods' here
}));

// Use Helmet to set various HTTP headers for app security
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
        }
    }
}));

// routes handlinig
app.use('/api', routes);

// ------------------ Apollo Server Setup ------------------ //

// create http server warapping the express app.
const server = http.createServer(app);
server.listen(config.SERVER.PORT, async () => {
    console.info('******************************************************************');
    console.info(`**** SERVER RUNNING ON PORT ${config.SERVER.PORT} ****************`);
    console.info('******************************************************************');
    await databaseConfiguration.connect(config);
});

export default app;