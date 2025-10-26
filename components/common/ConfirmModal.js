// components/common/ConfirmModal.js
"use client";

import React from 'react';
import Image from 'next/image';
import Modal from './Modal';
import styles from './Modal.module.css';
import useModalStore from '@/store/modalStore';

const ConfirmModal = () => {
  const { modalType, modalProps, hideModal } = useModalStore();
  const { message = "확인하시겠습니까?", onConfirm } = modalProps; // 기본 메시지 및 콜백 함수

  if (modalType !== 'confirm') {
    return null;
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(); // 확인 콜백 실행
    }
    hideModal(); // 모달 닫기
  };

  return (
    <Modal>
      <div className={styles.modalMessage}>{message}</div>
      <div className={styles.modalActions}>
        <Image
          src="/images/negative-button.png"
          alt="취소"
          width={100} // 예시 너비, 실제 이미지 비율에 맞게 조정
          height={30} // 고정 높이
          className={styles.modalButton}
          onClick={hideModal} // 취소 버튼 클릭 시 모달 닫기
          priority
        />
        <Image
          src="/images/positive-button.png"
          alt="확인"
          width={100} // 예시 너비, 실제 이미지 비율에 맞게 조정
          height={30} // 고정 높이
          className={styles.modalButton}
          onClick={handleConfirm} // 확인 버튼 클릭 시 콜백 실행 및 모달 닫기
          priority
        />
      </div>
    </Modal>
  );
};

export default ConfirmModal;