import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {  ProductResolved } from './product';
import { Observable, of } from 'rxjs';
import { ProductService } from './product.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<ProductResolved> {

    constructor(private productService: ProductService) {}

    resolve(route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot): Observable<ProductResolved> {
        const id = route.paramMap.get('id');
        if (isNaN(+id)) {
            const message = `Product id was not a number ${id}`;
            console.log(message);
            // return false; // will keep from going to the page. they stay the same place.
            // return null;  //let page handle that
            // navigate to error page;
            // keep error message in the resolved data
            return of( {product: null, error: message} );
        }
        // we don't subscribe here. the resolver manages the subscription for us.
        return this.productService.getProduct(+id)
            .pipe (
                map(product => ({product: product})),
                catchError(error => {
                    const message = `Retrieval error: ${error}`;
                    console.log(message);
                    return of({ product: null, error: message});
                })
            );
    }
}
