import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { AuthState } from './auth/auth.state';
import {UsersState} from "./users/users.state";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {CartState} from "./user/cart.state";
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideAnimations(),
    provideToastr(),
    provideStore([AuthState, UsersState, CartState], withNgxsStoragePlugin({ keys: ['auth', 'users', 'carts'] })),
    provideAnimationsAsync(), provideCharts(withDefaultRegisterables()),
  ],
};
