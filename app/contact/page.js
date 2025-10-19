'use client';

// cutiefunny/musclecat-studio/musclecat-studio-9a81173fb6244becb85a7f9ae672a21081aa87cb/app/contact/page.js
import styles from './contact.module.css';
import Image from 'next/image';
import { FaPhone, FaEnvelope, FaInstagram } from 'react-icons/fa';
import React from 'react';

export default function Contact() {
  const [imageIndex, setImageIndex] = React.useState(Math.floor(Math.random() * 4) + 1);

  const changeImage = () => {
    setImageIndex(Math.floor(Math.random() * 4) + 1);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
          <div className={styles.imageWrapper}>
            <Image
              src={`/images/D${imageIndex}.png`}
              alt="Random Image"
              fill
              className={styles.fillImage}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onClick={changeImage}
            />
          </div>
            </header>
            <main className={styles.main}>
          {/* 연락처 정보 섹션 */}
        <section className={styles.contactInfo}>
          <h2>Contact Information</h2> {/* 영어로 변경됨 */}
          <div className={styles.infoItem}>
            {/* Mobile 텍스트 대신 아이콘 사용 */}
            <FaPhone className={styles.icon} />
            <a href="tel:010-8315-1379">010-8315-1379</a>
          </div>
          <div className={styles.infoItem}>
            {/* Email 텍스트 대신 아이콘 사용 */}
            <FaEnvelope className={styles.icon} />
            <a href="mailto:cutiefunny@naver.com">cutiefunny@naver.com</a>
          </div>
          <div className={styles.infoItem}>
            {/* Instagram 텍스트 대신 아이콘 사용 */}
            <FaInstagram className={styles.icon} />
            <a href="https://instagram.com/musclecat_mart" target="_blank" rel="noopener noreferrer">@musclecat_mart</a>
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