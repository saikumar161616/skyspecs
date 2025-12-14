import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Default } from '../config/default';
import config from './config';

let io: Server | undefined;

interface NotificationPayload {
    [key: string]: any;
}

class SocketMessage extends Default {
    constructor() {
        super();
    }

    /**
     * Create a socket connection and register server to it
     * @param server
     */
    async connect(server: HttpServer): Promise<boolean | void> {
        try {
            this.logger.info('Inside SocketMessage: connect method');

            io = new Server(server, {
                cors: {
                    origin: [config.SERVER.CLIENT_URL || 'http://localhost:5173'],
                    methods: ['GET', 'POST', 'PUT'],
                    credentials: true,
                },
                transports: ['websocket', 'polling'],
            });

            io.on('connection', (socket: Socket) => {
                this.logger.info(
                    'Inside SocketMessage: connect method: connected to Socket successfully',
                    socket.id
                );

                const userId = socket.handshake.query.id as string;
                if (userId) {
                    socket.join(userId);
                }

                // Register receive message event
                this.registerMessageListener(socket);

                // Disconnect handler
                socket.on('disconnect', () => {
                    this.logger.info(`Socket disconnected: ${socket.id}`);
                });
            });
        } catch (error) {
            this.logger.error(
                'Inside SocketMessage: connect method: Error while connecting to socket.io',
                error
            );
            return false;
        }
    }

    /**
     * Send socket message
     * @param messagePayload
     */
    async sendMessage(
        messagePayload: NotificationPayload
    ): Promise<{ status: boolean; message?: string }> {
        try {
            this.logger.info('Inside SocketMessage: sendMessage method');

            if (!io) {
                throw new Error('Socket.io not initialized');
            }

            io.emit('notification', messagePayload);

            return {
                status: true,
                message: 'Socket notification sent successfully.',
            };
        } catch (error) {
            this.logger.error(
                'Inside SocketMessage: sendMessage method: Error while sending socket notification',
                error
            );
            return { status: false };
        }
    }

    /**
     * Receive socket message / notification
     * @param socket
     */
    private registerMessageListener(socket: Socket): void {
        try {
            this.logger.info('Inside SocketMessage: receiveMessage method');

            socket.on(
                'messages',
                (key: string, messagePayload: NotificationPayload) => {
                    console.log('KEY:', key, 'MESSAGE:', messagePayload);
                }
            );
        } catch (error) {
            this.logger.error(
                'Inside SocketMessage: receiveMessage method: Error while reading socket received message',
                error
            );
        }
    }
}

export default new SocketMessage();
