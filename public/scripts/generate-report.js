#!/usr/bin/env node

/**
 * 📊 종합 테스트 리포트 생성기
 * 
 * 접근성, 성능, 스냅샷 테스트 결과를 수집하여
 * 종합적인 리포트를 생성합니다.
 */

const fs = require('fs');
const path = require('path');

// 리포트 데이터 수집
function collectReports() {
  const reports = {
    timestamp: new Date().toISOString(),
    metadata: {
      project: 'PIE Automation Project',
      version: '1.0.0',
      commit: process.env.GITHUB_SHA || 'local',
      branch: process.env.GITHUB_REF_NAME || 'local',
      workflow: process.env.GITHUB_WORKFLOW || 'manual'
    },
    results: {}
  };

  // 접근성 테스트 결과 수집
  try {
    // Pa11y 리포트
    if (fs.existsSync('pa11y-report.json')) {
      const pa11yData = JSON.parse(fs.readFileSync('pa11y-report.json', 'utf8'));
      reports.results.pa11y = {
        issues: Array.isArray(pa11yData) ? pa11yData.length : 0,
        details: pa11yData
      };
    }

    // Axe 리포트
    if (fs.existsSync('axe-report.json')) {
      const axeData = JSON.parse(fs.readFileSync('axe-report.json', 'utf8'));
      reports.results.axe = {
        violations: axeData.violations ? axeData.violations.length : 0,
        passes: axeData.passes ? axeData.passes.length : 0,
        incomplete: axeData.incomplete ? axeData.incomplete.length : 0,
        details: axeData
      };
    }
  } catch (error) {
    console.warn('⚠️  접근성 리포트 수집 실패:', error.message);
  }

  // Lighthouse 성능 테스트 결과 수집
  try {
    if (fs.existsSync('lighthouse-report.json')) {
      const lighthouseData = JSON.parse(fs.readFileSync('lighthouse-report.json', 'utf8'));
      const categories = lighthouseData.categories;
      
      reports.results.lighthouse = {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100),
        pwa: categories.pwa ? Math.round(categories.pwa.score * 100) : null,
        details: lighthouseData
      };
    }
  } catch (error) {
    console.warn('⚠️  Lighthouse 리포트 수집 실패:', error.message);
  }

  // Playwright 테스트 결과 수집
  try {
    if (fs.existsSync('test-results/results.json')) {
      const playwrightData = JSON.parse(fs.readFileSync('test-results/results.json', 'utf8'));
      reports.results.playwright = {
        passed: playwrightData.stats?.passed || 0,
        failed: playwrightData.stats?.failed || 0,
        flaky: playwrightData.stats?.flaky || 0,
        skipped: playwrightData.stats?.skipped || 0,
        duration: playwrightData.stats?.duration || 0,
        details: playwrightData
      };
    }
  } catch (error) {
    console.warn('⚠️  Playwright 리포트 수집 실패:', error.message);
  }

  return reports;
}

