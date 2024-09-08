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

  /*  filterTasks(query: number): Observable<Task[]> {
      /!* Set query params*!/
      const options = Object.keys(params).reduce((acc, key) => {
        const value = params[key as keyof ComponentReactiveResourceGetComponents$Params];
        if (key === 'types' && Array.isArray(value) && value.length === 0) {
          return acc; // If types in params obj exists but is an empty array, skip it
        }
        return !!value ? acc.set(key, value.toString()) : acc;
      }, new HttpParams());

      return this.http.get<Task[]>(this._url, {params: {column: columnId}}).pipe(
        catchError(() => throwError(() => ({error: 'Errore nel caricamento dei task'})))
      )
    }*/
}
