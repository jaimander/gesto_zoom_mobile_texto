
const texto = document.querySelector("#texto");

let lastDistance = null;
let zoomLevel = 0;

const threshold = 8;
const maxZoom = 30;
const spacingStep = 3; // píxeles añadidos por cada paso

function distanceBetweenTouches(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;

  return Math.hypot(dx, dy);
}

function updateSpacing() {
  texto.style.wordSpacing = `${zoomLevel * spacingStep}px`;
}

texto.addEventListener("touchstart", (event) => {
  if (event.touches.length === 2) {
    lastDistance = distanceBetweenTouches(event.touches);
  }
}, { passive: true });

texto.addEventListener("touchmove", (event) => {
  if (event.touches.length !== 2 || lastDistance === null) {
    return;
  }

  const currentDistance = distanceBetweenTouches(event.touches);
  const difference = currentDistance - lastDistance;

  if (difference > threshold) {
    zoomLevel = Math.min(zoomLevel + 1, maxZoom);
    updateSpacing();
    lastDistance = currentDistance;
  } else if (difference < -threshold) {
    zoomLevel = Math.max(zoomLevel - 1, 0);
    updateSpacing();
    lastDistance = currentDistance;
  }
}, { passive: true });

function resetGesture(event) {
  if (event.touches.length < 2) {
    lastDistance = null;
  }
}

texto.addEventListener("touchend", resetGesture);
texto.addEventListener("touchcancel", () => {
  lastDistance = null;
});
