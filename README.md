# 🚀 PIE 자동화 테스트 프로젝트

Git 커밋부터 접근성 리포트까지 자동화된 워크플로우를 구현한 데모 프로젝트입니다.

## 프로젝트 개요

이 프로젝트는 다음과 같은 자동화 흐름을 구현합니다:

```
Git Commit → GitHub Actions → Preview 배포 → 스냅샷 테스트 → 접근성 리포트 → PR 코멘트
```

### 주요 기능

- **코드 품질 검사**: HTML, CSS 린팅 및 포맷팅 검증
- **접근성 테스트**: axe-core와 Pa11y를 이용한 자동 접근성 검증
- **스냅샷 테스트**: Playwright를 이용한 UI 변경 감지
- **성능 테스트**: Lighthouse를 이용한 웹 성능 측정
- **자동 배포**: Vercel을 통한 미리보기 및 프로덕션 배포
- **종합 리포트**: HTML 형식의 시각적 테스트 결과 리포트

### 테스트 & 자동화

- **Playwright**: 스냅샷 테스트 및 E2E 테스트
- **axe-core**: 접근성 자동 테스트
- **Pa11y**: 추가 접근성 검증
- **Lighthouse**: 성능, SEO, 모범사례 측정
- **GitHub Actions**: CI/CD 파이프라인

### 코드 품질

- **Prettier**: 코드 포맷팅
- **Stylelint**: CSS 린팅
- **HTMLHint**: HTML 검증

## 빠른 시작

### 1. 프로젝트 클론

```bash
git clone https://github.com/your-username/pie-automation-project.git
cd pie-automation-project
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm start
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 📝 사용 가능한 명령어

### 개발

```bash
npm start          # 개발 서버 시작
npm run serve      # 프로덕션 서버 시작
npm run build      # 프로덕션 빌드
```

### 테스트

```bash
npm test           # 모든 테스트 실행
npm run test:a11y  # 접근성 테스트
npm run test:visual # 스냅샷 테스트
npm run test:lighthouse # 성능 테스트
```

### 코드 품질

```bash
npm run validate   # HTML/CSS 린팅
npm run format     # 코드 포맷팅
npm run lint:html  # HTML 검증
npm run lint:css   # CSS 린팅
```

### 배포

```bash
npm run deploy:vercel  # Vercel 배포
npm run deploy:netlify # Netlify 배포
```

### 리포트

```bash
npm run report:generate # 종합 리포트 생성
```

## 자동화 워크플로우

### GitHub Actions 파이프라인

프로젝트는 다음과 같은 자동화된 워크플로우를 제공합니다:

#### 1. 코드 품질 검사

- HTML, CSS 린팅
- 코드 포맷팅 검증
- 문법 오류 체크

#### 2. 접근성 테스트

- **axe-core**: WCAG 가이드라인 준수 검증
- **Pa11y**: 추가 접근성 이슈 탐지
- 자동 리포트 생성

#### 3. 스냅샷 테스트

- **Playwright**: 다중 브라우저 지원
- UI 변경사항 감지
- 반응형 디자인 검증

#### 4. 성능 테스트

- **Lighthouse**: 성능, 접근성, SEO 점수 측정
- 모범사례 준수 검증
- PWA 기능 평가

#### 5. 자동 배포

- **미리보기**: PR별 자동 배포
- **프로덕션**: main 브랜치 자동 배포
- 배포 URL PR 코멘트 자동 등록

#### 6. 리포트 생성

- JSON/HTML 형식 종합 리포트
- 시각적 대시보드
- 개선 권장사항 제공

## 테스트 리포트

테스트 실행 후 다음 파일들이 생성됩니다:

- `test-report.html`: 시각적 종합 리포트
- `test-report.json`: 원시 데이터 리포트
- `pa11y-report.json`: 접근성 테스트 상세 결과
- `axe-report.json`: axe-core 테스트 결과
- `lighthouse-report.json`: 성능 테스트 결과

## 설정

### GitHub Secrets

Vercel 배포를 위해 다음 Secrets을 설정하세요:

```
VERCEL_TOKEN: Vercel 개인 액세스 토큰
VERCEL_ORG_ID: Vercel 조직 ID
VERCEL_PROJECT_ID: Vercel 프로젝트 ID
```

### 환경 변수

```env
NODE_ENV=production
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

## 🏗️ 프로젝트 구조

```
PIE/
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions 워크플로우
├── scripts/
│   └── generate-report.js      # 리포트 생성 스크립트
├── styles/
│   └── main.css               # 메인 스타일시트
├── scripts/
│   └── main.js                # 메인 JavaScript
├── tests/
│   ├── global-setup.js        # Playwright 글로벌 설정
│   └── visual.spec.js         # 스냅샷 테스트
├── index.html                 # 메인 HTML 파일
├── package.json               # 프로젝트 설정
├── playwright.config.js       # Playwright 설정
├── vercel.json               # Vercel 배포 설정
├── .stylelintrc.json         # Stylelint 설정
├── .prettierrc.json          # Prettier 설정
└── .htmlhintrc               # HTMLHint 설정
```

## 🔧 개발 가이드

### 새로운 테스트 추가

#### 스냅샷 테스트

```javascript
test('새로운 컴포넌트 스크린샷', async ({ page }) => {
  const component = page.locator('.new-component');
  await expect(component).toHaveScreenshot('new-component.png');
});
```

#### 접근성 테스트

```bash
# 새로운 페이지 접근성 테스트
npx pa11y http://localhost:3000/new-page --reporter json
```

### 커스텀 리포트 필드 추가

`scripts/generate-report.js`를 수정하여 새로운 메트릭을 추가할 수 있습니다.

## 📈 성능 최적화

### 현재 구현된 최적화

- CSS 변수를 이용한 테마 관리
- 반응형 이미지 로딩
- 접근성 중심 마크업
- 모션 감소 설정 지원

### 추가 개선 가능 영역

- 이미지 lazy loading
- 서비스 워커 구현
- 코드 분할 및 번들 최적화

프로젝트에 대한 질문이나 이슈가 있으시면:

- [Issues](https://github.com/yohan-work/PIE/issues)에 문제를 보고해주세요
