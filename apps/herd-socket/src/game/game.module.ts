import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { GameService } from "./game.service";

@Module({
    imports: [UsersModule],
    providers: [GameService],
    exports: [GameService],
})
export class GameModule {}
