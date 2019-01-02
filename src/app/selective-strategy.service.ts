import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})

export class SelectiveStrategy implements PreloadingStrategy {

    preload(route: Route, load:Function): Observable<any> {
        if (route.data && route.data['preload']) {
            //if this is set: route.data and
            //this is true: route.data['preload']
            return load();  //now the route is pre-loaded
        }
        return of(null);
    }
}