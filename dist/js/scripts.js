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

//========================================================================================================================================================

//Звездный рейтинг
function formRating() {
  const ratings = document.querySelectorAll('[data-rating]');
  if (ratings) {
    ratings.forEach(rating => {
      const ratingValue = +rating.dataset.ratingValue;
      const ratingSize = +rating.dataset.ratingSize ? +rating.dataset.ratingSize : 5;
      formRatingInit(rating, ratingSize);
      ratingValue ? formRatingSet(rating, ratingValue) : null;
      document.addEventListener('click', formRatingAction);
    });
  }

  function formRatingAction(e) {
    const targetElement = e.target;
    if (targetElement.closest('.rating__input')) {
      const currentElement = targetElement.closest('.rating__input');
      const ratingValue = +currentElement.value;
      const rating = currentElement.closest('.rating');
      const ratingSet = rating.dataset.rating === 'set';
      ratingSet ? formRatingGet(rating, ratingValue) : null;
    }
  }

  function formRatingInit(rating, ratingSize) {
    let ratingItems = ``;
    for (let index = 0; index < ratingSize; index++) {
      index === 0 ? ratingItems += `<div class="rating__items">` : null;
      ratingItems += `
                <label class="rating__item">
                    <input class="rating__input" type="radio" name="rating" value="${index + 1}">
                </label>`;
      index === ratingSize ? ratingItems += `</div">` : null;
    }
    rating.insertAdjacentHTML("beforeend", ratingItems);
  }

  function formRatingGet(rating, ratingValue) {
    const resultRating = ratingValue;
    formRatingSet(rating, resultRating);
  }

  function formRatingSet(rating, value) {
    const ratingItems = rating.querySelectorAll('.rating__item');
    const resultFullItems = parseInt(value);
    const resultPartItem = value - resultFullItems;

    rating.hasAttribute('data-rating-title') ? rating.title = value : null;

    ratingItems.forEach((ratingItem, index) => {
      ratingItem.classList.remove('rating__item--active');
      ratingItem.querySelector('span') ? ratingItems[index].querySelector('span').remove() : null;

      if (index <= (resultFullItems - 1)) {
        ratingItem.classList.add('rating__item--active');
      }
      if (index === resultFullItems && resultPartItem) {
        ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`);
      }
    });
  }

  function formRatingSend() {
  }
}
formRating();

//========================================================================================================================================================

if (document.querySelector('.block-reviews__slider')) {
  const reviewsSwiper = new Swiper('.block-reviews__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 'auto',
    spaceBetween: 0,
    speed: 800,
    //centeredSlides: true,
    navigation: {
      prevEl: '.block-reviews__arrow-prev',
      nextEl: '.block-reviews__arrow-next',
    },
  });
}

//========================================================================================================================================================

//Спойлер
function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    }));
    if (spollersRegular.length) initSpollers(spollersRegular);

    spollersArray.forEach(spollersBlock => {
      const mediaQuery = spollersBlock.dataset.spollers;
      if (mediaQuery) {
        const [maxWidth, type] = mediaQuery.split(",");
        const width = parseInt(maxWidth);

        if (type === "max" && window.innerWidth <= width) {
          if (!spollersBlock.classList.contains("_spoller-init")) {
            initSpollers([spollersBlock]);
          }
        } else if (type === "max" && window.innerWidth > width) {
          if (spollersBlock.classList.contains("_spoller-init")) {
            spollersBlock.classList.remove("_spoller-init");
            initSpollerBody(spollersBlock, false);
            spollersBlock.removeEventListener("click", setSpollerAction);
          }
        }
      }
    });

    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init");
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction);

          initCloseButtons(spollersBlock);
        } else {
          spollersBlock.classList.remove("_spoller-init");
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener("click", setSpollerAction);
        }
      }));
    }

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
      if (spollerTitles.length) {
        spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
        spollerTitles.forEach((spollerTitle => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerTitle.classList.contains("_spoller-active")) {
              if (spollerTitle.nextElementSibling) {
                spollerTitle.nextElementSibling.hidden = true;
              }
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            if (spollerTitle.nextElementSibling) {
              spollerTitle.nextElementSibling.hidden = false;
            }
          }
        }));
      }
    }

    function initCloseButtons(spollersBlock) {
      const closeButtons = spollersBlock.querySelectorAll('.cabinet-orders-spollers__button');

      closeButtons.forEach(button => {
        button.removeEventListener('click', closeSpollerHandler);
        button.addEventListener('click', closeSpollerHandler);
      });
    }

    function closeSpollerHandler(e) {
      e.preventDefault();
      e.stopPropagation();

      const button = e.currentTarget;
      const spollersBlock = button.closest('[data-spollers]');
      const spollerItem = button.closest('.cabinet-orders-spollers__item');

      if (spollersBlock && spollerItem) {
        const spollerTitle = spollerItem.querySelector('[data-spoller]');

        if (spollerTitle && spollerTitle.classList.contains('_spoller-active')) {
          const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

          spollerTitle.classList.remove('_spoller-active');
          spollerItem.classList.remove('_spoller-active');

          const contentBlock = spollerTitle.nextElementSibling;
          _slideUp(contentBlock, spollerSpeed);
        }
      }
    }

    function setSpollerAction(e) {
      const el = e.target;
      const spollerTitle = el.closest("[data-spoller]");
      if (!spollerTitle) return;

      if (el.closest('a') && !spollerTitle.closest('a')) {
        return;
      }

      const spollerItem = spollerTitle.closest(".spollers__item, .cabinet-orders-spollers__item, .menu-catalog__item");
      const spollersBlock = spollerTitle.closest("[data-spollers]");

      if (!spollersBlock) return;

      const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

      if (!spollersBlock.querySelectorAll("._slide").length) {
        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) {
          hideSpollersBody(spollersBlock);
        }

        spollerTitle.classList.toggle("_spoller-active");
        if (spollerItem) spollerItem.classList.toggle("_spoller-active");

        const contentBlock = spollerTitle.nextElementSibling;
        if (contentBlock) {
          _slideToggle(contentBlock, spollerSpeed);
        }

        e.preventDefault();
      }
    }

    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
      if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
        const spollerItem = spollerActiveTitle.closest(".spollers__item, .cabinet-orders-spollers__item, .menu-catalog__item");

        spollerActiveTitle.classList.remove("_spoller-active");
        if (spollerItem) spollerItem.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
      }
    }

    const spollersClose = document.querySelectorAll("[data-spoller-close]");
    if (spollersClose.length) {
      document.addEventListener("click", (function (e) {
        const el = e.target;
        if (!el.closest("[data-spollers]")) {
          spollersClose.forEach((spollerClose => {
            const spollersBlock = spollerClose.closest("[data-spollers]");
            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
            spollerClose.classList.remove("_spoller-active");

            const spollerItem = spollerClose.closest(".spollers__item, .cabinet-orders-spollers__item, .menu-catalog__item");
            if (spollerItem) spollerItem.classList.remove("_spoller-active");

            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
          }));
        }
      }));
    }
  }
}

spollers();
window.addEventListener('resize', function () {
  spollers();
});