// HTML 리포트 생성
function generateHTMLReport(data) {
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PIE 프로젝트 - 테스트 리포트</title>
    <style>
        :root {
            --primary-color: #4A90E2;
            --success-color: #28a745;
            --warning-color: #ffc107;
            --danger-color: #dc3545;
            --light-bg: #f8f9fa;
            --border-color: #e1e5e9;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: var(--light-bg);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        header {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        h1 { color: var(--primary-color); margin-bottom: 1rem; }
        h2 { color: #333; margin: 2rem 0 1rem; }
        h3 { color: #555; margin: 1rem 0 0.5rem; }
        
        .metadata {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .metadata-item {
            background: var(--light-bg);
            padding: 1rem;
            border-radius: 4px;
            border-left: 4px solid var(--primary-color);
        }
        
        .metadata-item strong {
            display: block;
            color: var(--primary-color);
            font-size: 0.9rem;
        }
        
        .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .result-card {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .score {
            font-size: 2rem;
            font-weight: bold;
            margin: 0.5rem 0;
        }
        
        .score.good { color: var(--success-color); }
        .score.warning { color: var(--warning-color); }
        .score.bad { color: var(--danger-color); }
        
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .metric {
            text-align: center;
            padding: 1rem;
            background: var(--light-bg);
            border-radius: 4px;
        }
        
        .metric-value {
            font-size: 1.5rem;
            font-weight: bold;
            display: block;
        }
        
        .metric-label {
            font-size: 0.8rem;
            color: #666;
            text-transform: uppercase;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-pass { background: var(--success-color); color: white; }
        .status-fail { background: var(--danger-color); color: white; }
        .status-warn { background: var(--warning-color); color: black; }
        
        .summary {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-top: 2rem;
        }
        
        .timestamp {
            color: #666;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .container { padding: 1rem; }
            .results-grid { grid-template-columns: 1fr; }
            .metadata { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📊 PIE 프로젝트 테스트 리포트</h1>
            <p class="timestamp">생성 시간: ${new Date(data.timestamp).toLocaleString('ko-KR')}</p>
            
            <div class="metadata">
                <div class="metadata-item">
                    <strong>프로젝트</strong>
                    ${data.metadata.project}
                </div>
                <div class="metadata-item">
                    <strong>버전</strong>
                    ${data.metadata.version}
                </div>
                <div class="metadata-item">
                    <strong>커밋</strong>
                    ${data.metadata.commit.substring(0, 8)}
                </div>
                <div class="metadata-item">
                    <strong>브랜치</strong>
                    ${data.metadata.branch}
                </div>
            </div>
        </header>

        <div class="results-grid">
            ${generateAccessibilityCard(data.results)}
            ${generatePerformanceCard(data.results)}
            ${generateVisualCard(data.results)}
        </div>

        <div class="summary">
            <h2>📋 종합 요약</h2>
            ${generateSummary(data.results)}
        </div>
    </div>
</body>
</html>`;

  return html;
}

function generateAccessibilityCard(results) {
  const axe = results.axe || {};
  const pa11y = results.pa11y || {};
  
  const totalIssues = (axe.violations || 0) + (pa11y.issues || 0);
  const scoreClass = totalIssues === 0 ? 'good' : totalIssues < 5 ? 'warning' : 'bad';
  const status = totalIssues === 0 ? 'pass' : 'fail';
  
  return `
    <div class="result-card">
        <h3>♿ 접근성 테스트</h3>
        <span class="status-badge status-${status}">
            ${totalIssues === 0 ? '통과' : '실패'}
        </span>
        <div class="score ${scoreClass}">
            ${totalIssues} 이슈
        </div>
        <div class="metrics">
            <div class="metric">
                <span class="metric-value">${axe.violations || 0}</span>
                <span class="metric-label">Axe 위반</span>
            </div>
            <div class="metric">
                <span class="metric-value">${pa11y.issues || 0}</span>
                <span class="metric-label">Pa11y 이슈</span>
            </div>
            <div class="metric">
                <span class="metric-value">${axe.passes || 0}</span>
                <span class="metric-label">통과</span>
            </div>
        </div>
    </div>
  `;
}

function generatePerformanceCard(results) {
  const lighthouse = results.lighthouse || {};
  const avgScore = lighthouse.performance ? 
    Math.round((lighthouse.performance + lighthouse.accessibility + lighthouse.bestPractices + lighthouse.seo) / 4) : 0;
  
  const scoreClass = avgScore >= 90 ? 'good' : avgScore >= 70 ? 'warning' : 'bad';
  
  return `
    <div class="result-card">
        <h3>⚡ 성능 테스트</h3>
        <span class="status-badge status-${avgScore >= 70 ? 'pass' : 'warn'}">
            ${avgScore >= 70 ? '양호' : '개선필요'}
        </span>
        <div class="score ${scoreClass}">
            ${avgScore}점
        </div>
        <div class="metrics">
            <div class="metric">
                <span class="metric-value">${lighthouse.performance || 0}</span>
                <span class="metric-label">성능</span>
            </div>
            <div class="metric">
                <span class="metric-value">${lighthouse.accessibility || 0}</span>
                <span class="metric-label">접근성</span>
            </div>
            <div class="metric">
                <span class="metric-value">${lighthouse.bestPractices || 0}</span>
                <span class="metric-label">모범사례</span>
            </div>
            <div class="metric">
                <span class="metric-value">${lighthouse.seo || 0}</span>
                <span class="metric-label">SEO</span>
            </div>
        </div>
    </div>
  `;
}

function generateVisualCard(results) {
  const playwright = results.playwright || {};
  const total = (playwright.passed || 0) + (playwright.failed || 0);
  const successRate = total > 0 ? Math.round((playwright.passed || 0) / total * 100) : 0;
  
  const scoreClass = successRate >= 95 ? 'good' : successRate >= 80 ? 'warning' : 'bad';
  const status = (playwright.failed || 0) === 0 ? 'pass' : 'fail';
  
  return `
    <div class="result-card">
        <h3>📸 스냅샷 테스트</h3>
        <span class="status-badge status-${status}">
            ${(playwright.failed || 0) === 0 ? '통과' : '실패'}
        </span>
        <div class="score ${scoreClass}">
            ${successRate}%
        </div>
        <div class="metrics">
            <div class="metric">
                <span class="metric-value">${playwright.passed || 0}</span>
                <span class="metric-label">통과</span>
            </div>
            <div class="metric">
                <span class="metric-value">${playwright.failed || 0}</span>
                <span class="metric-label">실패</span>
            </div>
            <div class="metric">
                <span class="metric-value">${playwright.flaky || 0}</span>
                <span class="metric-label">불안정</span>
            </div>
        </div>
    </div>
  `;
}

function generateSummary(results) {
  const issues = [];
  const recommendations = [];
  
  // 접근성 이슈 확인
  const totalA11yIssues = (results.axe?.violations || 0) + (results.pa11y?.issues || 0);
  if (totalA11yIssues > 0) {
    issues.push(`접근성 이슈 ${totalA11yIssues}개 발견`);
    recommendations.push('접근성 가이드라인 준수 필요');
  }
  
  // 성능 이슈 확인
  const performance = results.lighthouse?.performance || 0;
  if (performance < 70) {
    issues.push(`성능 점수가 낮음 (${performance}점)`);
    recommendations.push('이미지 최적화 및 코드 분할 고려');
  }
  
  // 스냅샷 테스트 실패 확인
  const visualFailed = results.playwright?.failed || 0;
  if (visualFailed > 0) {
    issues.push(`스냅샷 테스트 ${visualFailed}개 실패`);
    recommendations.push('UI 변경사항 검토 필요');
  }
  
  if (issues.length === 0) {
    return '<p style="color: var(--success-color); font-weight: bold;">🎉 모든 테스트가 성공적으로 통과했습니다!</p>';
  }
  
  return `
    <div style="margin-bottom: 1rem;">
        <h3 style="color: var(--danger-color);">발견된 이슈</h3>
        <ul>
            ${issues.map(issue => `<li>${issue}</li>`).join('')}
        </ul>
    </div>
    <div>
        <h3 style="color: var(--primary-color);">개선 권장사항</h3>
        <ul>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
  `;
}

// 메인 실행 함수
function main() {
  console.log('📊 테스트 리포트 생성 시작...');
  
  try {
    // 리포트 데이터 수집
    const reportData = collectReports();
    
    // JSON 리포트 생성
    fs.writeFileSync('test-report.json', JSON.stringify(reportData, null, 2));
    console.log('✅ JSON 리포트 생성 완료: test-report.json');
    
    // HTML 리포트 생성
    const htmlReport = generateHTMLReport(reportData);
    fs.writeFileSync('test-report.html', htmlReport);
    console.log('✅ HTML 리포트 생성 완료: test-report.html');
    
    // 콘솔 요약 출력
    console.log('\n📊 테스트 결과 요약');
    console.log('='.repeat(40));
    
    if (reportData.results.axe || reportData.results.pa11y) {
      const totalA11yIssues = (reportData.results.axe?.violations || 0) + (reportData.results.pa11y?.issues || 0);
      console.log(`♿ 접근성: ${totalA11yIssues}개 이슈`);
    }
    
    if (reportData.results.lighthouse) {
      const perf = reportData.results.lighthouse;
      console.log(`⚡ 성능: ${perf.performance}점 (접근성: ${perf.accessibility}, SEO: ${perf.seo})`);
    }
    
    if (reportData.results.playwright) {
      const visual = reportData.results.playwright;
      console.log(`📸 스냅샷: ${visual.passed}개 통과, ${visual.failed}개 실패`);
    }
    
    console.log('\n🎯 리포트 파일:');
    console.log('- test-report.json (JSON 형식)');
    console.log('- test-report.html (HTML 형식)');
    
  } catch (error) {
    console.error('❌ 리포트 생성 실패:', error.message);
    process.exit(1);
  }
}

// 스크립트 직접 실행 시에만 main 함수 호출
if (require.main === module) {
  main();
}

module.exports = { collectReports, generateHTMLReport }; 