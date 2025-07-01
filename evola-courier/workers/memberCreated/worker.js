import { Worker } from 'bullmq';
import connection from '../../shared/redis.js';

new Worker('memberCreated', async job => {
  console.log(`[memberCreated] Member ${job.data.character_id} created.`);
  // simulate API call or webhook
}, { connection });