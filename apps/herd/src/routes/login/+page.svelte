<script lang="ts">
    import Loading from "$lib/loading/loading.svelte";
    import { superForm } from "sveltekit-superforms";

    export let data: any;

    // Client API:
    const { form, errors, message, enhance, delayed } = superForm(data.form, {
        resetForm: false,
    });
</script>

<div class="space-y-4">
    <div class="flex justify-center">
        <img
            src="https://www.bookxcess.com/cdn/shop/files/51jRz0kObkL._AC_SL1080.jpg?v=1702363628"
            alt="cover"
            class="rounded-md sm:max-w-[50%] text-center"
        />
    </div>

    {#if $message?.error}
        <p class="text-error text-center">{$message.error}</p>
    {/if}

    <form method="POST" class="grid gap-4" use:enhance>
        <h1 class="text-center">login</h1>
        <label for="username">
            {#if $errors?.username}
                <p class="text-error">{$errors.username[0]}</p>
            {/if}
            <p>Username:</p>
            <input
                type="text"
                name="username"
                class="uppercase"
                bind:value={$form.username}
            />
        </label>

        <label for="room">
            {#if $errors?.room}
                <p class="text-error">{$errors.room[0]}</p>
            {/if}
            <p>Room:</p>
            <input
                type="text"
                name="room"
                class="uppercase"
                bind:value={$form.room}
            />
        </label>

        <div class="text-center">
            <button class="btn" disabled={$delayed}>Submit</button>
        </div>
        {#if $delayed}
            <Loading />
        {/if}
    </form>
</div>
