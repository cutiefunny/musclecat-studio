// cutiefunny/musclecat-studio/musclecat-studio-9a81173fb6244becb85a7f9ae672a21081aa87cb/app/news/page.js
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
  doc, updateDoc, deleteDoc // Firestore 수정/삭제 함수 추가
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // storage 삭제 함수 추가

export default function News() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- 수정 관련 상태 ---
  const [editingPostId, setEditingPostId] = useState(null); // 현재 수정 중인 게시글 ID
  const [editText, setEditText] = useState(''); // 수정 중인 텍스트 내용
  // ---------------------

  const { user, setUser } = useAuthStore();
  const isAdmin = user && user.email === 'cutiefunny@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  const fetchPosts = async () => {
    const postsCollection = collection(db, 'news');
    const q = query(postsCollection, orderBy('timestamp', 'desc'));
    const postSnapshot = await getDocs(q);
    const postList = postSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(postList);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setNewPostImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const processImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_LENGTH = 400;
          let { width, height } = img;

          if (width > height) {
            if (width > MAX_LENGTH) {
              height *= MAX_LENGTH / width;
              width = MAX_LENGTH;
            }
          } else {
            if (height > MAX_LENGTH) {
              width *= MAX_LENGTH / height;
              height = MAX_LENGTH;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          }, 'image/avif', 0.8);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || (!newPostText.trim() && !newPostImage) || isLoading) return;

    setIsLoading(true);

    try {
      let imageUrl = '';
      if (newPostImage) {
        const processedImageBlob = await processImage(newPostImage);
        // 파일 이름을 더 예측 가능하게 만듭니다 (예: postId 또는 timestamp 사용)
        const imageName = `${Date.now()}-${newPostImage.name.replace(/\s+/g, '-')}.avif`;
        const imageRef = ref(storage, `news/${imageName}`);
        await uploadBytes(imageRef, processedImageBlob);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'news'), {
        text: newPostText,
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
        author: user.email,
        // 이미지 파일 이름을 저장하여 나중에 삭제할 때 사용
        imageName: newPostImage ? imageName : null,
      });

      setNewPostText('');
      setNewPostImage(null);
      setPreviewImage(null);
      if (e.target.imageUpload) { // 파일 인풋 초기화 (선택적)
        e.target.imageUpload.value = "";
      }
      await fetchPosts();

    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert("게시글 작성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 수정 관련 함수 ---
  /** 게시글 수정 모드로 전환 */
  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setEditText(post.text);
    // 이미지 수정은 이 예제에서 제외 (필요시 추가 구현)
  };

  /** 게시글 수정 취소 */
  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditText('');
  };

  /** 게시글 내용 업데이트 */
  const handleUpdate = async (postId) => {
    if (!isAdmin || !editText.trim()) return;
    setIsLoading(true); // 수정 중 로딩 상태 활성화
    try {
      const postRef = doc(db, 'news', postId);
      await updateDoc(postRef, {
        text: editText,
        // timestamp: serverTimestamp() // 수정 시각 업데이트 (선택 사항)
      });
      setEditingPostId(null); // 수정 모드 종료
      setEditText('');
      await fetchPosts(); // 목록 새로고침
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };
  // ---------------------

  // --- 삭제 관련 함수 ---
  /** 게시글 삭제 */
  const handleDelete = async (post) => {
    if (!isAdmin || !window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    setIsLoading(true); // 삭제 중 로딩 상태 활성화
    try {
      // Firestore 문서 삭제
      await deleteDoc(doc(db, 'news', post.id));

      // Storage 이미지 삭제 (imageName 필드가 있다고 가정)
      if (post.imageName) {
        const imageRef = ref(storage, `news/${post.imageName}`);
        try {
          await deleteObject(imageRef);
        } catch (storageError) {
          // 이미지가 없는 경우 등 에러 처리 (선택적)
          console.warn("Storage 이미지 삭제 실패 (무시 가능):", storageError);
        }
      }

      await fetchPosts(); // 목록 새로고침
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };
  // ---------------------

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
                disabled={isLoading} // 로딩 중 비활성화
              />
              {previewImage && (
                <div className={styles.imagePreview}>
                  <Image src={previewImage} alt="Preview" width={100} height={100} style={{ objectFit: 'cover' }} />
                </div>
              )}
              <div className={styles.formActions}>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                  disabled={isLoading} // 로딩 중 비활성화
                />
                <label htmlFor="imageUpload" className={styles.fileLabel}>이미지 선택</label>
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                  {isLoading ? '처리 중...' : '게시'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.thread}>
          {posts.map((post) => (
            <div key={post.id} className={styles.post}>
              {editingPostId === post.id ? (
                // --- 수정 모드 ---
                <div className={styles.editForm}>
                  <textarea
                    className={styles.editTextarea} // 수정용 textarea 스타일 적용
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
                // --- 일반 모드 ---
                <>
                  <p className={styles.postText}>{post.text}</p>
                  {post.imageUrl && (
                    <div className={styles.postImageContainer}>
                      {/* layout="fill" 대신 width, height 직접 지정 또는 부모 요소 크기 지정 필요 */}
                      <Image
                        src={post.imageUrl}
                        alt="게시물 이미지"
                        width={300} // 예시 크기, 실제 디자인에 맞게 조절
                        height={300} // 예시 크기
                        style={{ objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '300px' }} // 스타일 추가
                        className={styles.postImage}
                       />
                    </div>
                  )}
                  <div className={styles.postMeta}> {/* 메타 정보 영역 */}
                    <div className={styles.postTimestamp}>
                      {post.timestamp?.toDate().toLocaleString() || new Date().toLocaleString()}
                    </div>
                    {/* 관리자일 때만 수정/삭제 버튼 표시 */}
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
          ))}
          {posts.length === 0 && !isLoading && ( // 로딩 중 아닐 때만 표시
            <div className={styles.post}>
              <p className={styles.postText}>첫 번째 소식을 기다리고 있어요!</p>
            </div>
          )}
          {isLoading && posts.length === 0 && ( // 로딩 중이고 게시글 없을 때
             <div className={styles.post}>
               <p className={styles.postText}>소식을 불러오는 중...</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}