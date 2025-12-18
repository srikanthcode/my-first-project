

class MockSocketService {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    private listeners: Map<string, Set<Function>> = new Map();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(callback);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    off(event: string, callback: Function) {
        this.listeners.get(event)?.delete(callback);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(event: string, data: any) {
        // In a real implementation, this would send to server
        console.log(`[Socket] Emitting ${event}:`, data);

        // Simulate server response
        setTimeout(() => {
            if (event === 'typing') {
                this.trigger('user_typing', data);
            } else if (event === 'send_message') {
                this.trigger('message_sent', { ...data, status: 'sent' });
                // Simulate delivery after 1 second
                setTimeout(() => {
                    this.trigger('message_delivered', { messageId: data.id });
                }, 1000);
            }
        }, 100);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trigger(event: string, data: any) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach((callback) => callback(data));
        }
    }

    // Helper method to simulate receiving a message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    simulateReceiveMessage(message: any) {
        setTimeout(() => {
            this.trigger('new_message', message);
        }, Math.random() * 3000 + 1000); // Random delay between 1-4 seconds
    }

    // Helper method to simulate typing indicator
    simulateTyping(chatId: string, userId: string, duration = 3000) {
        this.trigger('user_typing', { chatId, userId, isTyping: true });
        setTimeout(() => {
            this.trigger('user_typing', { chatId, userId, isTyping: false });
        }, duration);
    }
}

export const socketService = new MockSocketService();
