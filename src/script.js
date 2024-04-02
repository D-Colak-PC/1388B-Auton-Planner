// matchfield & skillsfield buttons
const matchFieldButton = document.getElementById('match-field-button');
const skillsFieldButton = document.getElementById('skills-field-button');

const matchField = document.getElementById('match-field');

matchFieldButton.addEventListener('click', () => {
    matchField.style.display = 'block';
});

skillsFieldButton.addEventListener('click', () => {
    matchField.style.display = 'none';
});


// play, pause & reset buttons
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');

playButton.addEventListener('click', () => {
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
    console.log('play button pressed, pause button displayed');
});

pauseButton.addEventListener('click', () => {
    playButton.style.display = 'block';
    pauseButton.style.display = 'none';
    console.log('pause button pressed, play button displayed');
});

resetButton.addEventListener('click', () => {
    if (pauseButton.style.display === 'block') {
        playButton.style.display = 'block';
        pauseButton.style.display = 'none';
        console.log('reset button pressed, play button displayed');
    }
    console.log('reset button pressed');
});