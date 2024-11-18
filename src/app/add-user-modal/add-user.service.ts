import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from "rxjs";
import {User} from "../users/users-data";
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AddUserService {
private urlAddUser = 'https://fakestoreapi.com/users'

  constructor(private http: HttpClient, private toast: ToastrService,) { }

  addNewUser(firstName: string, lastName: string, email: string, numberPhone:string){
    const body = {
      email: email,
      username: 'NoName',
      password: 'NoName',
      name: {
        firstname: firstName,
        lastname: lastName,
      },
      address: {
        city: 'NoCity',
        street: 'NoStreet',
        number: 3,
        zipcode: '12926-3874',
        geolocation: {
          lat: '-37.3159',
          long: '81.1496',
        },
      },
      phone: numberPhone,
    };
    return this.http.post<User>(this.urlAddUser, body).pipe(
      map((success) => {
        this.toast.success('Пользователь успешно добален', 'Отлично!')
        return success

      }),
      catchError((error: Error) => {
        console.error(error);
        this.toast.error('Что-то пошло не так', 'Упс!')
        throw error;
      })
    )
  }

}
