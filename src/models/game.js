import { Schema, model } from "mongoose";

export const game = new model(
    "Game",
    new Schema(
        {
            _id: {
                type: Number,
                default: 1,
            },
            board: {
                type: Array,
                default: Array(9).fill(null),
            },
            turn: {
                type: String,
                default: "✖",
            },
            winner: {
                type: String,
                default: null,
            },
            players: {
                type: Array,
                default: [],
            },
        },
        {
            timestamps: false,
            versionKey: false,
        }
    )
);
