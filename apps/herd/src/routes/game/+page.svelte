<script lang="ts">
    import Disconnected from "$lib/components/disconnected.svelte";
    import Logout from "$lib/components/logout.svelte";
    import MyError from "$lib/components/my_error.svelte";
    import ToLobby from "$lib/components/to_lobby.svelte";
    import Judging from "$lib/game/judging.svelte";
    import Lobby from "$lib/game/lobby.svelte";
    import Question from "$lib/game/question.svelte";
    import {
        getSocket,
        initSocketServer,
        socketConnect,
    } from "$lib/socket/socket.client";
    import { getContext, onMount, setContext } from "svelte";
    import { writable } from "svelte/store";

    const auth: any = getContext("auth");

    let gameData = writable<any>();
    setContext("gameData", gameData);

    let disconnected = writable(false);
    setContext("disconnected", disconnected);

    onMount(() => {
        initSocketServer($auth);

        getSocket()?.on("game", (data) => {
            console.log("game", data);
            $gameData = data;
        });

        getSocket()?.on("disconnect", (reason: any) => {
            console.log("client disconnected reason:", reason);
            $disconnected = true;
        });

        getSocket()?.on("error", (error: any) => {
            $gameData.error = error;
        });

        socketConnect();

        // gameData.set({
        //     screen: 0,
        //     isHost: true,
        //     users: Array.from({ length: 30 }).map(
        //         (_, i) => `PLAYER ${i + 1}`
        //     ),
        // });

        // gameData.set({
        //     screen: 1,
        //     isHost: true,
        //     topic: "vegetable",
        //     users: Array.from({ length: 10 }).map((_, i) => ({
        //         username: `PLAYER ${i + 1}`,
        //         answered: Math.random() < 0.5 ? true : false,
        //         points: Math.floor(Math.random() * (8 - 0 + 1)) + 0,
        //         cow: true,
        //     })),
        // });

        // gameData.set({
        //     screen: 2,
        //     isHost: true,
        //     topic: "vegetable",
        //     users: Array.from({ length: 10 }).map((_, i) => ({
        //         username: `PLAYER ${i + 1}`,
        //         answer: "hang yu pin yin",
        //         majority: Math.random() < 0.5,
        //         cow: true,
        //     })),
        // });
    });
</script>

<Disconnected
    onRetry={() => {
        $disconnected = false;
        socketConnect();
    }}
/>
<MyError
    error={$gameData?.error}
    onCloseCallback={() => {
        $gameData.error = "";
    }}
/>
<Logout />
<ToLobby />

{#if $gameData?.screen === 0}
    <Lobby />
{:else if $gameData?.screen === 1}
    <Question />
{:else if $gameData?.screen === 2}
    <Judging />
{/if}
