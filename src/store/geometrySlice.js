const createGeometrySlice = (set) => ({
  geometries: [],
  setGeometries: (newGeometries) => set(() => ({ geometries: newGeometries })),
});

export default createGeometrySlice;
