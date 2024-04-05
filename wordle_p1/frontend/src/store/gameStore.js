import create from 'zustand';

const useGameStore = create((set) => ({
  gameState: 'idle', 
  setGameState: (newState) => set({ gameState: newState }), 
}));

export default useGameStore;
