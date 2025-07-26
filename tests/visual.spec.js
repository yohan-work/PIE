// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('📸 Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 모든 테스트 전에 기본 페이지로 이동
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 애니메이션 비활성화
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    });
  });

  test('홈페이지 전체 스크린샷', async ({ page }) => {
    // 페이지 로딩 완료 대기
    await page.waitForSelector('main');
    await page.waitForTimeout(1000); // 추가 대기

    // 전체 페이지 스크린샷
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('헤더 섹션 스크린샷', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toHaveScreenshot('header-section.png');
  });

  test('히어로 섹션 스크린샷', async ({ page }) => {
    const heroSection = page.locator('.hero');
    await expect(heroSection).toHaveScreenshot('hero-section.png');
  });

  test('기능 카드 그리드 스크린샷', async ({ page }) => {
    const featuresGrid = page.locator('.features-grid');
    await expect(featuresGrid).toHaveScreenshot('features-grid.png');
  });

  test('폼 섹션 스크린샷', async ({ page }) => {
    const formSection = page.locator('.demo-form');
    await expect(formSection).toHaveScreenshot('form-section.png');
  });

  test('다크모드 토글 테스트', async ({ page }) => {
    // 라이트모드 스크린샷
    await expect(page).toHaveScreenshot('homepage-light-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });

    // 다크모드로 전환
    await page.click('.theme-toggle');
    await page.waitForTimeout(500);

    // 다크모드 스크린샷
    await expect(page).toHaveScreenshot('homepage-dark-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('버튼 호버 상태', async ({ page }) => {
    const primaryButton = page.locator('.btn-primary').first();

    // 기본 상태
    await expect(primaryButton).toHaveScreenshot('button-primary-default.png');

    // 호버 상태
    await primaryButton.hover();
    await page.waitForTimeout(200);
    await expect(primaryButton).toHaveScreenshot('button-primary-hover.png');
  });

  test('폼 검증 상태', async ({ page }) => {
    const usernameInput = page.locator('#username');
    const form = page.locator('.demo-form');

    // 기본 상태
    await expect(form).toHaveScreenshot('form-default.png');

    // 에러 상태 (빈 값으로 submit)
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    await expect(form).toHaveScreenshot('form-error.png');

    // 성공 상태
    await usernameInput.fill('testuser123');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#message').fill('테스트 메시지입니다.');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    await expect(form).toHaveScreenshot('form-success.png');
  });

  test('모바일 뷰포트 스크린샷', async ({ page }) => {
    // 모바일 크기로 변경
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('태블릿 뷰포트 스크린샷', async ({ page }) => {
    // 태블릿 크기로 변경
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('네비게이션 활성 상태', async ({ page }) => {
    const nav = page.locator('nav');

    // 기본 상태
    await expect(nav).toHaveScreenshot('nav-default.png');

    // 링크 클릭 후 활성 상태
    await page.click('a[href="#about"]');
    await page.waitForTimeout(1000);
    await expect(nav).toHaveScreenshot('nav-about-active.png');
  });

  test('스크롤 애니메이션 확인', async ({ page }) => {
    // 스크롤 전 상태
    const featureCards = page.locator('.feature-card');
    await expect(featureCards.first()).toHaveScreenshot(
      'feature-card-before-scroll.png'
    );

    // 스크롤하여 애니메이션 트리거
    await page.locator('#about').scrollIntoView();
    await page.waitForTimeout(1000);

    // 스크롤 후 상태
    await expect(featureCards.first()).toHaveScreenshot(
      'feature-card-after-scroll.png'
    );
  });

  test('알림 메시지 표시', async ({ page }) => {
    // 성공 알림 트리거
    await page.locator('#username').fill('testuser');
    await page.locator('#email').fill('test@example.com');
    await page.click('button[type="submit"]');

    // 알림이 나타날 때까지 대기
    await page.waitForSelector('.notification', { timeout: 5000 });
    await page.waitForTimeout(500);

    // 알림이 있는 상태의 스크린샷
    await expect(page).toHaveScreenshot('notification-visible.png');
  });

  test('인쇄 스타일 확인', async ({ page }) => {
    // 인쇄 미디어 쿼리 에뮬레이션
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('homepage-print.png', {
      fullPage: true,
    });
  });

  test('포커스 상태 확인', async ({ page }) => {
    // 키보드 네비게이션으로 포커스 이동
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    // 첫 번째 포커스 가능한 요소 스크린샷
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveScreenshot('focused-element.png');
  });
});

test.describe('📄 About 페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about.html');
    await page.waitForLoadState('networkidle');

    // 애니메이션 비활성화
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    });
  });

  test('About 페이지 전체 스크린샷', async ({ page }) => {
    await page.waitForSelector('.about-hero');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('about-page-full.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('히어로 섹션 스크린샷', async ({ page }) => {
    const heroSection = page.locator('.about-hero');
    await expect(heroSection).toHaveScreenshot('about-hero-section.png');
  });

  test('통계 카드 그리드', async ({ page }) => {
    const statsGrid = page.locator('.stats-grid');
    await expect(statsGrid).toHaveScreenshot('stats-grid.png');
  });

  test('타임라인 섹션', async ({ page }) => {
    const timeline = page.locator('.timeline');
    await expect(timeline).toHaveScreenshot('timeline-section.png');
  });

  test('접근성 테스트 폼', async ({ page }) => {
    const testForm = page.locator('.accessibility-test').first();
    await expect(testForm).toHaveScreenshot('accessibility-test-form.png');
  });

  test('폼 제출 테스트', async ({ page }) => {
    // 폼 입력
    await page.locator('#test-name').fill('테스트 사용자');
    await page.locator('#test-feedback').fill('자동화 테스트가 잘 작동합니다!');
    await page.locator('input[value="playwright"]').check();

    // 폼 제출 후 스크린샷
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);

    // 알림 확인 (alert가 나타날 것임)
    await expect(page).toHaveScreenshot('form-submitted.png');
  });

  test('네비게이션 링크 테스트', async ({ page }) => {
    const nav = page.locator('nav');

    // About 페이지에서의 네비게이션 상태
    await expect(nav).toHaveScreenshot('about-nav.png');

    // 홈 링크 클릭 테스트
    await page.click('a[href="index.html"]');
    await page.waitForLoadState('networkidle');

    // 홈 페이지로 이동했는지 확인
    expect(page.url()).toContain('index.html');
  });
});

test.describe('🔍 Cross-browser Compatibility', () => {
  test('기본 레이아웃 일관성', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 브라우저별 스크린샷
    await expect(page).toHaveScreenshot(`homepage-${browserName}.png`, {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('버튼 렌더링 일관성', async ({ page, browserName }) => {
    const buttons = page.locator('.btn');

    for (let i = 0; i < (await buttons.count()); i++) {
      await expect(buttons.nth(i)).toHaveScreenshot(
        `button-${i}-${browserName}.png`
      );
    }
  });
});
