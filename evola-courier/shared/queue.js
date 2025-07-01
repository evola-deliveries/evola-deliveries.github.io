import { Queue } from 'bullmq';
import connection from './redis.js';


// Define queues for contract processing
// These queues will handle different stages of contract processing
export const fetchContracts = new Queue('fetchContracts', { connection });

// This queue will be used to process contracts that need to be fetched
// It will handle the creation, updates of contracts and raise events for further processing.
export const processContract = new Queue('processContract', { connection });

// Define queues for contract events
// These queues will be used to handle different contract-related events
// such as creation, updates, and completion.
export const contractCreated = new Queue('contractCreated', { connection });
export const contractUpdated = new Queue('contractUpdated', { connection });

// This queue will handle the completion of contracts
// It will be used to notify when a contract has been completed.
// This happens when a contract status changes to 'finished'.
export const contractCompleted = new Queue('contractCompleted', { connection });


export const memberCreated = new Queue('memberCreated', { connection });
export const corporationCreated = new Queue('corporationCreated', { connection });
