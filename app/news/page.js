// cutiefunny/musclecat-studio/musclecat-studio-1e58aa6ff05d2d0c24e0d313fcd9602693ca1d8a/app/news/page.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './news.module.css';
import LoginModal from '@/components/LoginModal';
import useAuthStore from '@/store/authStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase/clientApp';
import {
  collection, addDoc, getDocs, serverTimestamp, query, orderBy,
  doc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export default function News() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  // newPostImage는 이제 File 객체 대신 처리된 Blob을 저장합니다.
  const [newPostImage, setNewPostImage] = useState(null);
  const [originalFileName, setOriginalFileName] = useState(''); // 원본 파일 이름 저장
  const [previewImage, setPreviewImage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 페이지 로딩 및 게시/수정/삭제 로딩 상태
  const [isProcessingImage, setIsProcessingImage] = useState(false); // 이미지 처리 로딩 상태 추가

  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState('');

  const { user, setUser } = useAuthStore();
  const isAdmin = user && user.email === 'cutiefunny@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const postsCollection = collection(db, 'news');
      const q = query(postsCollection, orderBy('timestamp', 'desc'));
      const postSnapshot = await getDocs(q);
      const postList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postList);
    } catch (error) {
        console.error("게시글을 불러오는 데 실패했습니다:", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // --- ⬇️ UPDATED: handleImageChange 함수 수정 ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessingImage(true); // 이미지 처리 시작
    setOriginalFileName(file.name); // 원본 파일 이름 저장

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const MAX_DIMENSION = 400;
        let targetWidth = img.width;
        let targetHeight = img.height;

        // 긴 축 기준으로 400px 넘는지 확인하고 비율에 맞게 축소
        if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
          if (img.width > img.height) {
            targetWidth = MAX_DIMENSION;
            targetHeight = Math.round((img.height * MAX_DIMENSION) / img.width);
          } else {
            targetHeight = MAX_DIMENSION;
            targetWidth = Math.round((img.width * MAX_DIMENSION) / img.height);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        // 캔버스에 이미지 그리기 (리사이징)
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob((blob) => {
          if (blob) {
            setNewPostImage(blob); // 처리된 Blob 저장
            setPreviewImage(URL.createObjectURL(blob)); // 미리보기 업데이트
          } else {
            console.error("AVIF 변환 실패");
            alert("이미지를 AVIF 형식으로 변환하는데 실패했습니다. 다른 이미지를 사용해보세요.");
            setNewPostImage(null);
            setPreviewImage(null);
            setOriginalFileName('');
            // 파일 입력 필드 초기화 (선택 사항)
            e.target.value = "";
          }
          setIsProcessingImage(false); // 이미지 처리 완료
        }, 'image/avif', 1); // AVIF 포맷, 품질 100%
      };
      img.onerror = () => {
        console.error("이미지 로드 실패");
        alert("이미지를 불러오는데 실패했습니다.");
        setIsProcessingImage(false); // 이미지 처리 완료 (실패)
        setNewPostImage(null);
        setPreviewImage(null);
        setOriginalFileName('');
         // 파일 입력 필드 초기화 (선택 사항)
         e.target.value = "";
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      console.error("파일 읽기 실패");
      alert("파일을 읽는데 실패했습니다.");
      setIsProcessingImage(false); // 이미지 처리 완료 (실패)
      setNewPostImage(null);
      setPreviewImage(null);
      setOriginalFileName('');
       // 파일 입력 필드 초기화 (선택 사항)
       e.target.value = "";
    };
    reader.readAsDataURL(file);
  };
  // --- handleImageChange 함수 수정 끝 ---

  // --- ⬇️ UPDATED: handleSubmit 함수 수정 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 이미지 처리 중이거나 필수 입력값 없을 때 처리 방지
    if (!isAdmin || (!newPostText.trim() && !newPostImage) || isLoading || isProcessingImage) return;

    setIsLoading(true);

    let imageUrl = '';
    let imageName = null;

    try {
      if (newPostImage && originalFileName) { // 처리된 Blob과 원본 파일 이름이 있는지 확인
        // 원본 파일 이름에서 확장자 제거하고 .avif 추가
        const nameWithoutExtension = originalFileName.split('.').slice(0, -1).join('.');
        imageName = `${Date.now()}-${nameWithoutExtension.replace(/\s+/g, '-')}.avif`; // .avif 확장자 명시
        const imageRef = ref(storage, `news/${imageName}`);

        // 처리된 AVIF Blob(newPostImage) 업로드
        await uploadBytes(imageRef, newPostImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'news'), {
        text: newPostText,
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
        author: user.email,
        imageName: imageName, // .avif 파일 이름 저장
      });

      setNewPostText('');
      setNewPostImage(null);
      setPreviewImage(null);
      setOriginalFileName(''); // 원본 파일 이름 초기화
      // 파일 입력 필드 직접 초기화
      if (document.getElementById('imageUpload')) {
         document.getElementById('imageUpload').value = "";
      }
      await fetchPosts();

    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
   // --- handleSubmit 함수 수정 끝 ---

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setEditText(post.text);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditText('');
  };

  const handleUpdate = async (postId) => {
    if (!isAdmin || !editText.trim()) return;
    setIsLoading(true);
    try {
      const postRef = doc(db, 'news', postId);
      await updateDoc(postRef, {
        text: editText,
      });
      setEditingPostId(null);
      setEditText('');
      await fetchPosts();
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (post) => {
    if (!isAdmin || !window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'news', post.id));

      if (post.imageName) {
        const imageRef = ref(storage, `news/${post.imageName}`);
        try {
          await deleteObject(imageRef);
        } catch (storageError) {
          console.warn("Storage 이미지 삭제 실패 (무시 가능):", storageError);
        }
      }

      await fetchPosts();
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 onDoubleClick={() => setShowLoginModal(true)}>뉴스</h1>
        <p>근육고양이 스튜디오의 새로운 소식을 확인하세요!</p>
      </header>

      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <main className={styles.main}>
        {isAdmin && (
          <div className={styles.postFormContainer}>
            <form onSubmit={handleSubmit} className={styles.postForm}>
              <textarea
                className={styles.postTextarea}
                placeholder="새로운 소식을 공유해보세요..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                disabled={isLoading || isProcessingImage} // 이미지 처리 중 비활성화
              />
              {previewImage && (
                <div className={styles.imagePreviewContainer}>
                  <Image src={previewImage} alt="Preview" width={100} height={100} className={styles.imagePreview} />
                </div>
              )}
               {isProcessingImage && <p>이미지 처리 중...</p>} {/* 이미지 처리 중 메시지 */}
              <div className={styles.formActions}>
                <input
                  type="file"
                  id="imageUpload" // id 추가
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                  disabled={isLoading || isProcessingImage} // 이미지 처리 중 비활성화
                />
                <label htmlFor="imageUpload" className={styles.fileLabel}>이미지 선택</label>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading || isProcessingImage || (!newPostText.trim() && !newPostImage)} // 이미지 처리 중 또는 내용 없을 때 비활성화
                >
                  {isLoading ? '처리 중...' : '게시'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.thread}>
          {/* 로딩 상태 및 게시글 렌더링 (기존과 동일) */}
          {isLoading && posts.length === 0 ? (
             <div className={styles.post}>
               <p className={styles.loadingMessage}>소식을 불러오는 중...</p>
             </div>
          ) : posts.length === 0 ? (
            <div className={styles.post}>
              <p className={styles.postText}>첫 번째 소식을 기다리고 있어요!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className={styles.post}>
                {editingPostId === post.id ? (
                  <div className={styles.editForm}>
                    <textarea
                      className={styles.editTextarea}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className={styles.editActions}>
                      <button onClick={() => handleUpdate(post.id)} className={styles.saveButton} disabled={isLoading}>
                        {isLoading ? '저장 중...' : '저장'}
                      </button>
                      <button onClick={handleCancelEdit} className={styles.cancelButton} disabled={isLoading}>
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={styles.postText}>{post.text}</p>
                    {post.imageUrl && (
                      <Image
                        src={post.imageUrl}
                        alt="게시물 이미지"
                        width={500}
                        height={500}
                        className={styles.postImage}
                       />
                    )}
                    <div className={styles.postMeta}>
                      <div className={styles.postTimestamp}>
                        {post.timestamp?.toDate().toLocaleString() || new Date().toLocaleString()}
                      </div>
                      {isAdmin && (
                        <div className={styles.postActions}>
                          <button onClick={() => handleEdit(post)} className={styles.editButton} disabled={isLoading}>수정</button>
                          <button onClick={() => handleDelete(post)} className={styles.deleteButton} disabled={isLoading}>삭제</button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}