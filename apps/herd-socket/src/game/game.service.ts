import { Injectable } from "@nestjs/common";
import { JwtPayload } from "jsonwebtoken";
import { GAME_SCREEN, GAME_STATE, TOPICS, User } from "src/constants/constants";
import { UsersService } from "src/users/users.service";

@Injectable()
export class GameService {
    updateUserData(userDataIndex: number, socket: any, payload: JwtPayload) {
        this.userData[userDataIndex].user = {
            socket,
            username: payload.username,
        };
    }
    private state: GAME_STATE = GAME_STATE.LOBBY;
    private topic: string = "";
    private usedTopics = new Set<number>();

    private userData: {
        user: User;
        answer?: string;
        points: number;
        majority?: boolean;
        cow?: boolean;
    }[] = [];

    constructor(private userService: UsersService) {}

    getGameState() {
        return this.state;
    }

    gameHasStarted() {
        return this.state !== GAME_STATE.LOBBY;
    }

    resetGame() {
        this.state = GAME_STATE.LOBBY;
        this.userData.length = 0;
    }

    getUserData() {
        return this.userData;
    }

    getGameData() {
        if (this.state === GAME_STATE.LOBBY) {
            return this.getLobbyData();
        } else if (this.state === GAME_STATE.QUESTION_AND_ANSWER) {
            return this.getQuestionAndAnswerData();
        } else if (this.state === GAME_STATE.JUDGING) {
            return this.getJudgingData();
        }
    }

    private getLobbyData() {
        const users = this.userService.getUsers();

        return {
            screen: GAME_SCREEN.LOBBY,
            users: users.map(({ username }) => ({
                username,
            })),
        };
    }

    startGame(socket: any) {
        const userHost = this.userService.findHost();

        if (!userHost || userHost.socket.id !== socket.id) {
            throw new Error("Only host can start game!");
        }

        if (this.state !== GAME_STATE.LOBBY) {
            throw new Error("Mismatching Game State");
        }

        const users = this.userService.getUsers();
        const totalUsers = users.length;
        if (totalUsers < 1) {
            throw new Error(
                "Insufficient players (min 4) current is " + totalUsers
            );
        }

        this.userData = users.map((user, i) => ({
            user,
            points: 0,
        }));

        this.startNewRound();
    }

    startNewRound() {
        this.userData.forEach((data) => {
            data.answer = undefined;
            data.majority = undefined;
        });

        this.topic = this.randomizeTopic();
        console.log("starting new round with topic", this.topic);
        this.state = GAME_STATE.QUESTION_AND_ANSWER;
    }

    private randomizeTopic(): string {
        const totalTopics = TOPICS.length;

        if (this.usedTopics.size === totalTopics) {
            this.usedTopics.clear();
        }

        while (true) {
            const index = Math.floor(Math.random() * (totalTopics - 0 + 1) + 0);

            if (this.usedTopics.has(index)) {
                continue;
            }

            this.usedTopics.add(index);

            return TOPICS[index];
        }
    }

    private getQuestionAndAnswerData() {
        const userData = this.userData;

        return {
            screen: GAME_SCREEN.QUESTION,
            topic: this.topic,
            users: userData.map(
                ({ user: { username }, points, answer, cow }) => ({
                    username,
                    points,
                    answered: answer !== undefined,
                    cow,
                })
            ),
        };
    }

    answer(socket: any, payload: any) {
        if (this.state !== GAME_STATE.QUESTION_AND_ANSWER) {
            throw new Error("Mismatching Game State");
        }
        const user = this.userService.find(socket);

        if (!user) {
            throw new Error("User not found");
        }

        const { answer } = payload;

        if (!answer) {
            throw new Error("Missing answer");
        }

        const ud = this.userData.find(
            (data) => data.user.socket.id === user.socket.id
        );

        if (ud.answer) {
            throw new Error("Can only answer once");
        }

        ud.answer = answer;

        if (this.userData.every((data) => data.answer)) {
            this.state = GAME_STATE.JUDGING;
        }
    }

    private getJudgingData() {
        const userData = this.userData;

        return {
            screen: GAME_SCREEN.JUDGING,
            topic: this.topic,
            users: userData.map(
                ({ user: { username }, points, answer, majority, cow }) => ({
                    username,
                    points,
                    answer,
                    majority,
                    cow,
                })
            ),
        };
    }

    majority(socket: any, payload: any) {
        if (this.state !== GAME_STATE.JUDGING) {
            throw new Error("Mismatching Game State");
        }

        const userHost = this.userService.findHost();

        if (!userHost || userHost.socket.id !== socket.id) {
            throw new Error("Host-only function");
        }

        const { user: targetIndex } = payload;

        this.userData[targetIndex].majority =
            !this.userData[targetIndex].majority;
    }

    cow(socket: any, payload: any) {
        if (this.state !== GAME_STATE.JUDGING) {
            throw new Error("Mismatching Game State");
        }

        const userHost = this.userService.findHost();

        if (!userHost || userHost.socket.id !== socket.id) {
            throw new Error("Host-only function");
        }

        const { user: targetIndex } = payload;

        for (let i = 0; i < this.userData.length; i++) {
            const user = this.userData[i];

            if (i === targetIndex) {
                user.cow = !user.cow;
            } else {
                user.cow = false;
            }
        }
    }

    award(socket: any, payload: any) {
        if (this.state !== GAME_STATE.JUDGING) {
            throw new Error("Mismatching Game State");
        }

        const userHost = this.userService.findHost();

        if (!userHost || userHost.socket.id !== socket.id) {
            throw new Error("Host-only function");
        }

        for (let i = 0; i < this.userData.length; i++) {
            const user = this.userData[i];

            if (user.majority) {
                user.points += 1;
            }
        }

        this.startNewRound();
    }

    toLobby(socket: any) {
        if (this.state === GAME_STATE.LOBBY) {
            throw new Error("Already in Lobby");
        }

        const userHost = this.userService.findHost();

        if (!userHost || userHost.socket.id !== socket.id) {
            throw new Error("Host-only function");
        }

        this.resetGame();
    }

    findUserDataByUsername(username: string) {
        return this.userData.find((data) => data.user.username === username);
    }

    findUserDataIndexByUsername(username: string) {
        return this.userData.findIndex(
            (data) => data.user.username === username
        );
    }
}
