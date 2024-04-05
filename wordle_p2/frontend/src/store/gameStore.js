import create from 'zustand';

const useGameStore = create((set) => ({
  gameState: 'idle', 
  successCount: 0, 
  failCount: 0,    
  incompleteCount: 0, 


  setGameState: (newState) => set({ gameState: newState }),

  incrementSuccessCount: () => set((state) => ({ successCount: state.successCount + 1 })),

  incrementFailCount: () => set((state) => ({ failCount: state.failCount + 1 })),

  incrementIncompleteCount: () => set((state) => ({ incompleteCount: state.incompleteCount + 1 })),
}));

export default useGameStore;
