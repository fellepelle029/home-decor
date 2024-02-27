import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FavoriteType} from "../../../../types/favorite.type";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FavoriteService} from "../../services/favorite.service";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/defaultResponse.type";
import {CartType} from "../../../../types/cart.type";
import {Router} from "@angular/router";

@Component({
  selector: 'app-favorite-product',
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.scss']
})
export class FavoriteProductComponent implements OnInit {

  @Input() product!: FavoriteType;
  @Input() countInCart: number | undefined = 0;

  count: number = 1;
  serverStaticPath = environment.serverStaticPath;



  constructor(private favoriteService: FavoriteService,
              private cartService: CartService,) {
  }

  ngOnInit(): void {
    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }
  }


  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.product.id = id;
        window.location.reload()
      })
  }


  addProductToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType| DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message
          throw new Error(error)
        }
        this.countInCart = this.count;
      });
  }

  removeFromCart(product: FavoriteType) {
    this.cartService.updateCart(product.id, 0)
      .subscribe((data: CartType| DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message
          throw new Error(error)
        }
        this.countInCart = 0;
        this.count = 1;
      });
  }




  updateCount(value: number) {
    this.count = value;
    if (this.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType| DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message
            throw new Error(error)
          }
          this.countInCart = this.count;
        });
    }
  }

}
