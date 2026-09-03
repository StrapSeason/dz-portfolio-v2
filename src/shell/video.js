/** Poster-first video frames: nothing downloads until the visitor asks. */
export function initVideos(root = document) {
  root.querySelectorAll('.video').forEach((box) => {
    const v = box.querySelector('video');
    const btn = box.querySelector('.video__play');
    if (!v || !btn) return;
    btn.addEventListener('click', () => { v.play(); box.classList.add('is-playing'); v.controls = true; });
    v.addEventListener('pause', () => { if (v.currentTime === 0) box.classList.remove('is-playing'); });
  });
}
