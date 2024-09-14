import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {Column} from "@models/interfaces/column";
import {environment} from "@environments/environment.development";
import {ToastSeverity} from "@constants/toast-severity";
import {ToastService} from "@shared/toast/toast.service";

@Injectable({
  providedIn: "root"
})
export class ColumnsService {
  private http = inject(HttpClient)
  private toastService = inject(ToastService)
  private _url = `${environment.apiUrl}${environment.endpoints.columns}`

  getAllColumns(): Observable<Column[]> {
    return this.http.get<Column[]>(this._url).pipe(
      catchError(() => {
        this.toastService.showToast(ToastSeverity.ALERT, 'Errore nel caricamento delle colonne')
        return of([])
      }),
    )
  }
}
