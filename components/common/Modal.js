// components/common/Modal.js
"use client";

import React from 'react';
import styles from './Modal.module.css';
import useModalStore from '@/store/modalStore';

const Modal = ({ children }) => {
  const { isOpen, hideModal } = useModalStore();

  if (!isOpen) {
    return null;
  }

  // 백드롭 클릭 시 모달 닫기 (내부 컨텐츠 클릭 시에는 닫히지 않도록)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      hideModal();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modalContent}>
        {children}
      </div>
    </div>
  );
};

export default Modal;