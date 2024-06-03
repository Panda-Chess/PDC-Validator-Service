import { describe } from "@jest/globals";
import axios from "axios";
import { createTestGame, deleteTestGame } from "./../utils/tests/game.operations";
import { PieceType, getMoves } from "@panda-chess/pdc-core";
import { databaseService } from "@panda-chess/pdc-microservices-agregator";

describe("validate route", () => {
    it("should validate move", async () => {
        const testGame = await createTestGame();
        const move = getMoves(testGame.gamePieces.find(p => p.color === "white" && p.pieceType === PieceType.Pawn)!, testGame.gamePieces)[0];

        const response = await axios.post("http://localhost:3003/validate", {
            gameId: testGame._id,
            move: move
        })

        expect(response.status).toBe(200);

        const updatedGame = await databaseService.getGameById(testGame._id!);

        expect(updatedGame.currentColor).toBe("black");
        expect(updatedGame.gamePieces.find(p => p.pieceId === move.from.pieceId)!.position.x).toStrictEqual(move.to.position.x);
        expect(updatedGame.gamePieces.find(p => p.pieceId === move.from.pieceId)!.position.y).toStrictEqual(move.to.position.y);

        await deleteTestGame(testGame);
    });

    it("should return 400 when invalid piece ID", async () => {
        const testGame = await createTestGame();
        const move = getMoves(testGame.gamePieces.find(p => p.color === "white" && p.pieceType === PieceType.Pawn)!, testGame.gamePieces)[0];

        try {
            const response = await axios.post("http://localhost:3003/validate", {
                gameId: testGame._id,
                move: {
                    from: {
                        pieceId: "invalid"
                    },
                    to: move.to
                }
            })
        } catch (e) {
            expect(e.response.status).toBe(400);

            await deleteTestGame(testGame);
        }
    });

    it("should return 400 when invalid move", async () => {
        const testGame = await createTestGame();
        const move = getMoves(testGame.gamePieces.find(p => p.color === "white" && p.pieceType === PieceType.Pawn)!, testGame.gamePieces)[0];

        try {
            const response = await axios.post("http://localhost:3003/validate", {
                gameId: testGame._id,
                move: {
                    from: move.from,
                    to: {
                        position: {
                            x: 0,
                            y: 0
                        }
                    }
                }
            })
        } catch (e) {
            expect(e.response.status).toBe(400);

            await deleteTestGame(testGame);
        }
    });
});