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
  const [newPostImage, setNewPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setNewPostImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // --- ⬇️ REMOVED: `canvas`를 사용하는 processImage 함수 제거 ---
  // const processImage = ...

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || (!newPostText.trim() && !newPostImage) || isLoading) return;

    setIsLoading(true);

    let imageUrl = '';
    let imageName = null;

    try {
      if (newPostImage) {
        // --- ⬇️ UPDATED: 원본 파일 이름 사용 ---
        imageName = `${Date.now()}-${newPostImage.name.replace(/\s+/g, '-')}`;
        const imageRef = ref(storage, `news/${imageName}`);
        // --- ⬇️ UPDATED: `processImage` 호출 제거, 원본 파일(newPostImage) 직접 업로드 ---
        await uploadBytes(imageRef, newPostImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'news'), {
        text: newPostText,
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
        author: user.email,
        imageName: imageName,
      });

      setNewPostText('');
      setNewPostImage(null);
      setPreviewImage(null);
      if (e.target.imageUpload) {
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
                disabled={isLoading}
              />
              {previewImage && (
                <div className={styles.imagePreviewContainer}>
                  <Image src={previewImage} alt="Preview" width={100} height={100} className={styles.imagePreview} />
                </div>
              )}
              <div className={styles.formActions}>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                  disabled={isLoading}
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
                      // --- ⬇️ UPDATED: Wrapper div 제거, Image props 변경 ---
                      <Image
                        src={post.imageUrl}
                        alt="게시물 이미지"
                        width={500}  // 레이아웃 유지를 위한 값, CSS로 제어됨
                        height={500} // 레이아웃 유지를 위한 값, CSS로 제어됨
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

