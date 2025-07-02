const createSceneSlice = (set, get) => ({
  visGrid: true,
  toggleVisGrid: () => set(() => ({ visGrid: !get().visGrid })),
});
export default createSceneSlice;
