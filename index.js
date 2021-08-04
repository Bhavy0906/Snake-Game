let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 6;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];
let b = 18;
let foodObj = {};
let temp = 0;
let icons = document.getElementsByClassName('icon');
let soundTemp = 1;

function regenerate() {

    let h = Math.round(b * Math.random());
    let v = Math.round(b * Math.random());

    foodObj = {
        x: h > 0 ? h : 1,
        y: v > 0 ? v : 1
    }
}

function generateFood() {
    regenerate();
    for (i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === foodObj.x && snakeArr[i].y === foodObj.y) {
            regenerate();
            i = 1;
        }
    }
    food = foodObj;
}

function main(ctime) {
    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function gameEngine() {

    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        score = 0;
        scoreCard.innerHTML = 'Score:' + score;
        speed = 6;
        temp = 0;
        alert('Game Over. Press any key to play again!')
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();

    }

    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        score++;
        scoreCard.innerHTML = 'Score:' + score;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem('hiscore', JSON.stringify(hiscoreval));
            hiScoreCard.innerHTML = 'Hi-Score:' + hiscoreval;
        }
        foodSound.play();
        snakeArr.push({ x: snakeArr[snakeArr.length - 1].x, y: snakeArr[snakeArr.length - 1].y });
        generateFood();
    }


    if ((Math.floor(score / 5)) > temp) {
        temp++;
        speed++;
    }

    // Moving the snake
    for (let i = snakeArr.length - 1; i > 0; i--) {
        snakeArr[i] = { ...snakeArr[i - 1] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;


    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        index === 0 ? snakeElement.classList.add('head') : snakeElement.classList.add('snake');
        board.append(snakeElement);
    })

    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.append(foodElement);
}

function isCollide(sarr) {
    for (let i = sarr.length - 1; i > 0; i--) {
        if (sarr[0].x === sarr[i].x && sarr[0].y === sarr[i].y) return true;
    }
    if (sarr[0].x <= 0 || sarr[0].x >= 19) return true;
    if (sarr[0].y <= 0 || sarr[0].y >= 19) return true;
}

function swipedetect(el, callback) {

    let touchsurface = el;
    let swipedir;
    let startX;
    let startY;
    let distX;
    let distY;
    let threshold = 100; //required min distance traveled to be considered swipe
    let restraint = 100; // maximum distance allowed at the same time in perpendicular direction
    let allowedTime = 300; // maximum time allowed to travel that distance
    let elapsedTime;
    let startTime;
    let handleswipe = callback || function (s) { };

    touchsurface.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)

    touchsurface.addEventListener('touchmove', function (e) {
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime) { // first condition for swipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}



// Main Logic Starts Here

window.requestAnimationFrame(main);
generateFood();
let hiscore = localStorage.getItem('hiscore');
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem('hiscore', JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    hiScoreCard.innerHTML = 'Hi-Score:' + hiscore;
}

let playPromise = musicSound.play();
if (playPromise !== undefined) {
    playPromise.catch(function (error) {
        window.addEventListener('keydown', () => musicSound.play());
        window.addEventListener('touchstart', () => musicSound.play());
    });
}

music.addEventListener('click', () => {
    moveSound.play();
    if (!musicSound.muted) {
        musicSound.muted = true;
        soundTemp = 0;
        icons[0].innerHTML = 'music_off';
    }
    else {
        musicSound.muted = false;
        soundTemp = 1;
        icons[0].innerHTML = 'music_note';
    }
})

sound.addEventListener('click', () => {
    moveSound.play();
    if (!moveSound.muted && soundTemp) {
        musicSound.muted = true;
        foodSound.muted = true;
        gameOverSound.muted = true;
        moveSound.muted = true;
        icons[1].innerHTML = 'volume_off';
        icons[0].innerHTML = 'music_off';
    } else {
        if (!soundTemp) {
            foodSound.muted = true;
            gameOverSound.muted = true;
            moveSound.muted = true;
            soundTemp = 1;
            icons[1].innerHTML = 'volume_off';
        } else {
            musicSound.muted = false;
            foodSound.muted = false;
            gameOverSound.muted = false;
            moveSound.muted = false;
            soundTemp = 1;
            icons[0].innerHTML = 'music_note';
            icons[1].innerHTML = 'volume_up';
        }
    }
})

window.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && (inputDir.x || (inputDir.x == 0 && inputDir.y == 0))) {
        moveSound.play();
        inputDir.x = 0;
        inputDir.y = -1;
    } else if (e.key === 'ArrowDown' && (inputDir.x || (inputDir.x == 0 && inputDir.y == 0))) {
        moveSound.play();
        inputDir.x = 0;
        inputDir.y = 1;
    } else if (e.key === 'ArrowRight' && (inputDir.y || (inputDir.x == 0 && inputDir.y == 0))) {
        moveSound.play();
        inputDir.x = 1;
        inputDir.y = 0;
    } else if (e.key === 'ArrowLeft' && (inputDir.y || (inputDir.x == 0 && inputDir.y == 0))) {
        moveSound.play();
        inputDir.x = -1;
        inputDir.y = 0;
    }
})

window.addEventListener('load', function () {
    swipedetect(board, function (swipedir) {
        // swipedir contains either "none", "left", "right", "top", or "down"
        if (swipedir == 'left' && (inputDir.y || (inputDir.x == 0 && inputDir.y == 0))) {
            moveSound.play();
            inputDir.x = -1;
            inputDir.y = 0;
        }
        else if (swipedir == 'right' && (inputDir.y || (inputDir.x == 0 && inputDir.y == 0))) {
            moveSound.play();
            inputDir.x = 1;
            inputDir.y = 0;
        }
        else if (swipedir == 'up' && (inputDir.x || (inputDir.x == 0 && inputDir.y == 0))) {
            moveSound.play();
            inputDir.x = 0;
            inputDir.y = -1;
        }
        else if (swipedir == 'down' && (inputDir.x || (inputDir.x == 0 && inputDir.y == 0))) {
            moveSound.play();
            inputDir.x = 0;
            inputDir.y = 1;
        }
    })
})
