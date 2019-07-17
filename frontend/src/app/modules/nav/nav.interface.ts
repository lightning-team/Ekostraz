import {EventEmitter} from '@angular/core';

export interface NavInterface {
    isLoggedIn: boolean;
    logIn: EventEmitter<{}>;
    logOut: EventEmitter<{}>;
}
