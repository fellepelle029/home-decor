import {Component, HostListener, Input, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/categoryWithType.type";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/defaultResponse.type";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showedSearch: boolean = false;
  searchField = new FormControl();
  searchValue: string = '';
  products: ProductType[] = [];
  serverStaticPath = environment.serverStaticPath;

  isLogged: boolean = false;
  @Input() categories: CategoryWithTypeType[] = [];
  count: number = 0;

  constructor(private authService: AuthService,
              private _snackbar: MatSnackBar,
              private cartService: CartService,
              private productService: ProductService,
              private router: Router) {
    this.isLogged = this.authService.isLoggedIn();
  }

  ngOnInit(): void {


    this.searchField.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
              this.showedSearch = true;
            });
        } else {
          this.products = [];
        }
      });


    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message
          throw new Error(error)
        }
        this.count = (data as { count: number }).count;
      })

    this.cartService.count$.subscribe(count => {
      this.count = count;
    })
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout()
        },
        error: () => {
          this.doLogout()
        },
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackbar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }


  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    // this.searchValue = '';
    this.searchField.setValue('');
    this.products = [];
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
      this.showedSearch = false;
    } else {
      this.showedSearch = true;
    }
  }


}


// changeShowedSearch(value: boolean) {
//   setTimeout(() => {
//     this.showedSearch = value;
//   }, 100);
// }

// changedSearchValue(newValue: string) {
//     this.searchValue = newValue;
//
//     if (this.searchValue && this.searchValue.length > 2) {
//       this.productService.searchProducts(this.searchValue)
//         .subscribe((data: ProductType[]) => {
//           this.products = data;
//           this.showedSearch = true;
//         });
//     } else {
//       this.products = [];
//     }
//   }
//
// }