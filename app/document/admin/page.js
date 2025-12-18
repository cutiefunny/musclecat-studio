"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/clientApp"; //
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useAuthStore from "@/store/authStore"; //
import styles from "../document.module.css";

export default function AdminMigrationPage() {
  const { user } = useAuthStore(); //
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // 업로드할 Mock 데이터 리스트
  const mockDocs = [
    {
      title: "근육고양이 스튜디오에 오신 것을 환영합니다",
      description: "스튜디오의 첫 번째 공식 문서이자 가이드입니다.",
      content: "<h2>노션처럼 깔끔한 문서</h2><p>이곳에 프로젝트 기록을 남길 수 있습니다. 서버사이드 렌더링으로 구글 검색에 아주 잘 노출됩니다.</p>",
      category: "공지사항",
    },
    {
      title: "협업 프로젝트 진행 가이드",
      description: "우리와 함께 소프트웨어를 개발할 때 알아두면 좋은 절차들입니다.",
      content: "<h2>프로젝트 절차</h2><ol><li>요구사항 분석</li><li>설계 및 프로토타이핑</li><li>개발 및 테스트</li><li>배포</li></ol>",
      category: "가이드",
    },
    {
      title: "2025년 우리가 주목하는 기술 스택",
      description: "AI와 웹 트렌드를 반영한 근육고양이의 기술 스택 소개입니다.",
      content: "<h2>기술 스택 구성</h2><ul><li>Next.js 15</li><li>Firebase</li><li>Zustand</li><li>Tailwind CSS</li></ul>",
      category: "기술",
    }
  ];

  const uploadMockData = async () => {
    // if (!user) {
    //   alert("로그인이 필요합니다.");
    //   return;
    // }

    setLoading(true);
    setStatus("데이터 업로드 중...");

    try {
      const docRef = collection(db, "documents");
      
      for (const docData of mockDocs) {
        await addDoc(docRef, {
          ...docData,
          authorEmail: "cutiefunny@gmail.com", // 관리자 이메일로 고정
          createdAt: new Date().toISOString(), // 정렬을 위한 ISO 문자열
          timestamp: serverTimestamp(), // 서버 기준 타임스탬프
        });
      }

      setStatus("모든 Mock 데이터가 성공적으로 업로드되었습니다!");
      alert("업로드 완료!");
    } catch (error) {
      console.error("Error uploading documents: ", error);
      setStatus("업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 관리자 권한 체크 (로그인 여부만 확인하거나 특정 이메일로 제한 가능)
//   if (!user) {
//     return (
//       <div className={styles.container}>
//         <p>관리자 로그인이 필요한 페이지입니다.</p>
//       </div>
//     );
//   }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Data Migration Tool</h1>
      </header>

      <div className={styles.form}>
        <p className={styles.description}>
          버튼을 누르면 정의된 {mockDocs.length}개의 Mock 데이터를 Firestore의 <strong>documents</strong> 컬렉션에 업로드합니다.
        </p>
        
        <div className={styles.buttonGroup}>
          <button 
            onClick={uploadMockData} 
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={loading}
          >
            {loading ? "업로드 중..." : "Mock 데이터 일괄 업로드"}
          </button>
        </div>

        {status && (
          <p className={styles.docDate} style={{ marginTop: "20px", color: "#2563eb" }}>
            {status}
          </p>
        )}
      </div>

      <footer className={styles.footer}>
        <button 
          onClick={() => window.location.href = "/document"}
          className={`${styles.btn} ${styles.btnOutline}`}
        >
          문서 목록으로 돌아가기
        </button>
      </footer>
    </div>
  );
}