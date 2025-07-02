import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createGeometrySlice from "./geometrySlice";
import createSceneSlice from "./sceneSlice";

const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...createGeometrySlice(set, get),
        ...createSceneSlice(set, get),
      }),
      {
        name: "zustand-app-storage", // localStorage key
        partialize: (state) => ({
          geometries: state.geometries,
          visGrid: state.visGrid,
        }),
      }
    )
  )
);

export default useStore;
