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

    let scoreX = 0;
    let scoreO = 0;
    let playerXName = 'X';
    let playerOName = 'O';
    let roundsHistory = []; 

    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
        cell.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleCellClick(cell);
            }
        });
    });

    resetButton.addEventListener('click', resetGame);

    startButton.addEventListener('click', () => {
        playerXName = playerXInput.value || 'X';
        playerOName = playerOInput.value || 'O';
        resetScores();
        updateStatus();
    });

    function handleCellClick(cell) {
        if (cell.textContent === '') {
            cell.textContent = currentPlayer;
            if (checkWin(currentPlayer)) {
                alert(`${currentPlayer === 'X' ? playerXName : playerOName} wins!`);
                updateScore(currentPlayer);
                addRoundToHistory(currentPlayer === 'X' ? playerXName : playerOName, currentPlayer === 'X' ? playerOName : playerXName); 
            } else if (isDraw()) {
                alert('Draw!');
                addRoundToHistory('Draw', ''); 
                resetGame(true);
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateStatus();
            }
        }
    }

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

        return winPatterns.some(pattern => {
            return pattern.every(index => {
                return document.getElementById(`cell-${index}`).textContent === player;
            });
        });
    }

    function isDraw() {
        return Array.from(cells).every(cell => cell.textContent !== '');
    }

    function resetGame(autoReset = false) {
        cells.forEach(cell => {
            cell.textContent = '';
        });
        currentPlayer = 'X';
        updateStatus();
        if (autoReset) {
            playerXName = playerXInput.value || 'X';
            playerOName = playerOInput.value || 'O';
        }
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
            roundsHistory = []; 
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
});
