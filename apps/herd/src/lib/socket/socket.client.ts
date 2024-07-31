import { PUBLIC_SOCKET_URL } from "$env/static/public";
import { io, Socket } from "socket.io-client";
const socketUrl = PUBLIC_SOCKET_URL as string;
let socket: Socket;
let auth: any;

export function getSocket() {
    return socket;
}

/**
 * all client side socket.io action happens here
 */
export function initSocketServer(auth: any) {
    if (!socketUrl) {
        throw new Error("SOCKET_URL is not set in ENV!");
    }

    console.log(`connecting to PUBLIC_SOCKET_URL`, PUBLIC_SOCKET_URL);

    socket = io(PUBLIC_SOCKET_URL, {
        autoConnect: false,
        auth: {
            token: auth.token,
        },
    });
}

export function socketConnect() {
    if (socket?.disconnected) socket.connect();
}
