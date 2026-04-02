import { create } from "zustand";

import type { ProjectCategory } from "@/data/types";

type ProjectStoreState = {
  // Active project in the canvas/featured pill selectors
  activeProjectId: string | null;

  // Browse drawer
  isDrawerOpen: boolean;
  query: string;
  selectedCategory: ProjectCategory | "All";

  // Peek panel
  selectedProjectId: string | null;

  // Media playback (inside peek panel)
  selectedVideoId: string | null;
  selectedChapterId: string | undefined;
  playbackStartAt: number;
};

type ProjectStoreActions = {
  // Active project
  setActiveProjectId: (id: string | null) => void;

  // Drawer
  openDrawer: () => void;
  closeDrawer: () => void;
  setQuery: (query: string) => void;
  setSelectedCategory: (category: ProjectCategory | "All") => void;

  // Peek panel
  openProject: (projectId: string) => void;
  closeProject: () => void;

  // Media
  selectVideo: (videoId: string, chapterId?: string, startAt?: number) => void;
  selectChapter: (chapterId: string, videoId: string, atSeconds: number) => void;
  initMedia: (videoId: string | null, chapterId?: string, startAt?: number) => void;
};

export type ProjectStore = ProjectStoreState & ProjectStoreActions;

export const useProjectStore = create<ProjectStore>((set) => ({
  // Initial state
  activeProjectId: null,
  isDrawerOpen: false,
  query: "",
  selectedCategory: "All",
  selectedProjectId: null,
  selectedVideoId: null,
  selectedChapterId: undefined,
  playbackStartAt: 0,

  // Active project
  setActiveProjectId: (id) => set({ activeProjectId: id }),

  // Drawer
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, query: "", selectedCategory: "All" }),
  setQuery: (query) => set({ query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  // Peek panel
  openProject: (projectId) =>
    set({ selectedProjectId: projectId, isDrawerOpen: false }),
  closeProject: () =>
    set({
      selectedProjectId: null,
      selectedVideoId: null,
      selectedChapterId: undefined,
      playbackStartAt: 0,
    }),

  // Media
  selectVideo: (videoId, chapterId, startAt = 0) =>
    set({ selectedVideoId: videoId, selectedChapterId: chapterId, playbackStartAt: startAt }),
  selectChapter: (chapterId, videoId, atSeconds) =>
    set({ selectedChapterId: chapterId, selectedVideoId: videoId, playbackStartAt: atSeconds }),
  initMedia: (videoId, chapterId, startAt = 0) =>
    set({ selectedVideoId: videoId, selectedChapterId: chapterId, playbackStartAt: startAt }),
}));
