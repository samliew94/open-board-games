/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            colors: {},
            animation: {
                "spin-fast": "spin 0.5s linear infinite",
            },
        },
        screens: {
            sm: "320px",
            md: "768px",
            lg: "1024px",
            xl: "1440px",
            "2xl": "2560px",
        },
    },
    plugins: [],
};
