export interface Task {
  id: number,
  label: string,
  column: number,
  userId: number,
  tags: number[],
  scheduledTime: number
}
