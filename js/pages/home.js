// import Swiper JS
// import Swiper from "swiper";
// import "swiper/css";

let swiper = new Swiper(".mySwiper", {
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
  loop: true,
  autoplay: {
    delay: 2000,
  },
});

const brandsSwiper = new Swiper(".brands-slider", {
  virtual: {
    enabled: true,
  },
  slidesPerView: 2,
  infinite: true,
  autoplay: {
    disableOnInteraction: false,
  },
  breakpoints: {
    640: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 5,
      spaceBetween: 50,
    },
  },
});
