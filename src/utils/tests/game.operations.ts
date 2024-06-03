import { generatePieceSet } from "@panda-chess/pdc-core";
import { Game, GameTypes, UserStatus } from "@panda-chess/pdc-core/dist/utils";
import { databaseService } from "@panda-chess/pdc-microservices-agregator";
import { createTestUser, deleteTestUser } from "./user.operations";

export const createTestGame = async () => {
    const testUser1 = await createTestUser();
    const testUser2 = await createTestUser();

    const game = await databaseService.createGame({
        currentColor: "white",
        gamePieces: generatePieceSet(),
        users: [
            {
                color: "white",
                gamePoints: 0,
                user: testUser1,
                status: UserStatus.online
            },
            {
                color: "black",
                gamePoints: 0,
                user: testUser2,
                status: UserStatus.online
            }
        ],
        gameType: GameTypes.competitive,
    });

    return game;
};

export const deleteTestGame = async (game: Game) => {
    await databaseService.deleteGame(game._id!);
    await deleteTestUser(game.users[0].user);
    await deleteTestUser(game.users[1].user);
};