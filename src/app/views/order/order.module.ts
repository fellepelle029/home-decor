import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../shared/shared.module";

import { CartComponent } from './cart/cart.component';
import { OrderComponent } from './order/order.component';
import { OrderRoutingModule } from './order-routing.module';
import {CarouselModule} from "ngx-owl-carousel-o";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    CartComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CarouselModule,
    MatDialogModule,
    ReactiveFormsModule,
    OrderRoutingModule,
  ]
})
export class OrderModule { }
