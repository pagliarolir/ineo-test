import {inject, Injectable, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment.development";
import {catchError, delay, finalize, of, throwError} from "rxjs";
import {Task} from "@models/interfaces/task";

@Injectable({
  providedIn: "root"
})
export class TaskService {
  private http = inject(HttpClient)
  private _url = `${environment.apiUrl}${environment.endpoints.tasks}`;

  #tasks = signal<Task[]>([])
  tasks = this.#tasks.asReadonly()
  isLoadingGetAllTasks = signal(true)

  getAllTasks() {
    this.http.get<Task[]>(this._url).pipe(
      delay(2000),
      catchError(() => {
        throwError(() => ({error: 'Errore nel caricamento dei task'}))
        return of([])
      }),
      finalize(() => this.isLoadingGetAllTasks.set(false))
    ).subscribe(tasks => this.#tasks.set([...tasks]))
  }


  addTask(payload: Omit<Task, 'id'>) {
    this.http.post<Task>(this._url, payload).pipe(
      catchError(() => throwError(() => ({error: 'Errore nella creazione del task'}))),
    ).subscribe(newTask => this.#tasks.update(items => [...items, newTask]))
  }

  editTask(payload: Task) {
    this.http.put<Task>(`${this._url}/${payload.id}`, payload).pipe(
      catchError(() => throwError(() => ({error: 'Errore nella modifica del task'}))),
    ).subscribe(updatedTask => {
      return this.#tasks.update(items => items.map(el => el.id === payload.id ? {...updatedTask} : el));
    })
  }

  deleteTask(taskId: number) {
    this.http.delete<void>(`${this._url}/${taskId}`).pipe(
      catchError(() => throwError(() => ({error: 'Errore nella cancellazione del task'}))),
    ).subscribe(() => {
      return this.#tasks.update(items => items.filter(el => el.id !== taskId));
    })
  }
}
