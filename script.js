const texto = document.querySelector("#texto");

let lastDistance = null;
let zoomLevel = 0;

const threshold = 8;
const maxZoom = 30;
const spacingStep = 1.5;

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
  // Con un dedo, el navegador gestiona el scroll.
  if (event.touches.length !== 2) return;

  // Con dos dedos, evitamos el zoom nativo.
  event.preventDefault();

  const currentDistance = distanceBetweenTouches(event.touches);

  if (lastDistance === null) {
    lastDistance = currentDistance;
    return;
  }

  const difference = currentDistance - lastDistance;

  // Solo expandir cuando los dedos se separan.
  if (difference > threshold) {
    zoomLevel = Math.min(zoomLevel + 1, maxZoom);
    updateSpacing();
    lastDistance = currentDistance;
  }
}, { passive: false });

function resetGesture(event) {
  if (event.touches.length < 2) {
    lastDistance = null;
  }
}

texto.addEventListener("touchend", resetGesture);
texto.addEventListener("touchcancel", () => {
  lastDistance = null;
});

// La rueda del ratón modifica el espaciado.
document.addEventListener("wheel", (event) => {
  if (event.deltaY < 0) {
    zoomLevel = Math.min(zoomLevel + 1, maxZoom);
  } else if (event.deltaY > 0) {
    zoomLevel = Math.max(zoomLevel - 1, 0);
  }

  updateSpacing();
}, { passive: true });