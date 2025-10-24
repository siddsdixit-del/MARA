import React, { createContext, useContext, useState, useEffect } from 'react';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Connect to WebSocket server (optional, won't block rendering)
    try {
      const websocket = new WebSocket('ws://localhost:8086/ws?role=admin');

      websocket.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);

      // Subscribe to all message types
      const subscriptions = [
        'workload_update',
        'resource_update',
        'metrics_update',
        'alert_update',
        'billing_update',
        'system_event'
      ];

      subscriptions.forEach(type => {
        websocket.send(JSON.stringify({
          action: 'subscribe',
          type: type
        }));
      });
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('📨 WebSocket message:', message.type);

        // Add to messages array
        setMessages(prev => [...prev.slice(-50), message]); // Keep last 50

        // Handle different message types
        switch (message.type) {
          case 'metrics_update':
            setMetrics(message.data);
            break;
          case 'alert_update':
            setAlerts(prev => [message.data, ...prev.slice(0, 19)]); // Keep last 20
            break;
          case 'workload_update':
          case 'resource_update':
          case 'billing_update':
          case 'system_event':
            // Could dispatch events for other components to listen to
            window.dispatchEvent(new CustomEvent(message.type, { detail: message.data }));
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setIsConnected(false);
    };

    websocket.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    };

    setWs(websocket);

    // Cleanup
    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
    } catch (error) {
      console.error('❌ WebSocket connection failed (non-critical):', error);
      // App will continue to work without WebSocket
    }
  }, []);

  const sendMessage = (type, data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, data }));
    }
  };

  const subscribe = (messageType) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        action: 'subscribe',
        type: messageType
      }));
    }
  };

  const unsubscribe = (messageType) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        action: 'unsubscribe',
        type: messageType
      }));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        messages,
        metrics,
        alerts,
        sendMessage,
        subscribe,
        unsubscribe
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

