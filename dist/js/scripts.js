const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout((() => {
      lockPaddingElements.forEach((lockPaddingElement => {
        lockPaddingElement.style.paddingRight = "";
      }));
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }), delay);
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    }));
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
function functions_FLS(message) {
  setTimeout((() => {
    if (window.FLS) console.log(message);
  }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item) {
    return item.dataset[dataSetValue];
  });

  if (media.length) {
    const breakpointsArray = media.map(item => {
      const params = item.dataset[dataSetValue];
      const paramsArray = params.split(",");
      return {
        value: paramsArray[0],
        type: paramsArray[1] ? paramsArray[1].trim() : "max",
        item: item
      };
    });

    const mdQueries = uniqArray(
      breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
    );

    const mdQueriesArray = mdQueries.map(breakpoint => {
      const [query, value, type] = breakpoint.split(",");
      const matchMedia = window.matchMedia(query);
      const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
      return { itemsArray, matchMedia };
    });

    return mdQueriesArray;
  }
}

function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

//========================================================================================================================================================

const iconMenu = document.querySelector('.header__burger');
const headerBody = document.querySelector('.header-menu__body');

if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    e.stopPropagation();

    document.documentElement.classList.toggle("menu-open");
  });
}

//========================================================================================================================================================

const sliders = document.querySelectorAll('.block-gallery__slider');

if (sliders.length) {
  sliders.forEach(slider => {
    const rows = slider.querySelectorAll('.block-gallery__row');
    const slides = slider.querySelectorAll('.block-gallery__slide');

    if (rows.length === 0 || slides.length === 0) return;

    let isDesktop = window.innerWidth >= 769;
    let isAnimating = false;
    let animationId = null;
    let isPaused = false;
    const speed = 0.3;
    let resizeTimeout = null;
    let lastTimestamp = 0;

    const rowStates = new Map();
    const rowHandlers = new Map();

    function getTotalSize(row) {
      return isDesktop ? row.scrollHeight : row.scrollWidth;
    }

    function getVisibleSize(row) {
      return isDesktop ? row.parentElement.clientHeight : row.parentElement.clientWidth;
    }

    function cloneSlidesInRow(row) {
      const cloneCount = 4;
      const originalSlides = row.querySelectorAll('.block-gallery__slide');
      const fragment = document.createDocumentFragment();
      const slidesArray = Array.from(originalSlides);

      for (let i = 0; i < cloneCount; i++) {
        slidesArray.forEach(slide => {
          const clone = slide.cloneNode(true);
          fragment.appendChild(clone);
        });
      }
      row.appendChild(fragment);
    }

    function removeClonesFromRow(row) {
      const allSlides = row.querySelectorAll('.block-gallery__slide');
      const originalCount = slides.length;

      for (let i = allSlides.length - 1; i >= originalCount; i--) {
        if (allSlides[i]) {
          allSlides[i].remove();
        }
      }

      if (rowStates.has(row)) {
        rowStates.set(row, 0);
      }

      resetRowTransform(row);
    }

    function resetRowTransform(row) {
      const position = rowStates.get(row) || 0;
      row.style.willChange = isDesktop ? 'transform' : 'transform';
      if (isDesktop) {
        row.style.transform = `translateY(${Math.round(position)}px)`;
      } else {
        row.style.transform = `translateX(${Math.round(position)}px)`;
      }
    }

    function animateRow(row, timestamp) {
      if (!isAnimating) return;

      if (!isPaused) {
        let position = rowStates.get(row) || 0;

        const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 16.67 : 1;
        const step = speed * Math.min(deltaTime, 2);

        position -= step;

        const totalSize = getTotalSize(row);
        const visibleSize = getVisibleSize(row);

        if (Math.abs(position) >= totalSize / 2) {
          position = 0;
        }

        rowStates.set(row, position);

        if (isDesktop) {
          row.style.transform = `translateY(${Math.round(position * 100) / 100}px)`;
        } else {
          row.style.transform = `translateX(${Math.round(position * 100) / 100}px)`;
        }

        row.style.transition = 'transform 0.05s linear';
      }
    }

    function animateAllRows(timestamp) {
      if (!isAnimating) return;

      if (timestamp) {
        rows.forEach(row => {
          animateRow(row, timestamp);
        });
        lastTimestamp = timestamp;
      }

      animationId = requestAnimationFrame(animateAllRows);
    }

    function setupRowHandlers(row) {
      if (rowHandlers.has(row)) {
        const oldHandlers = rowHandlers.get(row);
        const allSlides = row.querySelectorAll('.block-gallery__slide');
        allSlides.forEach(slide => {
          slide.removeEventListener('mouseenter', oldHandlers.enter);
          slide.removeEventListener('mouseleave', oldHandlers.leave);
        });
      }

      const enterHandler = () => {
        isPaused = true;
        row.style.transition = 'none';
      };

      const leaveHandler = () => {
        isPaused = false;
        row.style.transition = 'transform 0.05s linear';
      };

      rowHandlers.set(row, { enter: enterHandler, leave: leaveHandler });

      const allSlides = row.querySelectorAll('.block-gallery__slide');
      allSlides.forEach(slide => {
        slide.addEventListener('mouseenter', enterHandler);
        slide.addEventListener('mouseleave', leaveHandler);
      });
    }

    function startAnimation() {
      if (isAnimating) return;

      isDesktop = window.innerWidth >= 769;

      rows.forEach(row => {
        if (!rowStates.has(row)) {
          rowStates.set(row, 0);
        }

        row.style.willChange = 'transform';

        removeClonesFromRow(row);
        cloneSlidesInRow(row);
        setupRowHandlers(row);
      });

      isAnimating = true;
      lastTimestamp = 0;
      animateAllRows();
    }

    function stopAnimation() {
      isAnimating = false;

      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }

      rows.forEach(row => {
        if (rowHandlers.has(row)) {
          const handlers = rowHandlers.get(row);
          const allSlides = row.querySelectorAll('.block-gallery__slide');
          allSlides.forEach(slide => {
            slide.removeEventListener('mouseenter', handlers.enter);
            slide.removeEventListener('mouseleave', handlers.leave);
          });
          rowHandlers.delete(row);
        }

        row.style.willChange = 'auto';
        row.style.transition = 'none';

        removeClonesFromRow(row);
        rowStates.delete(row);
      });

      isPaused = false;
      lastTimestamp = 0;
    }

    function checkAndToggle() {
      const newIsDesktop = window.innerWidth >= 769;

      if (newIsDesktop !== isDesktop) {
        isDesktop = newIsDesktop;
        if (isAnimating) {
          stopAnimation();
          startAnimation();
          return;
        }
      }

      if (slides.length > 1) {
        if (!isAnimating) {
          startAnimation();
        }
      } else {
        if (isAnimating) {
          stopAnimation();
        }
      }
    }

    checkAndToggle();

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        checkAndToggle();
      }, 250);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isAnimating) {
        stopAnimation();
      } else if (!document.hidden && slides.length > 1 && !isAnimating) {
        startAnimation();
      }
    });
  });
}

//========================================================================================================================================================

Fancybox.bind("[data-fancybox]", {
  // опции
});

//========================================================================================================================================================

// Добавление к шапке при скролле
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      header.classList.add('_header-scroll');
      document.documentElement.classList.add('header-scroll');
    } else {
      header.classList.remove('_header-scroll');
      document.documentElement.classList.remove('header-scroll');
    }
  });
}