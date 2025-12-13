import mongoose from 'mongoose';  // Import Mongoose for MongoDB connection
import { Default } from './default';
import config from './config';
import { prisma } from './prisma';


/**
 * @class DatabaseConfiguration
 * @description Connects the application to both MongoDB (via Mongoose) and 
 * PostgreSQL (via PrismaClient), following the payroo_backend connection pattern.
*/
export class DatabaseConfiguration extends Default {
    constructor() {
        super();
    }

    /**
     * @method connect 
     * @description Connects to both the MongoDB and PostgreSQL databases.
     * @param config - An object containing the MongoDB URL and the initialized PrismaClient.
    */
    async connect(config: { SERVER: { MONGO_DATABASE_URL: string } }): Promise<void> {
        let isMongoConnected = false;
        let isPostgresConnected = false;

        // --- 1. MongoDB Connection (Mongoose) ---
        try {
            await mongoose.connect(config.SERVER.MONGO_DATABASE_URL);
            this.logger.info('********************************************');
            this.logger.info('MONGOOSE DATABASE (MongoDB) connected sucessfully');
            this.logger.info('********************************************');
            isMongoConnected = true;
        }
        catch (error) {
            this.logger.error('MongoDB connection error', error);
        }

        // --- 2. PostgreSQL Connection (Prisma Client) ---
        try {
            await prisma.$connect();
            this.logger.info('********************************************');
            this.logger.info('PRISMA CLIENT (PostgreSQL) connected sucessfully');
            this.logger.info('********************************************');
            isPostgresConnected = true;
        } catch (error) {
            this.logger.error('Prisma (PostgreSQL) connection error', error);
        }

        // Throw a fatal error if neither database connected successfully
        if (!isMongoConnected && !isPostgresConnected) {
            throw new Error('FATAL: Failed to connect to both MongoDB and PostgreSQL.');
        }
    }
}

export default new DatabaseConfiguration();