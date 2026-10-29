const touchArea = document.querySelector("#touch-area");
const statusText = document.querySelector("#status");

let initialDistance = null;
let lastDistance = null;
const threshold = 8;

function distanceBetweenTouches(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

touchArea.addEventListener("touchstart", (event) => {
  if (event.touches.length === 2) {
    initialDistance = distanceBetweenTouches(event.touches);
    lastDistance = initialDistance;
    statusText.textContent = "Dos dedos detectados…";
  }
}, { passive: true });

touchArea.addEventListener("touchmove", (event) => {
  if (event.touches.length !== 2 || lastDistance === null) return;

  const currentDistance = distanceBetweenTouches(event.touches);
  const difference = currentDistance - lastDistance;

  if (difference > threshold) {
    statusText.textContent = "ZOOM IN · separando los dedos";
    touchArea.dataset.gesture = "in";
  } else if (difference < -threshold) {
    statusText.textContent = "ZOOM OUT · juntando los dedos";
    touchArea.dataset.gesture = "out";
  }

  lastDistance = currentDistance;
}, { passive: true });

function resetGesture() {
  initialDistance = null;
  lastDistance = null;
  delete touchArea.dataset.gesture;
  statusText.textContent = "Esperando gesto…";
}

touchArea.addEventListener("touchend", (event) => {
  if (event.touches.length < 2) resetGesture();
});

touchArea.addEventListener("touchcancel", resetGesture);
