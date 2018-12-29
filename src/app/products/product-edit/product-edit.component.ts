import { Component, OnInit } from '@angular/core';

import { MessageService } from '../../messages/message.service';

import { Product, ProductResolved } from '../product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})

export class ProductEditComponent implements OnInit {
  pageTitle = 'Product Edit';
  errorMessage: string;

  product: Product;

    constructor(private productService: ProductService,
              private messageService: MessageService,
              private router: ActivatedRoute,
              private routeNav: Router) {
        this.router.data.subscribe(data => {
            const resolveData: ProductResolved = this.router.snapshot.data['resolvedData'];
            this.errorMessage = resolveData.error;
            this.onProductRetrieved( resolveData.product);
        });
    }

    ngOnInit() {

    }

    // don't need this after we started used the route resolver
//   ngOnInit() {
//     this.router.paramMap.subscribe( params => {
//         const id = +params.get('id');
//         if (!isNaN(id)) {
//             this.getProduct(id);
//         }
//     });
//   }

//   getProduct(id: number): void {
//     this.productService.getProduct(id)
//       .subscribe(
//         (product: Product) => this.onProductRetrieved(product),
//         (error: any) => this.errorMessage = <any>error
//       );
//   }

  onProductRetrieved(product: Product): void {
    this.product = product;

    if (!this.product) {
      this.pageTitle = 'No product found';
    } else {
      if (this.product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id)
          .subscribe(
            () => this.onSaveComplete(`${this.product.productName} was deleted`),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  saveProduct(): void {
    if (true === true) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product)
          .subscribe(
            () => this.onSaveComplete(`The new ${this.product.productName} was saved`),
            (error: any) => this.errorMessage = <any>error
          );
      } else {
        this.productService.updateProduct(this.product)
          .subscribe(
            () => this.onSaveComplete(`The updated ${this.product.productName} was saved`),
            (error: any) => this.errorMessage = <any>error
          );
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }

    // Navigate back to the product list
    this.routeNav.navigate(['/products']);
  }
}
