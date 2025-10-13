'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './news.module.css';
import LoginModal from '@/components/LoginModal';
import useAuthStore from '@/store/authStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase/clientApp';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function News() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const { user, setUser } = useAuthStore();
  const isAdmin = user && user.email === 'cutiefunny@gmail.com';

  // Firebase 인증 상태 리스너 설정
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  // Firestore에서 게시글 목록을 가져오는 함수
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

  /**
   * 이미지를 리사이즈하고 AVIF 형식으로 변환하는 함수
   * @param {File} file - 원본 이미지 파일
   * @returns {Promise<Blob>} - 변환된 이미지 Blob
   */
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
          }, 'image/avif', 0.8); // AVIF 형식, 품질 80%
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

      // 이미지가 있으면 처리 및 업로드
      if (newPostImage) {
        const processedImageBlob = await processImage(newPostImage);
        const imageRef = ref(storage, `news/${Date.now()}.avif`);
        await uploadBytes(imageRef, processedImageBlob);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Firestore에 새 게시글 추가
      await addDoc(collection(db, 'news'), {
        text: newPostText,
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
        author: user.email,
      });

      // 폼 초기화 및 게시글 목록 새로고침
      setNewPostText('');
      setNewPostImage(null);
      setPreviewImage(null);
      e.target.reset();
      await fetchPosts();

    } catch (error) {
      console.error("게시글 작성 실패:", error);
      alert("게시글 작성에 실패했습니다.");
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
                />
                <label htmlFor="imageUpload" className={styles.fileLabel}>이미지 선택</label>
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                  {isLoading ? '게시 중...' : '게시'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.thread}>
          {posts.map((post) => (
            <div key={post.id} className={styles.post}>
              <p className={styles.postText}>{post.text}</p>
              {post.imageUrl && (
                <div className={styles.postImageContainer}>
                  <Image src={post.imageUrl} alt="게시물 이미지" layout="fill" objectFit="cover" className={styles.postImage} />
                </div>
              )}
              <div className={styles.postTimestamp}>
                {post.timestamp?.toDate().toLocaleString() || new Date().toLocaleString()}
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className={styles.post}>
              <p className={styles.postText}>첫 번째 소식을 기다리고 있어요!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}