// Globals
var i = 0;
var letters = new Map();
var counter = 0;

function startTimer() {
    // For each letter in the shuffled sequence, move the visible one to the bottom
    // And make the invisible one take up the old one's space.
    var fallTimer = setInterval(function () {
        // If no more letters, stop processing this loop.
        if (letters.size <= 0) {
            clearInterval(fallTimer);
            return;
        }

        // Get the letter's position
        var letter = letters.get(i);
        const rect = letter.getBoundingClientRect();
        const pos = Number(window.innerHeight - rect.bottom);

        // If the letter is below the screen, skip it.
        if (pos < 0) {
            letters.set(counter, letter);
            counter++;
        }

        // If it's on or above the screen, let it fall.
        else {
            // Make the invisible one take up space but make sure it's hidden
            letter.nextSibling.style.display = "inline";
            letter.nextSibling.style.visibility = "hidden";

            // Animate the letter
            animate(letter);
        }

        // Remove this element from the map.
        letters.delete(i);
        i++;
    }, 3000);
}

function animate(elem) {
    // Get position
    const rect = elem.getBoundingClientRect();
    const mass = rect.height * rect.width;
    const pos = Number(window.innerHeight - rect.bottom);

    // Characters that don't have mass won't drop, so return
    if (mass == 0) {
        return;
    }

    // Fix the letter to where it is now.
    elem.style["line-height"] = "normal";
    elem.style.bottom = pos + "px";
    elem.style.position = "fixed";

    // Give it a whimsical bump up.
    elem.setAttribute('vel', -mass / 200 * Math.random());

    bounces = 0;

    var animTimer = setInterval(function () {
        // Recalculate position
        const rect = elem.getBoundingClientRect();
        const pos = Number(window.innerHeight - rect.bottom);
        vel = Number(elem.getAttribute('vel'));

        // If it hits the bottom of the screen, bounce or end
        if (pos <= 0.001) {
            vel *= -0.25;
            bounces += 1;
            if (Math.abs(vel) <= 0.01 || bounces >= 5) {
                clearInterval(animTimer);
            }
        }

        // Move it
        const newPos = Math.max(pos - vel, 0);
        elem.style.bottom = newPos + "px";
        elem.setAttribute('vel', vel + mass / 2500); // Bigger elements fall faster to give the illusion of weight
    }, 10);
}

// -----------EXECUTION STARTS HERE------------

// Get all elements with text
const texts = document.getElementsByClassName("text");

// Make all letters spans
for (let text of texts) {
    const str = text.innerHTML;
    text.innerHTML = "";

    var inSpecial = false;
    var acc = "";
    for (let c of str) {
        // Manage special HTML character encodings
        if (!inSpecial && c == '&') {
            inSpecial = true;
        }
        if (inSpecial) {
            acc += c;
            if (c == ';') {
                inSpecial = false;
                c = acc;
                acc = "";
            }
        }

        if (!inSpecial) {
            text.innerHTML += "<span class=\"visible\">" + c + "</span>" + "<span class=\"invisible\">" + c + "</span>";
        }
    }
}

// Make the invisible spans take up no space to begin with
const invises = document.getElementsByClassName("invisible");
for (let invis of invises) {
    invis.style.display = "none";
}

// Put all elements in the map
for (let letter of document.getElementsByClassName("visible")) {
    if (letter.innerHTML != " ") { // Skip spaces
        letters.set(counter, letter);
        counter++;
    }
}

// Shuffle all letters
for (let i = letters.size - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    var tmp = letters.get(i);
    letters.set(i, letters.get(j))
    letters.set(j, tmp);
}

// Start dropping letters
startTimer();