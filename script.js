const screens = document.querySelectorAll(".screen");
const storyProgress = document.getElementById("storyProgress");

screens.forEach(() => {

    const segment = document.createElement("div");

    segment.className = "progress-segment";

    storyProgress.appendChild(segment);

});

const progressSegments =

    document.querySelectorAll(".progress-segment");

const startButton = document.getElementById("startButton");

let currentScreen = 0;
let isAnimating = false;

function showScreen(index) {

    if (index < 0 || index >= screens.length || isAnimating) {
        return;
    }

    isAnimating = true;
    currentScreen = index;

    screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === index);
});

progressSegments.forEach((segment, i) => {
    segment.classList.toggle("active", i === index);
});

    setTimeout(() => {
        isAnimating = false;
    }, 800);
}


// START BUTTON
startButton.addEventListener("click", (event) => {
    event.stopPropagation();
    showScreen(1);
});


// TAP LEFT / RIGHT
document.addEventListener("click", (event) => {

    // Don't interfere with the start button
    if (event.target === startButton) {
        return;
    }

    const screenWidth = window.innerWidth;

    // Tap left side → PREVIOUS
    if (event.clientX < screenWidth * 0.35) {
        showScreen(currentScreen - 1);
        return;
    }

    // Tap right side → NEXT
    if (event.clientX > screenWidth * 0.35) {
        showScreen(currentScreen + 1);
    }
});


// SWIPE
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
}, { passive: true });


document.addEventListener("touchend", (event) => {

    const touchEndX = event.changedTouches[0].screenX;
    const touchEndY = event.changedTouches[0].screenY;

    const differenceX = touchEndX - touchStartX;
    const differenceY = touchEndY - touchStartY;

    // Ignore vertical swipes
    if (Math.abs(differenceY) > Math.abs(differenceX)) {
        return;
    }

    if (Math.abs(differenceX) < 50) {
        return;
    }

    // Swipe LEFT → NEXT
    if (differenceX < 0) {
        showScreen(currentScreen + 1);
    }

    // Swipe RIGHT → PREVIOUS
    if (differenceX > 0) {
        showScreen(currentScreen - 1);
    }

}, { passive: true });


// Start on intro
showScreen(0);