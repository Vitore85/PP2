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
