import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from "rxjs";
import {User} from "../users/users-data";


@Injectable({
  providedIn: 'root'
})
export class AddUserService {
private urlAddUser = 'https://fakestoreapi.com/users'
  private urlAddPhoto = 'http://localhost:3000/photos/upload'
  constructor(private http: HttpClient) { }

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
        console.log('user', success)
        return success

      }),
      catchError((error: Error) => {
        console.error(error);
        throw error;
      })
    )
  }

  addNewPhoto(file: string | ArrayBuffer){
  const body = {file}
    return this.http.post(this.urlAddPhoto, body).pipe(
      map((success) => {
        console.log('p', success)
        return success
      }),
      catchError((error: Error) => {
        console.error(error);
        throw error;
      })
    )
  }
}
