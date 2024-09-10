import {Tag} from "./tag";

export interface Task {
  id: number,
  label: string,
  column: number,
  userId: number,
  tags: Tag[]
}
