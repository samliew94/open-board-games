import { GAME_SCREEN, GAME_STATE, TOPICS } from "$lib/constants/constants";
import type { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import { decodeToken } from "../auth/jwt.server";

interface Player {
    socket: Socket;
    username: string;
    points?: number;
    cow?: boolean;
    answer?: string;
    majority?: boolean;
}

interface Room {
    state: GAME_STATE;
    players: Player[];
    topic?: string;
    usedTopics?: Set<number>;
}

let game: {
    [room: string]: Room;
} = {};

export function initRoom(room: string) {
    if (!game[room]) {
        game[room] = {
            state: GAME_STATE.LOBBY,
            players: [],
        };
    }
}

export function getGame(room: string) {
    initRoom(room);
    return game[room];
}

export function handleConnection(socket: Socket) {
    try {
        let verify = decodeToken(socket.handshake.auth.token) as JwtPayload;

        const { room, username } = verify;

        const index = findPlayerIndexByRoomAndUsername(room, username);

        if (isGameStarted(room)) {
            if (index === -1) {
                console.log(
                    `Disconnecting player ${socket.id} ${username} as game already started...`
                );
                socket.disconnect();
            } else {
                updatePlayer(room, index, socket);
            }
        } else {
            if (index === -1) {
                addNewPlayer(room, username, socket);
            } else {
                updatePlayer(room, index, socket);
            }
        }

        broadcastGameData(room);
    } catch (error: any) {
        console.error(error);
        socket.emit("error", error?.message);
    }
}

export function disconnectSocketByUsername(room: string, username: string) {
    const player = findPlayerByRoomAndUsername(room, username);

    if (!player) {
        throw new Error("player not found!");
    }

    disconnectSocket(player.socket);
    console.log(`manually disconnected socket.id: ${player.socket.id}, username:${username}`);

    broadcastGameData(room);
}

export function broadcastGameData(room: string) {
    const game = getGame(room);
    const { state, players } = game;

    let data;

    if (state === GAME_STATE.LOBBY) {
        data = getLobbyData(game);
    } else if (state === GAME_STATE.QUESTION) {
        data = getQuestionData(game);
    } else if (state === GAME_STATE.JUDGING) {
        data = getJudgingData(game);
    }

    for (let i = 0; i < players.length; i++) {
        players[i].socket.emit("game", {
            isHost: !i,
            ...data,
        });
    }
}

function getJudgingData({ topic, players }: Room) {
    return {
        screen: GAME_SCREEN.JUDGING,
        topic,
        players: players.map(({ username, points, answer, majority, cow }) => ({
            username,
            points,
            answer,
            majority,
            cow,
        })),
    };
}

function getLobbyData({ players }: Room) {
    return {
        screen: GAME_SCREEN.LOBBY,
        players: players.map(({ username }) => {
            return {
                username,
            };
        }),
    };
}

function getQuestionData({ topic, players }: Room) {
    return {
        screen: GAME_SCREEN.QUESTION,
        topic,
        players: players.map(({ username, points, cow, answer }) => {
            return {
                username,
                points,
                cow,
                answered: answer ? answer.length > 0 : false,
            };
        }),
    };
}

export function addNewPlayer(room: string, username: string, socket: Socket) {
    game[room].players.push({
        socket,
        username,
    });

    console.log(
        `added new player ${socket.id} ${username}. Total players: ${game[room].players.length}`
    );
}

export function updatePlayer(room: string, index: number, socket: Socket) {
    const player = game[room].players[index];

    const oldSocket = player.socket;

    disconnectSocket(oldSocket);

    player.socket = socket;

    console.log(
        `updated player ${socket.id} ${player.username}. Total players: ${game[room].players.length}`
    );
}

export function disconnectSocket(socket: Socket) {
    socket.disconnect();
}

export function findPlayerByRoomAndUsername(room: string, username: string) {
    const { players } = getGame(room);

    return players.find((p) => p.username === username);
}

export function findPlayerByRoomAndSocket(room: string, socket: Socket) {
    const { players } = getGame(room);

    return players.find((p) => p.socket.id === socket.id);
}

export function findPlayerIndexByRoomAndUsername(
    room: string,
    username: string
) {
    const { players } = getGame(room);

    return players.findIndex((p) => p.username === username);
}

export function isSocketHost(room: string, socket: Socket) {
    const { players } = getGame(room);

    return players.findIndex((p) => p.socket.id === socket.id) === 0;
}

export function handleDisconnect(socket: Socket) {
    try {
        const { room, username } = decodeToken(
            socket.handshake.auth.token
        ) as JwtPayload;

        const index = findPlayerIndexByRoomAndUsername(room, username);

        if (index === -1) {
            throw new Error("Player not found");
        }

        const { players } = getGame(room);

        // totally remove the player since game not started
        if (!isGameStarted(room)) {
            players.splice(index, 1);
        }

        if (!players.length) {
            console.log(`room ${room} is now empty`);
        }
    } catch (error: any) {
        console.error(`failed to remove player ${error?.message}`);
    }
}

export function kickPlayer(socket: Socket, index: number) {
    try {
        const { room } = decodeToken(socket.handshake.auth.token) as JwtPayload;

        if (!isSocketHost(room, socket)) {
            throw new Error("Host only function");
        }

        if (!index) {
            throw new Error("Host cannot be kicked");
        }

        if (index < 0 || index >= game[room].players.length) {
            throw new Error("Invalid kick target index");
        }

        const { players } = getGame(room);

        const player = players[index];

        disconnectSocket(player.socket);
        players.splice(index, 1);
        broadcastGameData(room);
    } catch (error: any) {
        socket.emit("error", error?.message);
    }
}

export function startGame(socket: Socket) {
    try {
        const { room } = getAuthToken(socket);
        if (!isSocketHost(room, socket)) {
            throw new Error("Host only function");
        }

        if (isGameStarted(room)) {
            throw new Error("Game already started");
        }

        game[room].players.forEach((player) => {
            player.points = 0;
            player.cow = false;
        });

        startNewRound(room);
        broadcastGameData(room);
    } catch (error: any) {
        socket.emit("error", error?.message);
    }
}

function startNewRound(room: string) {
    game[room].players.forEach((player) => {
        player.majority = false;
        player.answer = undefined;
    });

    game[room].topic = randomizeTopic(room);
    game[room].state = GAME_STATE.QUESTION;

    console.log("started new round", room, "topic:", game[room].topic);
}

export function answer(socket: Socket, ans: string) {
    try {
        const { room } = getAuthToken(socket);

        const { state, players } = getGame(room);

        if (state !== GAME_STATE.QUESTION) {
            throw new Error("Invalid game state");
        }

        if (!ans) {
            throw new Error("Invalid answer");
        }

        const player = findPlayerByRoomAndSocket(room, socket);

        if (!player) {
            throw new Error("Player not found");
        }

        if (player.answer) {
            throw new Error("Can only answer once");
        }

        player.answer = ans.trim();

        if (players.every((player) => player.answer)) {
            game[room].state = GAME_STATE.JUDGING;
        }

        broadcastGameData(room);
    } catch (error: any) {
        socket.emit("error", error?.message);
    }
}

function randomizeTopic(room: string) {
    const totalTopics = TOPICS.length;

    let usedTopics = game[room].usedTopics;

    if (!usedTopics) {
        usedTopics = new Set<number>();
    }

    if (totalTopics >= usedTopics.size) {
        usedTopics.clear();
    }

    while (true) {
        const index = Math.floor(Math.random() * (totalTopics - 0 + 1) + 0);

        if (usedTopics.has(index)) {
            continue;
        }

        usedTopics.add(index);

        console.log("rolled topic", TOPICS[index]);

        return TOPICS[index];
    }
}
export function isGameStarted(room: string) {
    return getGame(room).state !== GAME_STATE.LOBBY;
}

function getAuthToken(socket: Socket) {
    try {
        return decodeToken(socket.handshake.auth.token) as JwtPayload;
    } catch (error) {
        throw error;
    }
}

export function majority(socket: Socket, index: number) {
    try {
        const { room } = getAuthToken(socket);

        const { state, players } = getGame(room);

        if (state !== GAME_STATE.JUDGING) {
            throw new Error("Mismatching Game State");
        }

        if (!isSocketHost(room, socket)) {
            throw new Error("Host-only function");
        }

        if (index < 0 || index >= players.length) {
            throw new Error("Invalid index");
        }

        const player = players[index];

        player.majority = !player.majority;

        broadcastGameData(room);
    } catch (error: any) {
        socket.emit("error", error?.message);
    }
}

export function cow(socket: any, index: number) {
    try {
        const { room } = getAuthToken(socket);
        const { state, players } = getGame(room);

        if (state !== GAME_STATE.JUDGING) {
            throw new Error("Mismatching Game State");
        }

        if (!isSocketHost(room, socket)) {
            throw new Error("Host-only function");
        }

        for (let i = 0; i < players.length; i++) {
            const player = players[i];

            if (i === index) {
                player.cow = !player.cow;
            } else {
                player.cow = false;
            }
        }

        broadcastGameData(room);
    } catch (error: any) {
        socket.emit("error", error?.message);
    }
}

export function award(socket: any) {
    try {
        const { room } = getAuthToken(socket);
        const { state, players } = getGame(room);
        if (state !== GAME_STATE.JUDGING) {
            throw new Error("Mismatching Game State");
        }

        if (!isSocketHost(room, socket)) {
            throw new Error("Host-only function");
        }

        for (let i = 0; i < players.length; i++) {
            const player = players[i];

            if (player.majority) {
                if (!player.points) {
                    player.points = 0;
                }

                player.points += 1;
            }
        }

        startNewRound(room);
        broadcastGameData(room);
    } catch (error: any) {
        socket.emit("error", error?.message);
    }
}

export function toLobby(socket: Socket) {
    try {
        const { room } = getAuthToken(socket);
        const { state, players } = getGame(room);
        if (!isSocketHost(room, socket)) {
            throw new Error("Host-only function");
        }

        if (state === GAME_STATE.LOBBY) {
            throw new Error("Already in lobby");
        }

        game[room].state = GAME_STATE.LOBBY;
        broadcastGameData(room);
    } catch (error: any) {
        socket.emit("error", error?.message);
    }
}
