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

if (sliders) {
  sliders.forEach(slider => {
    const wrapper = slider.querySelector('.block-gallery__wrapper');
    const slides = slider.querySelectorAll('.block-gallery__slide');

    if (!wrapper || slides.length === 0) return;

    let position = 0;
    let animationId;
    const speed = 0.3;
    let isPaused = false;
    let isAnimating = false;
    let isDesktop = window.innerWidth >= 769;

    function cloneSlides() {
      const cloneCount = 4;
      for (let i = 0; i < cloneCount; i++) {
        slides.forEach(slide => {
          const clone = slide.cloneNode(true);
          wrapper.appendChild(clone);
        });
      }
    }

    function removeClones() {
      const allSlides = slider.querySelectorAll('.block-gallery__slide');
      allSlides.forEach((slide, index) => {
        if (index >= slides.length) {
          slide.remove();
        }
      });
      position = 0;
      if (isDesktop) {
        wrapper.style.transform = `translateY(0px)`;
      } else {
        wrapper.style.transform = `translateX(0px)`;
      }
    }

    function animate() {
      if (!isAnimating) return;

      if (!isPaused) {
        if (isDesktop) {
          position -= speed;
        } else {
          position -= speed;
        }

        const totalSize = isDesktop ? wrapper.scrollHeight : wrapper.scrollWidth;
        if (Math.abs(position) >= totalSize / 2) {
          position = 0;
        }

        if (isDesktop) {
          wrapper.style.transform = `translateY(${position}px)`;
        } else {
          wrapper.style.transform = `translateX(${position}px)`;
        }
      }
      animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (isAnimating) return;

      isDesktop = window.innerWidth >= 769;

      removeClones();
      cloneSlides();

      isAnimating = true;

      const allSlides = slider.querySelectorAll('.block-gallery__slide');
      allSlides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
          isPaused = true;
        });

        slide.addEventListener('mouseleave', () => {
          isPaused = false;
        });
      });

      animate();
    }

    function stopAnimation() {
      isAnimating = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      removeClones();
      const allSlides = slider.querySelectorAll('.block-gallery__slide');
      allSlides.forEach(slide => {
        slide.removeEventListener('mouseenter', () => { });
        slide.removeEventListener('mouseleave', () => { });
      });
      isPaused = false;
    }

    function shouldAnimate() {
      return slides.length > 1;
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

      if (shouldAnimate()) {
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

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        checkAndToggle();
      }, 250);
    });
  });
}

//========================================================================================================================================================

Fancybox.bind("[data-fancybox]", {
  // опции
});