import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/defaultResponse.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  products: FavoriteType[] = [];
  product!: FavoriteType;
  count: number = 1;
  serverStaticPath = environment.serverStaticPath;



  constructor(private favoriteService: FavoriteService) {
  }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        if (data as FavoriteType[]) {
          this.products = data as FavoriteType[];
          console.log(data);
        }
      });
  }

  removeProductFromFavorite(productId: string) {
    this.favoriteService.removeFavorite(productId)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.products = this.products.filter(product => product.id !== productId);
      });
  }

}



// _________________________________________________________________________________________________________________

// removeFromFavorites(id: string) {
//   this.favoriteService.removeFavorite(id)
//     .subscribe((data: DefaultResponseType) => {
//       if (data.error) {
//         throw new Error(data.message);
//       }
//       this.products = this.products.filter(item => item.id !== id);
//     })
// }

// addProductToCart(productId: string) {
//   this.cartService.updateCart(productId, this.count)
//     .subscribe((data: CartType | DefaultResponseType) => {
//       if ((data as DefaultResponseType).error !== undefined) {
//         const error = (data as DefaultResponseType).message
//         throw new Error(error)
//       }
//       if (data as CartType) {
//         this.productToAdd.countInCart = this.count;
//       }
//     });
// }

// removeFromCart(product: FavoriteType) {
//   this.cartService.updateCart(product.id, 0)
//     .subscribe((data: CartType| DefaultResponseType) => {
//       if ((data as DefaultResponseType).error !== undefined) {
//         const error = (data as DefaultResponseType).message
//         throw new Error(error)
//       }
//       this.productToAdd.countInCart = 0;
//       this.count = 1;
//     });
// }
//
//
//
//
// updateCount(value: number) {
//   this.count = value;
//   if (this.productToAdd.countInCart) {
//     this.cartService.updateCart(this.productToAdd.id, this.count)
//       .subscribe((data: CartType | DefaultResponseType) => {
//         if ((data as DefaultResponseType).error !== undefined) {
//           const error = (data as DefaultResponseType).message
//           throw new Error(error)
//         }
//         this.productToAdd.countInCart = this.count;
//
//       });
//   }
// }
