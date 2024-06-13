/* jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', () => {
    let currentPlayer = 'X';
    const cells = document.querySelectorAll('.cell');
    const currentPlayerElement = document.getElementById('current-player');
    const resetButton = document.getElementById('reset-button');
    const scoreXElement = document.getElementById('score-x');
    const scoreOElement = document.getElementById('score-o');
    const startButton = document.getElementById('start-game');
    const playerXInput = document.getElementById('player-x');
    const playerOInput = document.getElementById('player-o');
    const roundsList = document.getElementById('rounds-list');
    const timerElement = document.getElementById('time');
    const rulesButton = document.getElementById('rules-button');
    const modal = document.getElementById('rules-modal');
    const closeButton = document.querySelector('.close-button');

    let scoreX = 0;
    let scoreO = 0;
    let playerXName = 'X';
    let playerOName = 'O';
    let roundsHistory = [];
    let timer;
    let timeLeft = 5;
    let singlePlayerMode = false;

    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
        cell.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleCellClick(cell);
            }
        });
    });

    /* Restart the game when the reset button is clicked */
    resetButton.addEventListener('click', resetGame);

    /* Start the game when the start button is clicked */
    startButton.addEventListener('click', () => {
        playerXName = playerXInput.value || 'X';
        playerOName = playerOInput.value || 'O';
        singlePlayerMode = playerOInput.value.toLowerCase() === 'ai';
        resetScores();
        updateStatus();
        startNewRound();
    });

    /* Show the rules when the rules button is clicked */
    rulesButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    /* Close the rules when the close button is clicked */
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    /* What happens when you click on a box */
    function handleCellClick(cell) {
        if (cell.textContent === '') {
            cell.textContent = currentPlayer;
            const winningCells = checkWin(currentPlayer);
            if (winningCells) {
                alert(`${currentPlayer === 'X' ? playerXName : playerOName} wins!`);
                updateScore(currentPlayer);
                addRoundToHistory(currentPlayer === 'X' ? playerXName : playerOName, currentPlayer === 'X' ? playerOName : playerXName);
                highlightWinningCells(winningCells);
                clearInterval(timer);
            } else if (isDraw()) {
                alert('Draw!');
                addRoundToHistory('Draw', '');
                resetGame(true);
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateStatus();
                if (singlePlayerMode && currentPlayer === 'O') {
                    clearInterval(timer);
                    setTimeout(aiMove, 500);
                } else {
                    startNewRound();
                }
            }
        }
    }

     /* Check if the current player has won */
    function checkWin(player) {
        const winPatterns = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ];

        for (const pattern of winPatterns) {
            const currentPlayer = player; 
            if (pattern.every(index => document.getElementById(`cell-${index}`).textContent === currentPlayer)) {
                return pattern;
            }
        }
        return null;
    }

    /* Check if the game is a draw */
    function isDraw() {
        return Array.from(cells).every(cell => cell.textContent !== '');
    }

    /* Restart the game board */
    function resetGame(autoReset = false) {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('win');
        });
        currentPlayer = 'X';
        updateStatus();
        clearInterval(timer);
        timeLeft = 5;
        timerElement.textContent = timeLeft;
        if (autoReset) {
            playerXName = playerXInput.value || 'X';
            playerOName = playerOInput.value || 'O';
        }
        startNewRound();
    }

    function resetScores() {
        scoreX = 0;
        scoreO = 0;
        scoreXElement.textContent = `${playerXName}: ${scoreX}`;
        scoreOElement.textContent = `${playerOName}: ${scoreO}`;
    }

    function updateScore(player) {
        if (player === 'X') {
            scoreX += 1;
            scoreXElement.textContent = `${playerXName}: ${scoreX}`;
        } else {
            scoreO += 1;
            scoreOElement.textContent = `${playerOName}: ${scoreO}`;
        }
    }

    function updateStatus() {
        currentPlayerElement.textContent = currentPlayer === 'X' ? playerXName : playerOName;
    }

    function addRoundToHistory(winner, loser) {
        const result = loser ? `${winner} won against ${loser}` : 'Draw';
        roundsHistory.unshift(result);
        if (roundsHistory.length > 10) {
            roundsHistory = roundsHistory.slice(0, 10);
        }
        updateRoundsList();
    }

    function updateRoundsList() {
        roundsList.innerHTML = '';
        roundsHistory.forEach(round => {
            const li = document.createElement('li');
            li.textContent = round;
            roundsList.appendChild(li);
        });
    }

    function highlightWinningCells(pattern) {
        pattern.forEach(index => {
            document.getElementById(`cell-${index}`).classList.add('win');
        });
    }

    /* Start a new round and set the timer */
    function startNewRound() {
        clearInterval(timer);
        timeLeft = 5;
        timerElement.textContent = timeLeft;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timerElement.textContent = timeLeft;
            } else {
                clearInterval(timer);
                alert('Time up! Switching player.');
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateStatus();
                if (singlePlayerMode && currentPlayer === 'O') {
                    setTimeout(aiMove, 500);
                } else {
                    startNewRound();
                }
            }
        }, 1000);
    }

    /* The computer makes a random move */
    function aiMove() {
        const emptyCells = Array.from(cells).filter(cell => cell.textContent === '');
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        handleCellClick(randomCell);
    }
});
