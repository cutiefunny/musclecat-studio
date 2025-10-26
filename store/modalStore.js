// store/modalStore.js
import { create } from 'zustand';

const useModalStore = create((set) => ({
  modalType: null, // 'alert' 또는 'confirm'
  modalProps: {}, // 모달에 전달될 props (message, onConfirm 등)
  isOpen: false,

  showModal: (type, props) => set({ modalType: type, modalProps: props, isOpen: true }),
  hideModal: () => set({ isOpen: false, modalType: null, modalProps: {} }), // 닫을 때 초기화
}));

export default useModalStore;