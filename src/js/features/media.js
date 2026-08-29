export function initMedia({ gsap, ScrollTrigger, reducedMotion }) {
  const reduzido = reducedMotion;
gsap.utils.toArray('video').forEach(function (video) {
    if (reduzido) return;


    if (video.classList.contains('heroi__loop')) {
      video.play().catch(function () {});
    }

    ScrollTrigger.create({
      trigger: video,
      start: 'top bottom',
      end: 'bottom top',
      onEnter:     function () { video.play().catch(function () {}); },
      onEnterBack: function () { video.play().catch(function () {}); },
      onLeave:     function () { video.pause(); },
      onLeaveBack: function () { video.pause(); }
    });
  });
}
