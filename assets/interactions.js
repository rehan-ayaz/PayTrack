(function () {
  function initFaqHover() {
    var faqItems = document.querySelectorAll(".pt-faq-item");
    var hoverTimer = null;
    faqItems.forEach(function (item) {
      var btn = item.querySelector('[data-faq-q]');
      if (!btn) return;
      item.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () {
          if (btn.getAttribute('aria-expanded') !== 'true') {
            btn.click();
          }
        }, 40);
      });
      item.addEventListener('mouseleave', function () {
        clearTimeout(hoverTimer);
      });
    });
  }
  function initInteractiveSlider() {
    var slider = document.getElementById('demoSlider') || document.querySelector(".pt-how-slider");
    if (!slider) return;
    var fillEl = slider.querySelector('i');
    var thumbEl = slider.querySelector('b');
    var artContainer = slider.closest(".pt-how-art") || slider;
    var pill = document.getElementById('demoPaymentPill') || artContainer.querySelector(".pt-ui-pill");
    var payLabel = document.getElementById('demoPayLabel') || artContainer.querySelector(".pt-how-split span:first-child");
    var recLabel = document.getElementById('demoRecLabel') || artContainer.querySelectorAll(".pt-how-split span")[1];
    var currentPct = 40;
    var isDragging = false;
    var userInteracted = false;
    function calculateAmount(pct) {
      if (pct <= 0) return 0;
      var raw;
      if (pct <= 40) {
        raw = pct / 40 * 7020;
      } else {
        raw = 7020 + (pct - 40) / 60 * (20000 - 7020);
      }
      var rounded = Math.round(raw / 10) * 10;
      if (Math.abs(pct - 40) < 1.2) rounded = 7020;
      return rounded;
    }
    function applyPercent(pct, fromUser) {
      pct = Math.max(0, Math.min(100, pct));
      currentPct = pct;
      if (fromUser) userInteracted = true;
      slider.style.setProperty('--fill', pct + '%');
      if (fillEl) {
        fillEl.style.width = pct + '%';
        fillEl.style.transform = 'none';
      }
      if (thumbEl) {
        thumbEl.style.left = pct + '%';
      }
      var amount = calculateAmount(pct);
      slider.setAttribute('aria-valuenow', amount);
      if (pill) {
        pill.textContent = 'Payment · Rs. ' + amount.toLocaleString('en-US');
      }
      if (payLabel) {
        var payK = Math.max(0, Math.round(amount / 1000));
        payLabel.textContent = 'Pay Rs. ' + payK + 'k';
      }
      if (recLabel) {
        if (pct > 75) {
          var recVal = Math.round((pct - 75) / 25 * 5000 / 10) * 10;
          recLabel.textContent = 'Rec Rs. ' + Math.round(recVal / 1000) + 'k';
        } else {
          recLabel.textContent = 'Rec Rs. 0';
        }
      }
    }
    function getPctFromEvent(e) {
      var rect = slider.getBoundingClientRect();
      var clientX = e.clientX;
      if (clientX === undefined && e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
      }
      if (clientX === undefined) return currentPct;
      var x = clientX - rect.left;
      return x / rect.width * 100;
    }
    slider.addEventListener('pointerdown', function (e) {
      isDragging = true;
      slider.classList.add("pt-is-dragging");
      try {
        slider.setPointerCapture(e.pointerId);
      } catch (err) {}
      applyPercent(getPctFromEvent(e), true);
    });
    slider.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      applyPercent(getPctFromEvent(e), true);
    });
    function stopDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      slider.classList.remove("pt-is-dragging");
      try {
        if (e && e.pointerId !== undefined) {
          slider.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}
    }
    slider.addEventListener('pointerup', stopDrag);
    slider.addEventListener('pointercancel', stopDrag);

    // Mouse wheel scrolling directly over the slider / art card
    artContainer.addEventListener('wheel', function (e) {
      var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta !== 0) {
        var step = delta > 0 ? 3.5 : -3.5;
        applyPercent(currentPct + step, true);
      }
    }, {
      passive: true
    });

    // Keyboard navigation
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        applyPercent(currentPct + 5, true);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        applyPercent(currentPct - 5, true);
      } else if (e.key === 'Home') {
        e.preventDefault();
        applyPercent(0, true);
      } else if (e.key === 'End') {
        e.preventDefault();
        applyPercent(100, true);
      }
    });

    // Page Scroll updating
    function onScroll() {
      if (userInteracted) return;
      var rect = artContainer.getBoundingClientRect();
      var windowH = window.innerHeight || document.documentElement.clientHeight;
      var progress = (windowH - rect.top) / (windowH + rect.height);
      if (progress >= 0.15 && progress <= 0.85) {
        var clamped = Math.max(0, Math.min(1, (progress - 0.2) / 0.45));
        var targetPct = 12 + clamped * (40 - 12);
        applyPercent(targetPct, false);
      }
    }
    window.addEventListener('scroll', onScroll, {
      passive: true
    });

    // Initial setup
    applyPercent(40, false);
  }
  function initAll() {
    initFaqHover();
    initInteractiveSlider();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
