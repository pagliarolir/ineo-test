import {User} from "@models/interfaces/user";

export type ManageTaskPayload = { user: User | null, label: string, tags: number[] }
