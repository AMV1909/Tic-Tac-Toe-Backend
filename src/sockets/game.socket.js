import { game } from "../models/game.js";
import { TURNS } from "../Logic/Constants.js";
import { checkWinner } from "../Logic/Board.js";

export const gameSocket = (io) => {
    io.on("connection", (socket) => {
        socket.on("joinGame", async (player) => {
            await game
                .findOne({ _id: 1 })
                .then(async (data) => {
                    if (data) {
                        if (!data.players.some((p) => p.id == socket.id)) {
                            data.players.push(
                                data.players.length == 0
                                    ? {
                                          id: socket.id,
                                          name: player,
                                          symbol: TURNS.X,
                                      }
                                    : {
                                          id: socket.id,
                                          name: player,
                                          symbol: TURNS.O,
                                      }
                            );
                        }

                        await game
                            .updateOne({ _id: 1 }, data)
                            .then(() => io.emit("game", data))
                            .catch((err) => console.log(err));
                    } else {
                        await game
                            .create({
                                _id: 1,
                                board: Array(9).fill(null),
                                turn: TURNS.X,
                                winner: null,
                                draw: false,
                                players: [
                                    {
                                        id: socket.id,
                                        name: player,
                                        symbol: TURNS.X,
                                    },
                                ],
                            })
                            .then(() => io.emit("game", data))
                            .catch((err) => console.log(err));
                    }
                })
                .catch((err) => console.log(err));
        });

        socket.on("resetGame", async () => {
            await game
                .findOneAndReplace(
                    { _id: 1 },
                    {
                        board: Array(9).fill(null),
                        turn: TURNS.X,
                        winner: null,
                        draw: false,
                        players: [],
                    },
                    { new: true }
                )
                .then((data) => io.emit("resetGame", data))
                .catch((err) => console.log(err));
        });

        socket.on("move", async (index) => {
            await game
                .findOne({ _id: 1 })
                .then(async (data) => {
                    // TODO:
                    // Verify if is the player turn
                    let player = data.players.find((p) => p.id == socket.id);
                    if (player.symbol != data.turn) return;

                    data.board[index] = data.turn;
                    data.turn = data.turn == TURNS.X ? TURNS.O : TURNS.X;
                    data.winner = checkWinner(data.board);
                    data.draw = data.winner == false;

                    await game
                        .updateOne({ _id: 1 }, data)
                        .then(() => io.emit("game", data))
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
        });

        socket.on("disconnect", async () => {
            await game
                .findOne({ _id: 1 })
                .then(async (data) => {
                    if (data) {
                        data.turn = "✖";
                        data.winner = null;

                        data.players = data.players.filter(
                            (p) => p.id != socket.id
                        );

                        await game
                            .updateOne({ _id: 1 }, data)
                            .then(() => io.emit("game", data))
                            .catch((err) => console.log(err));
                    }
                })
                .catch((err) => console.log(err));
        });
    });
};
