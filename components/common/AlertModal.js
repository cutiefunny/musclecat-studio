// components/common/AlertModal.js
"use client";

import React from 'react';
import Image from 'next/image';
import Modal from './Modal';
import styles from './Modal.module.css';
import useModalStore from '@/store/modalStore';

const AlertModal = () => {
  const { modalType, modalProps, hideModal } = useModalStore();
  const { message = "알림 메시지" } = modalProps; // 기본 메시지 설정

  if (modalType !== 'alert') {
    return null;
  }

  return (
    <Modal>
      <div className={styles.modalMessage}>{message}</div>
      <div className={styles.modalActions}>
        <Image
          src="/images/positive-button.png"
          alt="확인"
          width={100} // 예시 너비, 실제 이미지 비율에 맞게 조정
          height={30} // 고정 높이
          className={styles.modalButton}
          onClick={hideModal} // 확인 버튼 클릭 시 모달 닫기
          priority // 모달은 보통 중요하므로 로딩 우선순위 높임
        />
      </div>
    </Modal>
  );
};

export default AlertModal;