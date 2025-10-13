import styles from './contact.module.css';

export default function Contact() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>문의하기</h1>
        <p>근육고양이 스튜디오에 궁금한 점이 있으신가요?</p>
      </header>
      <main className={styles.main}>
        <form className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">이름</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">내용</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>전송</button>
        </form>
      </main>
    </div>
  );
}