import { io, Socket } from 'socket.io-client';

// Adjust URL to match your backend port (usually 4000 based on your previous contexts)
const SOCKET_URL = 'http://localhost:4000';

class SocketService {
    private socket: Socket | null = null;

    /**
     * Connect to the Socket.IO server with the User ID
     * Backend expects 'id' in the query params: socket.handshake.query.id
     */
    public connect(userId: string): void {
        // Prevent multiple connections
        if (this.socket?.connected) {
            return;
        }

        this.socket = io(SOCKET_URL, {
            query: {
                id: userId, // CRITICAL: Matches backend `socket.handshake.query.id`
            },
            transports: ['websocket', 'polling'], // Matches backend transports configuration
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.setupDefaultListeners();
    }

    /**
     * Disconnect the socket (call this on logout)
     */
    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    /**
     * Listen for the specific 'notification' event emitted by backend's sendMessage()
     */
    public onNotification(callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on('notification', callback);
        }
    }

    /**
     * Remove the listener for notifications to prevent memory leaks
     */
    public offNotification(): void {
        if (this.socket) {
            this.socket.off('notification');
        }
    }

    /**
     * Send a message to the backend
     * Backend listens for 'messages' event with (key, payload)
     */
    public sendMessage(key: string, payload: any): void {
        if (this.socket && this.socket.connected) {
            this.socket.emit('messages', key, payload);
        } else {
            console.warn('Cannot emit message: Socket not connected');
        }
    }

    /**
     * Internal: Setup debug listeners
     */
    private setupDefaultListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('✅ Socket Connected:', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('❌ Socket Disconnected:', reason);
        });

        this.socket.on('connect_error', (err) => {
            console.error('⚠️ Socket Connection Error:', err.message);
        });
    }
    
    /**
     * Helper to check connection status
     */
    public isConnected(): boolean {
        return !!this.socket?.connected;
    }
}

// Export a singleton instance
export default new SocketService();