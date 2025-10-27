# 근육고양이 스튜디오 (MuscleCat Studio)

![스튜디오 로고](public/images/icon-512.png)

낭만 소프트웨어 개발 회사, 근육고양이 스튜디오의 공식 웹사이트 프로젝트입니다. 스튜디오에서 진행한 다양한 프로젝트 포트폴리오와 최신 소식, 판매 중인 굿즈 정보 등을 제공합니다.

## ✨ 주요 기능

* **포트폴리오:** 스튜디오에서 개발한 다양한 웹/앱 프로젝트 소개 ([`data/projects.js`](data/projects.js))
* **뉴스:** 스튜디오의 최신 소식 업데이트 (Firebase Firestore 연동) ([`app/news/page.js`](app/news/page.js))
* **굿즈:** 스튜디오 관련 상품 소개 및 구매 링크 연결 ([`data/goods.js`](data/goods.js), [`app/goods/page.js`](app/goods/page.js))
* **운세:** 매일 새로운 운세 제공 및 알림톡 신청 기능 ([`app/luck/page.js`](app/luck/page.js))
* **문의:** 연락처 정보 제공 ([`app/contact/page.js`](app/contact/page.js))
* **PWA 지원:** 프로그레시브 웹 앱(PWA)으로 설치하여 사용 가능 ([`next.config.mjs`](next.config.mjs), [`public/manifest.json`](public/manifest.json))

## 🛠️ 기술 스택

* **프레임워크:** [Next.js](https://nextjs.org/) (App Router)
* **스타일링:** CSS Modules
* **상태 관리:** [Zustand](https://github.com/pmndrs/zustand) ([`store/authStore.js`](store/authStore.js), [`store/modalStore.js`](store/modalStore.js))
* **백엔드/데이터베이스:** [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage) ([`lib/firebase/clientApp.js`](lib/firebase/clientApp.js))
* **이미지 처리:** Next.js Image Component, Canvas API (뉴스 이미지 업로드 시 AVIF 변환 및 리사이징) ([`app/news/page.js`](app/news/page.js))
* **슬라이더:** [Swiper](https://swiperjs.com/) ([`app/page.js`](app/page.js))
* **아이콘:** [React Icons](https://react-icons.github.io/react-icons/) ([`app/page.js`](app/page.js), [`app/contact/page.js`](app/contact/page.js))
* **PWA:** [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa) ([`next.config.mjs`](next.config.mjs))

([`package.json`](package.json) 참고)

## 🚀 시작하기

개발 서버를 시작하는 방법입니다.

1.  **저장소 복제:**
    ```bash
    git clone [https://github.com/cutiefunny/musclecat-studio.git](https://github.com/cutiefunny/musclecat-studio.git)
    cd musclecat-studio
    ```

2.  **의존성 설치:**
    ```bash
    npm install
    # 또는
    yarn install
    # 또는
    pnpm install
    # 또는
    bun install
    ```

3.  **환경 변수 설정:**
    Firebase 연동을 위해 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정해야 합니다. (`lib/firebase/clientApp.js` 참고)
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **개발 서버 실행:**
    ```bash
    npm run dev
    # 또는
    yarn dev
    # 또는
    pnpm dev
    # 또는
    bun dev
    ```

    [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인합니다.

## 🌐 배포

[Vercel](https://vercel.com/) 플랫폼을 사용하여 간편하게 Next.js 앱을 배포할 수 있습니다.

자세한 내용은 [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)을 참고하세요.

## 🤝 기여하기

피드백과 기여는 언제나 환영합니다! 이슈를 열거나 풀 리퀘스트를 보내주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.