// cutiefunny/musclecat-studio/musclecat-studio-1e58aa6ff05d2d0c24e0d313fcd9602693ca1d8a/app/goods/page.js
import styles from './goods.module.css';
import Link from 'next/link';

export default function Goods() {
  // 예시 굿즈 데이터 (추후 실제 데이터로 교체 필요)
  const goodsItems = [
    { id: 1, name: '404 오버핏 맨투맨', price: '18,900원', imageUrl: '/images/404mantoman.jpg', link: 'https://smartstore.naver.com/musclecat/products/10351109220' },
    { id: 2, name: '맥북 미니어처 키링', price: '4,000원', imageUrl: '/images/macbook-keyring.jpg', link: 'https://smartstore.naver.com/musclecat/products/10203298412' },
    { id: 3, name: '깃헙 키링', price: '3,000원', imageUrl: '/images/github-keyring.jpg', link: 'https://smartstore.naver.com/musclecat/products/10203298412' },
    // ... 더 많은 굿즈 아이템
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>굿즈샵</h1>
      </header>

      <main className={styles.goodsGrid}>
        {goodsItems.map((item) => (
          // 각 굿즈 아이템을 링크로 감싸서 상세 페이지로 이동하도록 구현 가능
          <Link key={item.id} href={item.link} className={styles.goodsCardLink}>
            <div key={item.id} className={styles.goodsCard}>
              <div className={styles.imageContainer}>
                {/* 굿즈 이미지 (예시 경로, 실제 이미지 경로로 수정 필요) */}
                <img src={item.imageUrl} alt={item.name} className={styles.goodsImage} />
                {/* Next.js Image 컴포넌트 사용 시 */}
                {/* <Image src={item.imageUrl} alt={item.name} width={200} height={200} className={styles.goodsImage} /> */}
              </div>
              <h3>{item.name}</h3>
              <p className={styles.goodsPrice}>{item.price}</p>
              {/* 구매 버튼 또는 상세 보기 버튼 추가 가능 */}
              <button className={styles.buyButton}>구매하기</button>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}