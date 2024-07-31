import { Controller, Get } from "@nestjs/common";
import { GAME_STATE } from "src/constants/constants";
import { GameService } from "src/game/game.service";

@Controller("game-api")
export class GameApiController {
    constructor(private gameService: GameService) {}

    @Get("/started")
    getGameStarted() {
        const state = this.gameService.getGameState();

        return state !== GAME_STATE.LOBBY;
    }
}
