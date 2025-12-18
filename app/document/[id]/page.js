"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { db } from "@/lib/firebase/clientApp";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import useAuthStore from "@/store/authStore";
import styles from "../document.module.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className={styles.editorLoading}>에디터 로딩 중...</div>
});
import "react-quill-new/dist/quill.snow.css";

export default function DocumentDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      const docRef = doc(db, "documents", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedData = docSnap.data();
        setData(fetchedData);
        setEditData(fetchedData);
      } else {
        router.push("/document");
      }
    };
    fetchData();
  }, [id, router]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "documents", id), editData);
      setData(editData);
      setIsEditing(false);
    } catch (error) {
      alert("수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "documents", id));
      router.push("/document");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  if (!mounted || !data) return <div className={styles.container}>Loading...</div>;

  // 본인이 작성한 글인지 확인 (수정/삭제 권한)
  const isAuthor = user && user.email === data.authorEmail;

  return (
    <div className={styles.container}>
      {isEditing ? (
        <div className={styles.form}>
          <input 
            className={styles.input} 
            value={editData.title} 
            onChange={e => setEditData({...editData, title: e.target.value})} 
          />
          <div className={styles.editorWrapper}>
            <ReactQuill 
              theme="snow"
              modules={modules}
              value={editData.content}
              onChange={(content) => setEditData({...editData, content})}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={handleUpdate} className={`${styles.btn} ${styles.btnPrimary}`}>수정 완료</button>
            <button onClick={() => setIsEditing(false)} className={`${styles.btn} ${styles.btnOutline}`}>취소</button>
          </div>
        </div>
      ) : (
        <>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>{data.title}</h1>
              <div className={styles.metaInfo}>
                <span className={styles.author}>작성자: {data.authorName || '익명'}</span>
                <span className={styles.divider}>|</span>
                <span className={styles.docDate}>
                  {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
            </div>
            {isAuthor && (
              <div className={styles.buttonGroup}>
                <button onClick={() => setIsEditing(true)} className={`${styles.btn} ${styles.btnOutline}`}>수정</button>
                <button onClick={handleDelete} className={`${styles.btn} ${styles.btnDanger}`}>삭제</button>
              </div>
            )}
          </header>
          
          <main 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: data.content }} 
          />
        </>
      )}
    </div>
  );
}