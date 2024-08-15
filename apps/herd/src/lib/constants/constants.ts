export interface User {
    socket: any;
    username: string;
}

export enum GAME_STATE {
    LOBBY,
    QUESTION,
    JUDGING,
}

export enum GAME_SCREEN {
    LOBBY,
    QUESTION,
    JUDGING,
}

export const TOPICS = [
    "animal",
    "bird",
    "body part",
    "bright color",
    "building",
    "cheap toy",
    "clothing",
    "cold drink",
    "college subject",
    "dangerous animal",
    "dangerous weapon",
    "dark color",
    "dessert",
    "difficult school subject",
    "easy school subject",
    "electronic",
    "emotion",
    "expensive toy",
    "festival",
    "fish",
    "flower",
    "foreign landmark",
    "foreign language",
    "fruit",
    "harmless animal",
    "healthy food",
    "hobby",
    "hot drink",
    "house furniture",
    "local landmark",
    "local language",
    "mall",
    "medicine",
    "musical instrument",
    "number",
    "occupation",
    "office furniture",
    "outerspace",
    "plant",
    "restaurant food",
    "school subject",
    "shape",
    "sport",
    "stationary",
    "street food",
    "superpower",
    "sweet drink",
    "toy",
    "vegetable",
    "vehicle",
    "virus",
    "weather",
    "zoo animal"
];
