import { Module } from "@nestjs/common";
import { GameModule } from "src/game/game.module";
import { GameApiController } from "./game-api.controller";

@Module({
    imports: [GameModule],
    controllers: [GameApiController],
})
export class GameApiModule {}
