// store/modalStore.js
import { create } from 'zustand';

const useModalStore = create((set) => ({
  modalType: null, // 'alert', 'confirm', 'login'
  modalProps: {},
  isOpen: false,

  // 기존 showModal 유지하며 타입 확장
  showModal: (type, props = {}) => set({ modalType: type, modalProps: props, isOpen: true }),
  hideModal: () => set({ isOpen: false, modalType: null, modalProps: {} }),
}));

export default useModalStore;