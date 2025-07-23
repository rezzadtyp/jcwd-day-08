export interface Todo {
    objectId: string,
    title: string,
    completed: boolean,
    created?: string,
    updated?: string,
}

export interface User {
    email: string,
    password?: string
}