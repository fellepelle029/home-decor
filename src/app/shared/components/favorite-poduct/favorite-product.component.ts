import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FavoriteType} from "../../../../types/favorite.type";
import {environment} from "../../../../environments/environment";
import {FavoriteService} from "../../services/favorite.service";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/defaultResponse.type";
import {CartType} from "../../../../types/cart.type";

@Component({
  selector: 'app-favorite-product',
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.scss']
})
export class FavoriteProductComponent implements OnInit {

  @Input() product!: FavoriteType;
  @Input() countInCart: number | undefined = 0;
  @Output() removeFromFavorite: EventEmitter<string> = new EventEmitter<string>();

  count: number = 1;
  serverStaticPath = environment.serverStaticPath;


  constructor(private favoriteService: FavoriteService,
              private cartService: CartService,) {
  }

  ngOnInit(): void {

    this.cartService.getCart()
      .subscribe((cartData: CartType | DefaultResponseType) => {
        if ((cartData as DefaultResponseType).error !== undefined) {
          const error = (cartData as DefaultResponseType).message
          throw new Error(error)
        }

        const cartDataResponse = cartData as CartType

        if (cartDataResponse) {
          const productInCart = cartDataResponse.items.find(item => item.product.id === this.product.id)
          if (productInCart) {
            this.product.countInCart = productInCart.quantity;
            this.count = this.product.countInCart;
          }
        }
      });

    if (this.countInCart && this.countInCart > 1) {
      this.count = this.countInCart;
    }
  }

  removeFavorite(productId: string) {
    this.removeFromFavorite.emit(productId);
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
