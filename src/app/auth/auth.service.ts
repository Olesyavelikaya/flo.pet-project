import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngxs/store';
import { Login, Logout } from './auth.action';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'https://fakestoreapi.com/auth/login';
  private userRoles: Record<string, string> = {
    mor_2314: 'admin',
  };

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private store: Store,
  ) {}

  public login(username: string, password: string): Observable<boolean> {
    const body = { username, password };
    return this.http.post<any>(this.url, body).pipe(
      map((response) => {
        if (response.token) {
          const role: string = this.userRoles[username] || 'viewer';
          this.store.dispatch(new Login(role));
        }
        return true;
      }),
      catchError((error) => {
        console.error(error);
        this.toast.error('Упс! Что-то пошло не так', 'Error');
        throw error;
      }),
    );
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}
