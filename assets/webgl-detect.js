(function () {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var c = document.createElement('canvas');
    var gl = c.getContext('webgl2');
    if (!gl) return;
    var lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    document.documentElement.classList.add("pt-gl");
  } catch (e) {}
})();
