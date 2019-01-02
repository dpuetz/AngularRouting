import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AuthGuard } from './user/auth.guard';
import { SelectiveStrategy } from './selective-strategy.service';

@NgModule({
  declarations: [],
  imports: [
   RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent },
      { path: 'products',
        loadChildren: './products/product.module#ProductModule',
        data: { preload: true },
        canActivate: [AuthGuard]
      },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
   ],  {preloadingStrategy: SelectiveStrategy} )
  ],
  exports: [
    RouterModule
  ]

})
export class AppRoutingModule { }
