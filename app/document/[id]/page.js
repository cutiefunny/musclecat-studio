"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { db } from "@/lib/firebase/clientApp";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
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
  const searchParams = useSearchParams();
  const originSearch = searchParams.get("search"); // URL에서 검색어 파라미터 추출

  const user = useAuthStore((state) => state.user);
  
  const [data, setData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [mounted, setMounted] = useState(false);

  // 검색 모드 상태
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchDocs, setSearchDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        // 1. ID로 문서 조회 시도
        const docRef = doc(db, "documents", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // 문서가 존재하면 상세 페이지 모드
          const fetchedData = docSnap.data();
          setData(fetchedData);
          setEditData(fetchedData);
          setIsSearchMode(false);
        } else {
          // 2. 문서가 없으면 ID를 검색어로 간주하여 검색 모드 진입
          const decodedTerm = decodeURIComponent(id);
          setSearchTerm(decodedTerm);
          setIsSearchMode(true);

          const q = query(collection(db, "documents"), orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(q);
          const allDocs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // 제목에 검색어가 포함된 문서 필터링
          const filtered = allDocs.filter(doc => 
            doc.title && doc.title.includes(decodedTerm)
          );
          setSearchDocs(filtered);
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
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

  if (!mounted) return <div className={styles.container}>Loading...</div>;

  // --- [검색 결과 목록 뷰] ---
  if (isSearchMode) {
    return (
      <div className={styles.container}>
        {/* <header className={styles.header}>
          <h1 className={styles.title}>'{searchTerm}' 문서</h1>
          <div className={styles.buttonGroup}>
            <Link href="/document" className={`${styles.btn} ${styles.btnList}`}>
              전체 목록
            </Link>
          </div>
        </header> */}

        <div className={styles.list}>
          {searchDocs.length === 0 ? (
            <p className={styles.emptyText}>검색된 문서가 없습니다.</p>
          ) : (
            searchDocs.map((doc) => (
              // 상세 페이지로 이동할 때 현재 검색어를 query string으로 전달
              <Link 
                key={doc.id} 
                href={`/document/${doc.id}?search=${encodeURIComponent(searchTerm)}`} 
                className={styles.card}
              >
                <h2 className={styles.cardTitle}>{doc.title}</h2>
                <p className={styles.cardSummary}>{doc.description}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.authorInfo}>
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

  // --- [상세 페이지 뷰] ---
  if (!data) return <div className={styles.container}>Loading...</div>;

  const isAuthor = user && user.email === data.authorEmail;

  // 목록 버튼 링크 결정 (검색해서 들어왔으면 검색 결과로, 아니면 전체 목록으로)
  const backLink = originSearch ? `/document/${originSearch}` : "/document";
  const backButtonLabel = originSearch ? "검색 목록" : "목록";

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
            <button onClick={() => setIsEditing(false)} className={`${styles.btn} ${styles.btnList}`}>취소</button>
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
            <div className={styles.buttonGroup}>
              {isAuthor && (
                <>
                  <button onClick={() => setIsEditing(true)} className={`${styles.btn} ${styles.btnList}`}>수정</button>
                  <button onClick={handleDelete} className={`${styles.btn} ${styles.btnDanger}`}>삭제</button>
                </>
              )}
              {/* 동적으로 설정된 링크 적용 */}
              <Link href={backLink} className={`${styles.btn} ${styles.btnList}`}>
                {backButtonLabel}
              </Link>
            </div>
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