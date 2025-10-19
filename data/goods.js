// /data/goods.js

// 굿즈 아이템 데이터 배열
export const goodsItems = [
  { id: 1, name: '404 오버핏 맨투맨', price: '18,900원', imageUrl: '/images/404mantoman.jpg', link: 'https://smartstore.naver.com/musclecat/products/10351109220' },
  { id: 2, name: '맥북 미니어처 키링', price: '4,000원', imageUrl: '/images/macbook-keyring.jpg', link: 'https://smartstore.naver.com/musclecat/products/10203298412' },
  { id: 3, name: '깃헙 키링', price: '3,000원', imageUrl: '/images/github-keyring.jpg', link: 'https://smartstore.naver.com/musclecat/products/10203298412' },
  // 필요에 따라 더 많은 굿즈 아이템을 여기에 추가할 수 있습니다.
  // 예시:
  // { id: 4, name: '상품 이름', price: '가격', imageUrl: '/images/상품이미지.jpg', link: '상품링크' },
];

// 홈 페이지나 다른 컴포넌트에서 필요한 경우 추가적인 데이터를 export 할 수 있습니다.
// 예를 들어, 특정 카테고리의 상품만 필터링하는 함수 등