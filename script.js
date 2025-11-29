document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector("[data-search]");
  const tabButtons = document.querySelectorAll("[data-filter]");
  const cards = Array.from(document.querySelectorAll(".course-card"));
  const moreButton = document.querySelector(".more-button");

  const VISIBLE_STEP = 9;
  let visibleCount = VISIBLE_STEP;

  let currentCategory = "all";
  let currentSearch = "";

  function normalize(text) {
    return text.toLowerCase().trim();
  }

  function updateTabCounters() {
    const search = normalize(currentSearch);

    tabButtons.forEach((btn) => {
      const filter = btn.getAttribute("data-filter") || "all";
      const counterEl = btn.querySelector(".tabs__counter");
      if (!counterEl) return;

      let count = 0;

      cards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        const titleEl = card.querySelector(".course-card__title");
        const titleText = normalize(titleEl ? titleEl.textContent : "");

        const matchSearch = search === "" || titleText.includes(search);
        const matchCategoryForThisTab =
          filter === "all" || cardCategory === filter;

        if (matchSearch && matchCategoryForThisTab) {
          count++;
        }
      });

      counterEl.textContent = count;
    });
  }

  function applyFilters() {
    const search = normalize(currentSearch);

    const filteredCards = [];

    cards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      const titleEl = card.querySelector(".course-card__title");
      const titleText = normalize(titleEl ? titleEl.textContent : "");

      const matchCategory =
        currentCategory === "all" || cardCategory === currentCategory;
      const matchSearch = search === "" || titleText.includes(search);

      if (matchCategory && matchSearch) {
        filteredCards.push(card);
      }
    });

    cards.forEach((card) => {
      card.classList.add("course-card--hidden");
    });

    filteredCards.forEach((card, index) => {
      if (index < visibleCount) {
        card.classList.remove("course-card--hidden");
      }
    });

    if (moreButton) {
      if (filteredCards.length > visibleCount) {
        moreButton.style.display = "flex";
      } else {
        moreButton.style.display = "none";
      }
    }

    updateTabCounters();
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("tabs__item--active"));
      btn.classList.add("tabs__item--active");

      currentCategory = btn.getAttribute("data-filter") || "all";
      visibleCount = VISIBLE_STEP;
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      currentSearch = event.target.value;
      visibleCount = VISIBLE_STEP;
      applyFilters();
    });
  }

  if (moreButton) {
    moreButton.addEventListener("click", () => {
      visibleCount += VISIBLE_STEP;
      applyFilters();
    });
  }

  applyFilters();
});
