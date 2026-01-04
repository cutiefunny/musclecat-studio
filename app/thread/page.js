'use client';

import { useState, useEffect } from 'react';
import styles from './thread.module.css';
import { db, auth } from '@/lib/firebase/clientApp';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
import { FaTrash, FaPen, FaCheck, FaTimes } from 'react-icons/fa';

export default function ThreadPage() {
  const [comments, setComments] = useState([]);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 상태 관리
  const [currentUserIp, setCurrentUserIp] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // 1. 사용자 IP 가져오기
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res = await fetch('/api/whoami');
        const data = await res.json();
        setCurrentUserIp(data.ip);
      } catch (e) {
        console.error("IP check failed:", e);
      }
    };
    fetchIp();
  }, []);

  // 2. 관리자 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 3. 댓글 목록 실시간 구독
  useEffect(() => {
    const q = query(collection(db, 'threads'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const threadData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(threadData);
    });

    return () => unsubscribe();
  }, []);

  // 작성 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'threads'), {
        nickname: nickname.trim() || '익명',
        content: content.trim(),
        ip: currentUserIp, // 작성 시점 IP 저장
        createdAt: serverTimestamp(),
      });
      setContent(''); 
    } catch (error) {
      console.error("Error adding comment: ", error);
      alert("글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 삭제 핸들러
  const handleDelete = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'threads', id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  // 수정 모드 진입
  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  // 수정 저장 핸들러
  const handleUpdate = async (id) => {
    if (!editContent.trim()) return;
    try {
      await updateDoc(doc(db, 'threads', id), {
        content: editContent.trim(),
        isEdited: true
      });
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error("Update failed:", error);
      alert("수정에 실패했습니다.");
    }
  };

  // 권한 체크 함수
  const canModify = (commentIp) => {
    // 1. 관리자 계정인 경우
    if (userEmail === 'cutiefunny@gmail.com') return true;
    // 2. 작성자와 현재 IP가 같은 경우 (IP가 존재할 때만)
    if (currentUserIp && commentIp && currentUserIp === commentIp) return true;
    return false;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.homeLink}>
           ← 홈으로 돌아가기
        </Link>
        <h1 className={styles.title}>아무말 보드</h1>
        <p className={styles.description}>
          로그인 없이 자유롭게 이야기를 남겨보세요!
        </p>
      </header>

      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="닉네임 (선택)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={styles.inputNickname}
              maxLength={10}
            />
          </div>
          <textarea
            placeholder="하고 싶은 말을 남겨주세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles.textarea}
            required
            maxLength={500}
          />
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </section>

      <section className={styles.listSection}>
        <h2 className={styles.listTitle}>최신 코멘트 ({comments.length})</h2>
        <div className={styles.commentList}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <div className={styles.authorInfo}>
                  <span className={styles.commentAuthor}>{comment.nickname}</span>
                  <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                  {comment.isEdited && <span className={styles.editedLabel}>(수정됨)</span>}
                </div>
                
                {/* 수정/삭제 버튼 그룹 */}
                {canModify(comment.ip) && !editingId && (
                  <div className={styles.actionButtons}>
                    <button onClick={() => startEdit(comment)} className={styles.iconButton} title="수정">
                      <FaPen />
                    </button>
                    <button onClick={() => handleDelete(comment.id)} className={`${styles.iconButton} ${styles.deleteButton}`} title="삭제">
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>

              {/* 내용 표시 or 수정 폼 */}
              {editingId === comment.id ? (
                <div className={styles.editForm}>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={styles.editTextarea}
                    maxLength={500}
                  />
                  <div className={styles.editActions}>
                    <button onClick={() => handleUpdate(comment.id)} className={styles.saveButton}>
                      <FaCheck /> 저장
                    </button>
                    <button onClick={cancelEdit} className={styles.cancelButton}>
                      <FaTimes /> 취소
                    </button>
                  </div>
                </div>
              ) : (
                <p className={styles.commentContent}>{comment.content}</p>
              )}
            </div>
          ))}
          {comments.length === 0 && (
            <div className={styles.emptyState}>
              <p>아직 작성된 글이 없습니다. 첫 번째 글을 남겨보세요!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}