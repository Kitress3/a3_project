import create from 'zustand';

const useUIVisible = create((set) => ({
  ui_home: false, // default status
  ui_username:false,
  ui_play:false,
  ui_stats:false,
  ui_instructions:false,
  toggleUiHome: () => set((state) => ({ ui_home: !state.ui_home })), // change the status
  toggleUiUsername: () => set((state) => ({ ui_username: !state.ui_username })),
  toggleUiPlay: () => set((state) => ({ ui_play: !state.ui_play })),
  toggleUiStats: () => set((state) => ({ ui_stats: !state.ui_stats })),
  toggleUiInstructions: () => set((state) => ({ ui_instructions: !state.ui_instructions })),
}));

export default useUIVisible;
