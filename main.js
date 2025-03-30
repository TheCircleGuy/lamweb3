document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".small-card");
  let activeIndex = 0;

  const rotateCards = () => {
    // Remove active class from all cards
    cards.forEach((card) => card.classList.remove("active"));

    // Add active class to the current card
    cards[activeIndex].classList.add("active");

    // Increment the index
    activeIndex = (activeIndex + 1) % cards.length;
  };

  // Rotate cards every 3 seconds
  setInterval(rotateCards, 3000);
});


(function () {
  let lastScrollTop = 0;
  const navbar = document.querySelector('.custom-navbar');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 60) {
      // scrolling down
      navbar.classList.add('nav-hidden');
    } else {
      // scrolling up
      navbar.classList.remove('nav-hidden');
    }

    lastScrollTop = Math.max(scrollTop, 0);
  });
})();




//game

