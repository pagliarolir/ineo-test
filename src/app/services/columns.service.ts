import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {Column} from "@models/interfaces/column";
import {environment} from "@environments/environment.development";

@Injectable({
  providedIn: "root"
})
export class ColumnsService {
  private http = inject(HttpClient)
  private _url = `${environment.apiUrl}${environment.endpoints.columns}`;

  getAllColumns(): Observable<Column[]> {
    return this.http.get<Column[]>(this._url).pipe(
      catchError(() => throwError(() => ({error: 'Errore nel caricamento delle colonne'})))
    )
  }
}
