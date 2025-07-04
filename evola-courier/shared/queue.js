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

// This queue will handle the member and corporation changes.
// It will handle the creation, updates of members and corporations and raise events for further processing if requited.
export const updateMember = new Queue('updateMember', { connection });
export const updateCorporation = new Queue('updateCorporation', { connection });

// This queue will handle the eve mailing for the contracts that are marked as completed.
// It will check if it sent already and if not it will send it.
export const sendEveMail = new Queue('sendEveMail', { connection });
