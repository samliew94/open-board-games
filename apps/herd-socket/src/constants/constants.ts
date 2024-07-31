export interface User {
    socket: any;
    username: string;
}

export enum GAME_STATE {
    LOBBY,
    QUESTION_AND_ANSWER,
    JUDGING,
}

export enum GAME_SCREEN {
    LOBBY,
    QUESTION,
    JUDGING,
}

export const TOPICS = [
    "animal",
    "plant",
    "fruit",
    "vegetable",
    "color",
    "shape",
    "number",
    "vehicle",
    "sport",
    "hobby",
    "book",
    "movie",
    "drama",
    "singer (male)",
    "singer (female)",
    "actor (male)",
    "actress (female)",
    "movie character",
    "drama character",
    "historical book",
    "children story",
    "hot drink",
    "cold drink",
    "fried food",
    "dessert",
    "occupation",
    "school subject",
    "clothing",
    "electronic",
    "toy",
    "body part/organ",
    "family member",
    "emotion",
    "bird",
    "fish",
    "flower",
    "house furniture",
    "office furniture",
    "space object",
    "festival",
    "music instrument",
    "superpower",
    "building",
];
