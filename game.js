console.log("Game.js initiated");

// Set up the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get the start button and game over section
const startButton = document.getElementById('startButton');
const gameOverSection = document.querySelector('.game-over-section');
const playAgainButton = document.getElementById('playAgainButton');

let gameStarted = false;

// Game settings
const birdWidth = 40;
const birdHeight = 40;
let birdX = 50;
let birdY = canvas.height / 2;
let birdVelocity = 0;
const gravity = 0.6;
const jumpStrength = -10;
let score = 0;
let isGameOver = false;

// Pipe settings
const pipeWidth = 50;
const pipeGap = 300;
let pipes = [];
const pipeSpeed = 3;

// Words for the pipes (array of words)
const words = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon"];
let wordIndex = 0; // Index to keep track of the current word

// Event listener for bird jump (on space or click)
document.addEventListener('keydown', jump);
document.addEventListener('click', jump);

function jump() {
    if (isGameOver) return;
    birdVelocity = jumpStrength;
}

// Draw the bird with a border radius and the word inside
function drawBird() {
    ctx.fillStyle = 'yellow';
    const radius = 10;  // Adjust this value for more or less rounding

    // Draw a rounded rectangle for the bird
    ctx.beginPath();
    ctx.moveTo(birdX + radius, birdY); // Start at the top-left corner with a radius
    ctx.arcTo(birdX + birdWidth, birdY, birdX + birdWidth, birdY + birdHeight, radius); // Top-right corner
    ctx.arcTo(birdX + birdWidth, birdY + birdHeight, birdX, birdY + birdHeight, radius); // Bottom-right corner
    ctx.arcTo(birdX, birdY + birdHeight, birdX, birdY, radius); // Bottom-left corner
    ctx.arcTo(birdX, birdY, birdX + birdWidth, birdY, radius); // Top-left corner
    ctx.closePath();
    ctx.fill();

    // Draw the word inside the bird's box (if any)
    if (words[wordIndex]) {
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px "Urbanist", sans-serif'; 
        ctx.fillText(words[wordIndex], birdX + birdWidth / 4, birdY + birdHeight / 1.5);
    }
}

// Draw the pipes with rounded corners and shadow
function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];

        // Set the shadow properties
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';  // Shadow color (semi-transparent black)
        ctx.shadowBlur = 10;                      // Blur radius of the shadow
        ctx.shadowOffsetX = 5;                    // Horizontal offset of the shadow
        ctx.shadowOffsetY = 5;                    // Vertical offset of the shadow

        // Set the pipe fill color
        ctx.fillStyle = '#184F24';

        // Draw the top pipe with rounded corners
        ctx.beginPath();
        const topRadius = 15;  // Radius for the top corners
        ctx.moveTo(pipe.x + topRadius, 0); // Starting point with rounded corner
        ctx.arcTo(pipe.x + pipeWidth, 0, pipe.x + pipeWidth, pipe.topHeight, topRadius);  // Top-right corner
        ctx.arcTo(pipe.x + pipeWidth, pipe.topHeight, pipe.x, pipe.topHeight, topRadius);  // Bottom-right corner
        ctx.arcTo(pipe.x, pipe.topHeight, pipe.x, 0, topRadius);  // Bottom-left corner
        ctx.arcTo(pipe.x, 0, pipe.x + pipeWidth, 0, topRadius);  // Top-left corner
        ctx.closePath();
        ctx.fill();

        // Draw the bottom pipe with rounded corners
        const bottomRadius = 0;  // Radius for the bottom corners
        ctx.beginPath();
        ctx.moveTo(pipe.x + bottomRadius, pipe.topHeight + pipeGap); // Starting point for bottom pipe
        ctx.arcTo(pipe.x + pipeWidth, pipe.topHeight + pipeGap, pipe.x + pipeWidth, canvas.height, bottomRadius);  // Bottom-right corner
        ctx.arcTo(pipe.x + pipeWidth, canvas.height, pipe.x, canvas.height, bottomRadius);  // Bottom-left corner
        ctx.arcTo(pipe.x, canvas.height, pipe.x, pipe.topHeight + pipeGap, bottomRadius);  // Top-left corner
        ctx.arcTo(pipe.x, pipe.topHeight + pipeGap, pipe.x + pipeWidth, pipe.topHeight + pipeGap, bottomRadius);  // Top-right corner
        ctx.closePath();
        ctx.fill();
    }
}

// Move the pipes
function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;
    }
    // Remove pipes that go off-screen
    if (pipes[0] && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        score++;
    }
}

// Create new pipes with sequential words
function createPipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap));

        // If there are more pipes than words, loop back to the start of the word list
        const word = words[wordIndex % words.length];
        pipes.push({
            x: canvas.width,
            topHeight: topHeight,
            word: word,
            passedByBird: false
        });

        wordIndex++; // Increment the word index
    }
}

// Draw score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = 'bold 20px "Montserrat", sans-serif'; // Use a different font for score if desired
    ctx.fillText('Giảm giá: ' + score + '0 VNĐ', 10, 30);
}

// Check for collisions
function checkCollisions() {
    // Check if bird touches the ground or goes out of bounds
    if (birdY + birdHeight >= canvas.height || birdY <= 0) {
        isGameOver = true;
        return true;
    }

    // Check if bird collides with pipes
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (birdX + birdWidth > pipe.x && birdX < pipe.x + pipeWidth) {
            if (birdY < pipe.topHeight || birdY + birdHeight > pipe.topHeight + pipeGap) {
                isGameOver = true;
                return true;
            }
        }
    }

    return false;
}

// Reset game state
function resetGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    score = 0;
    isGameOver = false;
    pipes = [];
    wordIndex = 0;
}

// Event listener for the "Storytelling" button
startButton.addEventListener('click', function() {
    if (!gameStarted) {
        gameStarted = true;
        startButton.style.display = 'none'; // Hide the start button
        resetGame(); // Reset game state
        updateGame(); // Start the game loop
    } else {
        // Restart the game if it's already started
        resetGame();
        updateGame(); // Restart the game loop
    }
});

// Update game loop
function updateGame() {
    if (isGameOver) {
        // Hide the canvas and show the game over section
        canvas.style.display = 'none';
        gameOverSection.style.display = 'block';  // Show game over section
        return;
    }

    // Move bird
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Create pipes
    createPipes();

    // Move pipes
    movePipes();

    // Check if the bird has passed the pipe and reveal word
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (pipe.x + pipeWidth < birdX && !pipe.passedByBird) {
            pipe.passedByBird = true;  // Mark pipe as passed
        }
    }

    // Check for collisions
    if (checkCollisions()) return;

    // Clear the canvas and redraw game elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    drawScore();

    // Repeat the game loop
    requestAnimationFrame(updateGame);
}

// "Play Again" button click handler
playAgainButton.addEventListener('click', function() {
    gameOverSection.style.display = 'none'; // Hide the game over section
    canvas.style.display = 'block'; // Show the canvas again
    resetGame(); // Reset game state
    updateGame(); // Restart the game loop
});

// Start the game
updateGame();
