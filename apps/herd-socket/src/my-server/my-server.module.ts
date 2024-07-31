import { Module } from "@nestjs/common";
import { GameModule } from "src/game/game.module";
import { UsersModule } from "src/users/users.module";
import { MyServerGateway } from "./my-server.gateway";

@Module({
    imports: [UsersModule, GameModule],
    providers: [MyServerGateway],
    exports: [MyServerGateway],
})
export class MyServerModule {}
