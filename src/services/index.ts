import Github from "./Github/actions/newPush";

export const actionMap = new Map<number, Function>([
    [23, Github.newPush]
]);

export const reactionMap = new Map<number, Function>([
    [1, () => {}]
]);