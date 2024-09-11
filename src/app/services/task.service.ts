import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {catchError, Observable, throwError} from "rxjs";
import {Task} from "../models/interfaces/task";

@Injectable({
  providedIn: "root"
})
export class TaskService {
  private http = inject(HttpClient)
  private _url = `${environment.apiUrl}${environment.endpoints.tasks}`;

  getTasksByColumn(columnId: number): Observable<Task[]> {
    return this.http.get<Task[]>(this._url, {params: {column: columnId}}).pipe(
      catchError(() => throwError(() => ({error: 'Errore nel caricamento dei task'})))
    )
  }

  addTask(payload: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this._url, payload)
  }
}
