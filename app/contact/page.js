'use client';

// cutiefunny/musclecat-studio/musclecat-studio-69b8328c83a86b17efd454da2083bf135e4c6a70/app/contact/page.js
import styles from './contact.module.css';
import Image from 'next/image';
// FaGithub 아이콘 추가
import { FaPhone, FaEnvelope, FaInstagram, FaGithub } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';

export default function Contact() {
  const [imageIndex, setImageIndex] = useState(1);

  // useEffect를 사용하여 컴포넌트가 클라이언트에 마운트된 후에
  // 랜덤 이미지 인덱스를 설정합니다.
  useEffect(() => {
    setImageIndex(Math.floor(Math.random() * 4) + 1);
  }, []); // 빈 배열을 전달하여 마운트 시 한 번만 실행되도록 합니다.

  const changeImage = () => {
    // 이미지를 변경할 때 현재와 다른 이미지가 나오도록 개선 (선택 사항)
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * 4) + 1;
    } while (newIndex === imageIndex);
    setImageIndex(newIndex);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.imageWrapper} onClick={changeImage} title="클릭하여 이미지 변경">
          <Image
            src={`/images/D${imageIndex}.png`}
            alt="Random Muscle Cat Image"
            fill
            className={styles.fillImage}
            priority
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.contactInfo}>
          <h2>Contact Information</h2>
          <div className={styles.infoItem}>
            <FaPhone className={styles.icon} />
            <a href="tel:010-8315-1379">010-8315-1379</a>
          </div>
          <div className={styles.infoItem}>
            <FaEnvelope className={styles.icon} />
            <a href="mailto:cutiefunny@naver.com">cutiefunny@naver.com</a>
          </div>
          <div className={styles.infoItem}>
            <FaInstagram className={styles.icon} />
            <a href="https://instagram.com/musclecat_studio" target="_blank" rel="noopener noreferrer">@musclecat_studio</a>
          </div>
        </section>

        <section className={styles.linksInfo}>
          <h2>Links</h2>
          <div className={styles.infoItem}>
            <FaGithub className={styles.icon} />
            <a href="https://github.com/cutiefunny" target="_blank" rel="noopener noreferrer">
              GitHub Profile
            </a>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.icon}>▲</span>
            <a href="https://vercel.com/musclecat-studio" target="_blank" rel="noopener noreferrer">
              Vercel Profile
            </a>
          </div>
        </section>

        <form className={styles.contactForm}>
          <h2>Contact Form</h2>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>Send</button>
        </form>
      </main>
    </div>
  );
}