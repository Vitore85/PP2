document.addEventListener('DOMContentLoaded', () => {
    let currentPlayer = 'X';
    const cells = document.querySelectorAll('.cell');
    const currentPlayerElement = document.getElementById('current-player');

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (cell.textContent === '') {
                cell.textContent = currentPlayer;
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                currentPlayerElement.textContent = currentPlayer;
            }
        });
    });
});
// Function to check if the current player has won
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

// Function to check if the game is a draw
function isDraw() {
    return Array.from(cells).every(cell => cell.textContent !== '');
}
