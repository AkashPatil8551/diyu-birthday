const screens = document.querySelectorAll(".screen");
const storyProgress = document.getElementById("storyProgress");
const startButton = document.getElementById("startButton");


// =============================
// PROGRESS INDICATOR
// =============================

screens.forEach(() => {

    const segment = document.createElement("div");

    segment.className = "progress-segment";

    storyProgress.appendChild(segment);

});

const progressSegments =
    document.querySelectorAll(".progress-segment");


// =============================
// STORY SETTINGS
// =============================

// Time before the user can move FORWARD.
// Backward navigation is always available.

const readingTimes = [
    3000,  // Screen 1 - Intro
    3000,  // Screen 2 - Photo 1
    3000,  // Screen 3 - Photo 2
    3000,  // Screen 4 - Photo 3
    3000,  // Screen 5 - Humari baatein
    3000,  // Screen 6 - Photo 5
    3000,  // Screen 7 - Photo 6
    3000,  // Screen 8 - Photo 7
    3000,  // Screen 9 - Birthday reveal
    0      // Screen 10 - Final message
];

let currentScreen = 0;
let isAnimating = false;
let screenReady = false;
let readyTimer;


// =============================
// SHOW SCREEN
// =============================

function showScreen(index, movingForward = true) {

    if (index < 0 || index >= screens.length || isAnimating) {
        return;
    }

    isAnimating = true;
    currentScreen = index;

    clearTimeout(readyTimer);

    screenReady = false;


    // Activate selected screen

    screens.forEach((screen, i) => {

        screen.classList.toggle(
            "active",
            i === index
        );

    });


    // Update progress

    progressSegments.forEach((segment, i) => {

        segment.classList.toggle(
            "active",
            i === index
        );

    });


    // Reading timer
    //
    // If moving backward, allow immediate
    // forward movement again.

    if (!movingForward || readingTimes[index] === 0) {

        screenReady = true;

    } else {

        readyTimer = setTimeout(() => {

            screenReady = true;

        }, readingTimes[index]);

    }


    // Animation lock

    setTimeout(() => {

        isAnimating = false;

    }, 800);
}


// =============================
// START BUTTON
// =============================

startButton.addEventListener("click", (event) => {

    event.stopPropagation();

    showScreen(1, true);

});


// =============================
// TAP LEFT / RIGHT
// =============================

document.addEventListener("click", (event) => {

    // Ignore the Start button

    if (event.target === startButton) {
        return;
    }


    const screenWidth = window.innerWidth;


    // LEFT SIDE → BACK

    if (event.clientX < screenWidth * 0.35) {

        showScreen(
            currentScreen - 1,
            false
        );

        return;
    }


    // RIGHT SIDE → FORWARD

    if (event.clientX >= screenWidth * 0.35) {

        // Don't allow skipping the reading time

        if (!screenReady) {
            return;
        }

        showScreen(
            currentScreen + 1,
            true
        );

    }

});


// =============================
// SWIPE
// =============================

let touchStartX = 0;
let touchStartY = 0;


document.addEventListener("touchstart", (event) => {

    touchStartX =
        event.changedTouches[0].screenX;

    touchStartY =
        event.changedTouches[0].screenY;

}, { passive: true });


document.addEventListener("touchend", (event) => {

    const touchEndX =
        event.changedTouches[0].screenX;

    const touchEndY =
        event.changedTouches[0].screenY;


    const differenceX =
        touchEndX - touchStartX;

    const differenceY =
        touchEndY - touchStartY;


    // Ignore vertical movement

    if (
        Math.abs(differenceY) >
        Math.abs(differenceX)
    ) {
        return;
    }


    // Ignore tiny movements

    if (Math.abs(differenceX) < 50) {
        return;
    }


    // SWIPE LEFT → NEXT

    if (differenceX < 0) {

        if (!screenReady) {
            return;
        }

        showScreen(
            currentScreen + 1,
            true
        );

    }


    // SWIPE RIGHT → PREVIOUS

    if (differenceX > 0) {

        showScreen(
            currentScreen - 1,
            false
        );

    }

}, { passive: true });


// =============================
// START
// =============================

showScreen(0, true);