import { create } from "zustand";

interface useDashboardModalInterface {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useDashboardModal = create<useDashboardModalInterface>((set) =>({
    isOpen: false,
    onOpen: () => set({ isOpen: true}),
    onClose: () => set({ isOpen: false}),
     
}));