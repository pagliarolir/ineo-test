import {User} from "@models/interfaces/user";

export type AddTaskPayload = { user: User | null, label: string, tags: number[] }
