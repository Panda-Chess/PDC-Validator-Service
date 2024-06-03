import { Move, getMoves, makeMove } from "@panda-chess/pdc-core";
import { databaseService } from "@panda-chess/pdc-microservices-agregator";
import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
    const gameID: string = req.body.gameId;
    const move: Move = req.body.move;

    const game = await databaseService.getGameById(gameID);

    const piece = game.gamePieces.find(p => p.pieceId === move.from.pieceId);

    if (!piece) {
        res.status(400).send("Invalid piece ID");
        return;
    }

    const currentMove = getMoves(piece, game.gamePieces)
        .find(m => m.to.position.x === move.to.position.x && m.to.position.y === move.to.position.y);

    if (!currentMove) {
        res.status(400).send("Invalid move");
        return;
    }

    await databaseService.modifyGame({
        ...game,
        gamePieces: makeMove(currentMove, game.gamePieces),
        currentColor: game.currentColor === "white" ? "black" : "white"
    });

    res.status(200).send();
});

export default router;