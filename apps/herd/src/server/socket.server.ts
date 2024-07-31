import { env } from "$env/dynamic/private";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyToken } from "./auth/jwt.server";
import {
    answer,
    award,
    cow,
    handleConnection,
    handleDisconnect,
    kickPlayer,
    majority,
    startGame,
    toLobby,
} from "./game/game.server";

let io: any;

export function initSocketIo() {
    if (!io) {
        const httpServer = createServer();
        io = new Server(httpServer, {
            cors: {},
        });

        io.on("connection", (socket: Socket) => {
            console.log(`socket.id ${socket.id} connected`);

            try {
                verifyToken(socket.handshake.auth.token);
            } catch (error) {
                console.log(
                    `failed to verify token socket:${socket.id}. Disconnecting...`
                );
                socket.disconnect();
                return;
            }

            handleConnection(socket);

            socket.on("to-lobby", () => toLobby(socket));

            socket.on("kick", (payload) => {
                kickPlayer(socket, payload?.index ?? -1);
            });

            socket.on("disconnect", () => {
                console.log(`socket.id ${socket.id} disconnected`);
                handleDisconnect(socket);
            });
            socket.on("start", () => startGame(socket));

            socket.on("answer", (payload) => {
                answer(socket, payload?.answer || undefined);
            });

            socket.on("majority", (payload) =>
                majority(socket, payload.index ?? -1)
            );
            socket.on("cow", (payload) => cow(socket, payload?.index ?? -1));
            socket.on("award", () => award(socket));
        });

        httpServer.listen(env.SOCKET_PORT);
        console.log("initialized io...");
    } else {
        console.log(`io already initialized`);
    }
}
