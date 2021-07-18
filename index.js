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
    playPromise.catch(function(error) {
        window.addEventListener('keydown', ()=> musicSound.play());
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

