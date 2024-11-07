import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngxs/store';
import {Login, Logout} from "./auth.action";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
private url = 'https://fakestoreapi.com/auth/login';


  constructor(private http: HttpClient, private toast: ToastrService, private store: Store) { }

  isLoggedIn(): boolean {
    return this.store.selectSnapshot(state => state.auth.isAuthenticated)
  }

 public login(username: string, password: string): Observable<boolean> {
    const body = {username, password}
    return this.http.post<string>(this.url, body).pipe(
      map(success => {
        if (success) {
          this.store.dispatch(new Login());
        }
        return true
      }),
      catchError(error => {
        console.error(error);
        this.toast.error('Неправильный UserName или password', 'Error')
        throw error
      })
    )
  }

  logou() {
    this.store.dispatch(new Logout())
  }

}
