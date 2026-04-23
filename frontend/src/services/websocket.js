import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from '../utils/constants';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
        this.onConnectCallbacks = [];
    }

    connect(url = `${API_BASE_URL}/ws`) {
        if (this.client && this.client.active) return;

        this.client = new Client({
            webSocketFactory: () => new SockJS(url),
            debug: (str) => {
                // console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame) => {
            console.log('Connected to WebSocket');
            this.onConnectCallbacks.forEach(callback => callback());
            // Resubscribe to previous topics if any
            this.subscriptions.forEach((callback, topic) => {
                this._subscribe(topic, callback);
            });
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        this.client.activate();
    }

    subscribe(topic, callback) {
        this.subscriptions.set(topic, callback);
        if (this.client && this.client.connected) {
            return this._subscribe(topic, callback);
        }
        return null;
    }

    _subscribe(topic, callback) {
        console.log(`Subscribing to ${topic}`);
        return this.client.subscribe(topic, (message) => {
            if (message.body) {
                callback(JSON.parse(message.body));
            }
        });
    }

    unsubscribe(topic) {
        const sub = this.subscriptions.get(topic);
        if (sub && typeof sub.unsubscribe === 'function') {
            sub.unsubscribe();
        }
        this.subscriptions.delete(topic);
    }

    onConnect(callback) {
        this.onConnectCallbacks.push(callback);
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
        }
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
