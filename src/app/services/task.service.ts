import {inject, Injectable, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment.development";
import {catchError, delay, EMPTY, finalize, of} from "rxjs";
import {Task} from "@models/interfaces/task";
import {ToastService} from "@shared/toast/toast.service";
import {ToastSeverity} from "@constants/toast-severity";

@Injectable({
  providedIn: "root"
})
export class TaskService {
  private http = inject(HttpClient)
  private toastService = inject(ToastService)
  private _url = `${environment.apiUrl}${environment.endpoints.tasks}`

  #tasks = signal<Task[]>([])
  tasks = this.#tasks.asReadonly()
  isLoadingGetAllTasks = signal(true)
  dragDropTask = signal<Task | null>(null)

  getAllTasks() {
    this.http.get<Task[]>(this._url).pipe(
      delay(2000),
      catchError(() => {
        this.toastService.showToast(ToastSeverity.ALERT, 'Errore nel caricamento dei task')
        return of([])
      }),
      finalize(() => this.isLoadingGetAllTasks.set(false))
    ).subscribe(tasks => this.#tasks.set([...tasks]))
  }


  addTask(payload: Omit<Task, 'id'>) {
    this.http.post<Task>(this._url, payload).pipe(
      catchError(() => {
        this.toastService.showToast(ToastSeverity.ALERT, "Errore nell'aggiunta del task")
        return EMPTY
      })
    ).subscribe(newTask => {
      this.toastService.showToast(ToastSeverity.SUCCESS, 'Task aggiunto con successo')
      this.#tasks.update(items => [...items, newTask]);
    })
  }

  editTask(payload: Task) {
    this.http.put<Task>(`${this._url}/${payload.id}`, payload).pipe(
      catchError(() => {
        this.toastService.showToast(ToastSeverity.ALERT, "Errore nella modifica del task")
        return EMPTY
      })
    ).subscribe(updatedTask => {
      this.toastService.showToast(ToastSeverity.SUCCESS, 'Task modificato con successo')
      return this.#tasks.update(items => items.map(el => el.id === payload.id ? {...updatedTask} : el));
    })
  }

  deleteTask(taskId: number) {
    this.http.delete<void>(`${this._url}/${taskId}`).pipe(
      catchError(() => {
        this.toastService.showToast(ToastSeverity.ALERT, "Errore nella cancellazione del task")
        return EMPTY
      })).subscribe(() => {
      this.toastService.showToast(ToastSeverity.SUCCESS, 'Task cancellato con successo')
      return this.#tasks.update(items => items.filter(el => el.id !== taskId));
    })
  }

  editTaskColumn(task: Task, columnId: number) {
    this.http.put<Task>(`${this._url}/${task.id}`, {...task, column: columnId}).pipe(
      catchError(() => {
        this.toastService.showToast(ToastSeverity.ALERT, "Errore nello spostamento del task")
        return EMPTY
      }),
      finalize(() => this.dragDropTask.set(null))
    ).subscribe(updatedTask => {
      this.toastService.showToast(ToastSeverity.SUCCESS, 'Task spostato con successo')
      return this.#tasks.update(items => items.map(el => el.id === task.id ? {...updatedTask} : el));
    })
  }
}
