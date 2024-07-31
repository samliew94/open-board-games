import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
    private users: {
        socket: any;
        username: string;
    }[] = [];

    add(socket: any, payload: any) {
        const user = {
            socket,
            username: payload.username,
        };
        this.users.push(user);
        console.log("added users. totalUsers", this.users.length);
    }
    remove(socket: any) {
        this.users = this.users.filter((user) => user.socket.id !== socket.id);
        console.log("removed users. totalUsers", this.users.length);
    }

    getUsers() {
        return this.users;
    }

    findHost() {
        return this.users[0];
    }

    find(socket: any) {
        if (!socket?.id) {
            throw new Error("Invalid Socket ID!");
        }

        return this.users.find((user) => user.socket.id === socket.id);
    }

    findByIndex(index: number) {
        return this.users[index];
    }

    findIndex(socket: any) {
        return this.users.findIndex((user) => user.socket.id === socket.id);
    }

    findByUsername(username: string) {
        return this.users.findIndex((user) => user.username === username);
    }

    updateUser(index: number, socket: any, payload: any) {
        this.users[index] = {
            socket,
            username: payload.username,
        };
    }
}
