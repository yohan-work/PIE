// global-setup.js
async function globalSetup(config) {
  console.log('🎭 Playwright 글로벌 설정 시작...');
  
  // 브라우저 설정이나 전역 상태 초기화
  const { chromium } = require('@playwright/test');
  
  try {
    // 테스트 전 웹 서버 확인
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // 기본 페이지 로드 확인
    await page.goto(config.use.baseURL || 'http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ 웹 서버 연결 확인됨');
    
    await browser.close();
    
  } catch (error) {
    console.error('❌ 글로벌 설정 실패:', error.message);
    throw error;
  }
  
  console.log('🎭 Playwright 글로벌 설정 완료');
}

module.exports = globalSetup; 