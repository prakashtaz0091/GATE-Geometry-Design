import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import createGeometrySlice from "./geometrySlice";

const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...createGeometrySlice(set, get),
      }),
      {
        name: "zustand-app-storage", // localStorage key
        partialize: (state) => ({ geometries: state.geometries }),
      }
    )
  )
);

export default useStore;
