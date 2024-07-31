import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "src/auth/auth.util";
import { GameService } from "src/game/game.service";
import { UsersService } from "src/users/users.service";

@WebSocketGateway({ cors: true })
export class MyServerGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private userService: UsersService,
        private gameService: GameService
    ) {}

    handleConnection(socket: any, ...args: any[]) {
        console.log("socket connected", socket.id);

        try {
            // authenticate auth token
            const token = socket.handshake.auth.token;

            console.log("verifying token", token);

            let payload = verifyToken(token) as JwtPayload;

            console.log("verified token", payload);

            if (this.gameService.gameHasStarted()) {
                throw new Error("Game has already started");
            }

            const userIndex = this.userService.findByUsername(payload.username);
            const userDataIndex = this.gameService.findUserDataIndexByUsername(
                payload.username
            );

            if (userIndex > -1) {
                const user = this.userService.findByIndex(userIndex);
                user?.socket?.disconnect();
                this.userService.updateUser(userIndex, socket, payload);
                this.gameService.updateUserData(userDataIndex, socket, payload);
            } else {
                this.userService.add(socket, payload);
            }

            this.broadcastGame();
        } catch (error: any) {
            console.error(error);
            socket.emit("error", error?.message);
            socket.disconnect();
        }
    }
    handleDisconnect(socket: any) {
        console.log("socket disconnected", socket.id);

        if (!this.gameService.gameHasStarted()) {
            this.userService.remove(socket);
        }
    }

    private broadcastGame() {
        let data = this.gameService.getGameData();

        console.log("broadcasting data", data);

        for (let i = 0; i < this.userService.getUsers().length; i++) {
            const user = this.userService.getUsers()[i];
            user.socket.emit("game", {
                isHost: i === 0,
                ...data,
            });
        }
    }

    @SubscribeMessage("start")
    handleStart(socket: any, _: any) {
        try {
            this.gameService.startGame(socket);
            this.broadcastGame();
        } catch (error: any) {
            socket.emit("error", error?.message);
        }
    }

    @SubscribeMessage("answer")
    handleAnswer(socket: any, payload: any) {
        try {
            this.gameService.answer(socket, payload);
            this.broadcastGame();
        } catch (error: any) {
            socket.emit("error", error?.message);
        }
    }

    @SubscribeMessage("majority")
    handleMajority(socket: any, payload: any) {
        try {
            this.gameService.majority(socket, payload);
            this.broadcastGame();
        } catch (error: any) {
            socket.emit("error", error?.message);
        }
    }

    @SubscribeMessage("cow")
    handleCow(socket: any, payload: any) {
        try {
            this.gameService.cow(socket, payload);
            this.broadcastGame();
        } catch (error: any) {
            socket.emit("error", error?.message);
        }
    }

    @SubscribeMessage("award")
    handleAward(socket: any, payload: any) {
        try {
            this.gameService.award(socket, payload);
            this.broadcastGame();
        } catch (error: any) {
            socket.emit("error", error?.message);
        }
    }

    @SubscribeMessage("to-lobby")
    handleToLobby(socket: any, payload: any) {
        try {
            this.gameService.toLobby(socket);
            this.broadcastGame();
        } catch (error: any) {
            socket.emit("error", error?.message);
        }
    }
}
