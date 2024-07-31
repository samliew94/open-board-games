<script lang="ts">
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import "../app.css";

    export let data;

    const auth = writable();
    $: auth.set({
        user: data.user,
        token: data.token,
    });
    setContext("auth", auth);
</script>

<div class="border p-4 m-4">
    <slot></slot>
</div>
