import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GameApiModule } from "./game-api/game-api.module";
import { GameModule } from "./game/game.module";
import { MyServerModule } from "./my-server/my-server.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MyServerModule,
        UsersModule,
        GameModule,
        GameApiModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
