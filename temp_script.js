// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // Pre-load Storage Data
  cart = getStoredList("lighthouse_cart");
  favorites = getStoredList("lighthouse_favorites");

  // Init features
  updateDeviceHints();
  handleScroll();
  setReservationDateRange();
  updateAvailableTimes();
  setupThemeToggle();
  setupIntersectionObserver();
  setupAutoScroll();
  setupReviews();
  setupOrderFeatures();
  handleCardFlip();
  initSkeletonLoaders();
  displayCategoryCount();
  updateOpenStatusBadge();
  setupSeatingMap();
  setupGiftCardCustomizer();
  setupVirtualSommelier();
  setupLoyaltyClub();

  // i18next Setup
  if (typeof i18next !== 'undefined' && typeof i18nextHttpBackend !== 'undefined' && typeof i18nextBrowserLanguageDetector !== 'undefined') {
    i18next
      .use(i18nextHttpBackend)
      .use(i18nextBrowserLanguageDetector)
      .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'hi', 'gu'],
        load: 'languageOnly',
        backend: { loadPath: './locales/{{lng}}/translation.json' },
        detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] }
      }, function (err, t) {
        if (err) return console.error(err);

        const activeLang = i18next.resolvedLanguage || 'en';
        const langSelector = document.querySelector('.language-select');
        if (langSelector) {
          langSelector.value = activeLang;
          langSelector.addEventListener('change', (e) => {
            i18next.changeLanguage(e.target.value, (err, t) => {
              if (err) return console.error(err);
              updateContent();
            });
          });
        }
        updateContent();
      });
  }

  // Bind loose event listeners
  if (dateInput) dateInput.addEventListener("change", updateAvailableTimes);
  if (guestsSelect) guestsSelect.addEventListener("change", updateAvailableTimes);
  if (navToggle) navToggle.addEventListener("click", toggleMobileMenu);
  if (reservationForm) reservationForm.addEventListener("submit", handleFormSubmit);

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMobileMenu();
  });

  navLinks.forEach((link) => link.addEventListener("click", smoothScroll));
  document.querySelectorAll(".nav-cta, .nav-cta-mobile, .hero-buttons a").forEach((link) => {
    link.addEventListener("click", smoothScroll);
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
      filterMenuItems(btn.dataset.filter, menuSearch ? menuSearch.value : '', getActiveDiet());
    });
  });

  dietBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      dietBtns.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
      filterMenuItems(getActiveFilter(), menuSearch ? menuSearch.value : '', btn.dataset.diet || btn.dataset.type);
    });
  });

  menuTabs.forEach(tab => tab.addEventListener('click', switchMenuTab));

  if (cuisineDropdown) {
    cuisineDropdown.addEventListener("change", () => {
      filterMenuItems(getActiveFilter(), menuSearch ? menuSearch.value : '', getActiveDiet());
    });
  }

  if (menuSearch) {
    menuSearch.addEventListener("input", () => {
      filterMenuItems(getActiveFilter(), menuSearch.value, getActiveDiet());
    });
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  const downloadMenuPDFBtn = document.getElementById("downloadMenuPDF");
  if (downloadMenuPDFBtn) {
    downloadMenuPDFBtn.addEventListener('click', async () => {
      try {
        showLoadingOverlay();
        await loadHtml2Pdf();
        const element = document.getElementById('menu');
        const opt = {
          margin: 10,
          filename: 'The_Lighthouse_Menu.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#1a1714' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).save();
      } catch (e) {
        console.error("PDF generation failed", e);
        alert("Could not generate PDF menu at this time.");
      } finally {
        hideLoadingOverlay();
      }
    });
  }

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (typeof attachSkeletonToSimpleImage === 'function') {
    const largeContainers = [
      document.querySelector('.hero-bg'),
      document.querySelector('.about-image'),
      document.querySelector('.reservation-bg'),
    ];
    largeContainers.forEach((c) => {
      if (c) attachSkeletonToSimpleImage(c, 360);
    });
  }
});
