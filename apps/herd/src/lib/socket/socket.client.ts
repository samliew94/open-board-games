import { env } from "$env/dynamic/public";
import { io, Socket } from "socket.io-client";
let socket: Socket;
let auth: any;

export function getSocket() {
    return socket;
}

/**
 * all client side socket.io action happens here
 */
export function initSocketServer(auth: any) {
    socket = io(env.PUBLIC_SOCKET_URL, {
        autoConnect: false,
        auth: {
            token: auth.token,
        },
    });
}

export function socketConnect() {
    if (!socket) {
        throw new Error("socket object is undefined!");
    }

    if (socket.disconnected) {
        socket.connect();
    }
}
