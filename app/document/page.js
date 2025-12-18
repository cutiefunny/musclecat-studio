"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { db } from "@/lib/firebase/clientApp";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import useAuthStore from "@/store/authStore";
import useModalStore from "@/store/modalStore";
import styles from "./document.module.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className={styles.editorLoading}>에디터 로딩 중...</div>
});
import "react-quill-new/dist/quill.snow.css";

export default function DocumentListPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const showModal = useModalStore((state) => state.showModal);
  
  const [docs, setDocs] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", content: "", category: "일반" });
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const q = query(collection(db, "documents"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      setDocs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("문서를 가져오는데 실패했습니다:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await addDoc(collection(db, "documents"), {
        ...formData,
        createdAt: new Date().toISOString(),
        authorEmail: user?.email,
        authorName: user?.displayName || user?.email?.split('@')[0],
        authorPhoto: user?.photoURL // 구글 프로필 이미지 저장
      });
      setFormData({ title: "", description: "", content: "", category: "일반" });
      setIsWriting(false);
      fetchDocs();
    } catch (error) {
      alert("저장에 실패했습니다.");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>근육고양이 노-션</h1>
        
        <div className={styles.buttonGroup}>
          {!user ? (
            <button onClick={() => showModal("login")} className={`${styles.btn} ${styles.btnPrimary}`}>
              로그인
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => logout()} className={`${styles.btn} ${styles.btnOutline}`}>
                로그아웃
              </button>
              {!isWriting && (
                <button onClick={() => setIsWriting(true)} className={`${styles.btn} ${styles.btnPrimary}`}>
                  새 문서 작성
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {user && isWriting && (
        <form onSubmit={handleCreate} className={styles.form}>
          <input 
            className={styles.input} 
            placeholder="제목을 입력하세요" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            required 
          />
          <input 
            className={styles.input} 
            placeholder="목록에 표시될 짧은 요약" 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
          />
          
          <div className={styles.editorWrapper}>
            <ReactQuill 
              theme="snow"
              modules={modules}
              value={formData.content}
              onChange={(content) => setFormData({...formData, content})}
              placeholder="여기에 내용을 입력하세요."
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>저장하기</button>
            <button type="button" onClick={() => setIsWriting(false)} className={`${styles.btn} ${styles.btnOutline}`}>취소</button>
          </div>
        </form>
      )}

      <div className={styles.list}>
        {docs.length === 0 ? (
          <p className={styles.emptyText}>등록된 문서가 없습니다.</p>
        ) : (
          docs.map((doc) => (
            <Link key={doc.id} href={`/document/${doc.id}`} className={styles.card}>
              <h2 className={styles.cardTitle}>{doc.title}</h2>
              <p className={styles.cardSummary}>{doc.description}</p>
              <div className={styles.cardFooter}>
                <div className={styles.authorInfo}>
                  {/* 프로필 이미지가 있으면 이미지, 없으면 기본 아이콘 */}
                  {doc.authorPhoto ? (
                    <img src={doc.authorPhoto} alt="profile" className={styles.profileImg} />
                  ) : (
                    <span className={styles.defaultAvatar}>👤</span>
                  )}
                  <span className={styles.author}>{doc.authorName || '익명'}</span>
                </div>
                <span className={styles.docDate}>{new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}