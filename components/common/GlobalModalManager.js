'use client';

import useModalStore from "@/store/modalStore";
import LoginModal from "@/components/LoginModal";

export default function GlobalModalManager() {
  const { modalType, isOpen, hideModal } = useModalStore();

  if (!isOpen) return null;

  return (
    <>
      {modalType === 'login' && (
        <LoginModal show={true} onClose={hideModal} />
      )}
    </>
  );
}