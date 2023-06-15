import { WINNER_COMBOS } from "./Constants.js";

const checkEndGame = (board) => {
    return board.every((cell) => cell != null) ? false : null;
};

export const checkWinner = (board) => {
    for (const combo of WINNER_COMBOS) {
        const [a, b, c] = combo;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return checkEndGame(board);
};
