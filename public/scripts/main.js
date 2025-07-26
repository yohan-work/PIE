// PIE 프로젝트 메인 스크립트
(function () {
  "use strict";

  // DOM 요소들
  const themeToggle = document.querySelector(".theme-toggle");
  const form = document.querySelector(".demo-form");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const messageTextarea = document.getElementById("message");

  // 초기화
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initNavigation();
    initForm();
    initScrollEffects();
    addSkipLink();
  });

  // 스킵 링크 추가 (접근성)
  function addSkipLink() {
    const skipLink = document.createElement("a");
    skipLink.href = "#main";
    skipLink.className = "skip-link";
    skipLink.textContent = "메인 콘텐츠로 건너뛰기";
    skipLink.addEventListener("click", function (e) {
      e.preventDefault();
      const main = document.querySelector("main");
      if (main) {
        main.focus();
        main.scrollIntoView();
      }
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // 테마 관리
  function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "라이트모드로 변경" : "다크모드로 변경"
      );
    }
    localStorage.setItem("theme", theme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  }

  // 네비게이션 관리
  function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          smoothScrollTo(targetElement);
          updateActiveNavLink(this);
        }
      });
    });

    // 스크롤 시 활성 네비게이션 업데이트
    window.addEventListener("scroll", debounce(updateNavOnScroll, 100));
  }

  function smoothScrollTo(element) {
    const headerHeight = document.querySelector("header").offsetHeight;
    const targetPosition = element.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }

  function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll(".nav-menu a");
    navLinks.forEach((link) => {
      link.removeAttribute("aria-current");
    });
    activeLink.setAttribute("aria-current", "page");
  }

  function updateNavOnScroll() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        const correspondingLink = document.querySelector(
          `.nav-menu a[href="#${sectionId}"]`
        );
        if (correspondingLink) {
          updateActiveNavLink(correspondingLink);
        }
      }
    });
  }

  // 폼 관리
  function initForm() {
    if (!form) return;

    // 실시간 검증
    if (usernameInput) {
      usernameInput.addEventListener("input", validateUsername);
      usernameInput.addEventListener("blur", validateUsername);
    }

    if (emailInput) {
      emailInput.addEventListener("input", validateEmail);
      emailInput.addEventListener("blur", validateEmail);
    }

    // 폼 제출
    form.addEventListener("submit", handleFormSubmit);
  }

  function validateUsername() {
    const value = usernameInput.value.trim();
    const isValid = value.length >= 3;

    updateFieldValidation(
      usernameInput,
      isValid,
      isValid ? "" : "사용자명은 3자 이상이어야 합니다."
    );

    return isValid;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = value === "" || emailRegex.test(value);

    updateFieldValidation(
      emailInput,
      isValid,
      isValid ? "" : "올바른 이메일 형식을 입력해주세요."
    );

    return isValid;
  }

  function updateFieldValidation(field, isValid, errorMessage) {
    const formGroup = field.closest(".form-group");
    const helpText = formGroup.querySelector("small");

    field.setAttribute("aria-invalid", !isValid);

    if (!isValid && errorMessage) {
      field.style.borderColor = "var(--error-color)";
      if (helpText) {
        helpText.textContent = errorMessage;
        helpText.style.color = "var(--error-color)";
      }
    } else {
      field.style.borderColor = "";
      if (helpText) {
        helpText.style.color = "";
        if (field.id === "username") {
          helpText.textContent = "3자 이상 입력해주세요";
        } else if (field.id === "email") {
          helpText.textContent = "예: user@example.com";
        }
      }
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();

    if (isUsernameValid && isEmailValid) {
      showFormSuccess();
      resetForm();
    } else {
      showFormError();
    }
  }

  function showFormSuccess() {
    showNotification("폼이 성공적으로 제출되었습니다!", "success");
  }

  function showFormError() {
    showNotification("폼 검증에 실패했습니다. 다시 확인해주세요.", "error");
  }

  function resetForm() {
    form.reset();
    const fields = form.querySelectorAll("input, textarea");
    fields.forEach((field) => {
      field.style.borderColor = "";
      field.removeAttribute("aria-invalid");
    });
  }

  // 알림 메시지
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "polite");
    notification.textContent = message;

    // 스타일 추가
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "16px 24px",
      borderRadius: "8px",
      color: "white",
      fontWeight: "500",
      zIndex: "1000",
      opacity: "0",
      transform: "translateY(-20px)",
      transition: "all 0.3s ease",
      backgroundColor:
        type === "success" ? "var(--success-color)" : "var(--error-color)",
    });

    document.body.appendChild(notification);

    // 애니메이션
    requestAnimationFrame(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    });

    // 자동 제거
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-20px)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // 스크롤 효과
  function initScrollEffects() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // 애니메이션할 요소들
    const animateElements = document.querySelectorAll(
      ".feature-card, .demo-form"
    );
    animateElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }

  // 버튼 상호작용
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      if (this.textContent.includes("시작하기")) {
        e.preventDefault();
        const featuresSection = document.getElementById("features");
        if (featuresSection) {
          smoothScrollTo(featuresSection);
        }
      } else if (this.textContent.includes("더 알아보기")) {
        e.preventDefault();
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          smoothScrollTo(aboutSection);
        }
      }
    });
  });

  // 유틸리티 함수
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 키보드 네비게이션 개선
  document.addEventListener("keydown", function (e) {
    // Escape 키로 모달이나 알림 닫기
    if (e.key === "Escape") {
      const notifications = document.querySelectorAll(".notification");
      notifications.forEach((notification) => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      });
    }
  });

  // 터치 디바이스 지원
  let touchStartY = 0;
  document.addEventListener(
    "touchstart",
    function (e) {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    function (e) {
      const touchY = e.touches[0].clientY;
      const touchDiff = touchStartY - touchY;

      // 스크롤 방향에 따른 헤더 숨김/표시 (모바일)
      const header = document.querySelector("header");
      if (Math.abs(touchDiff) > 5) {
        if (touchDiff > 0 && window.scrollY > 100) {
          header.style.transform = "translateY(-100%)";
        } else {
          header.style.transform = "translateY(0)";
        }
      }
    },
    { passive: true }
  );

  // 성능 최적화: 이미지 지연 로딩
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // 접근성 향상: 포커스 관리
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function trapFocus(element) {
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // 전역 객체에 유용한 함수들 노출
  window.PIE = {
    setTheme,
    showNotification,
    smoothScrollTo,
  };
})();
