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
    dataIsValid: {[key: string]: boolean} = {};
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
    if (this.isValid()) {
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
    isValid(path?: string): Boolean {
console.log('6');
        this.validate();
console.log('7');
        if (path) {
console.log('8');
            return this.dataIsValid[path];
        }
console.log('9');
        return (this.dataIsValid &&
            Object.keys(this.dataIsValid).every(d => this.dataIsValid[d] === true));
    }

    validate(): void {
        //clear first
        this.dataIsValid = {};
console.log('1');
        //info tab
        if (this.product.productName &&
            this.product.productName.length >= 3 &&
            this.product.productCode) {
            this.dataIsValid['info'] = true;
console.log('2');
        } else {
console.log('3');
            this.dataIsValid['info'] = false;
        }

        //tags tab
        if (this.product.category &&
            this.product.category.length >= 3) {
                console.log('4');
            this.dataIsValid['tags'] = true;
        } else {
            console.log('5');
            this.dataIsValid['tags'] = false;
        }
    }


}
