// store.js
import create from 'zustand';

const useWebSocketStore = create((set, get) => ({
  ws: null,
  isConnected: false,
  messages: [],
  createConnection: () => {
    const ws = new WebSocket('ws://localhost:8000');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      set({ isConnected: true });
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      set({ isConnected: false });
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
    //   console.log('Received message:', message);
      set((state) => ({ messages: [...state.messages, message] }));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    set({ ws });
  },
  sendMessage: (message) => {
    get().ws.send(message);
  },
  closeConnection: () => {
    get().ws.close();
  },
}));

export default useWebSocketStore;
