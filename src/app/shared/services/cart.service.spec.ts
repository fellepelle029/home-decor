import {CartService} from "./cart.service";
import {of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TestBed} from "@angular/core/testing";

describe('cart service', () => {

  let cartService: CartService;
  const countValue = 3;
  let httpValueServiceSpy: jasmine.SpyObj<HttpClient>;


  beforeEach(() => {
    httpValueServiceSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpValueServiceSpy.get.and.returnValue(of({count: countValue}));


    TestBed.configureTestingModule({
      providers: [
        CartService,
        {provide: HttpClient, useValue: httpValueServiceSpy}
      ]
    });
    cartService = TestBed.inject(CartService);
  });

  it('should emit new count value', (done: DoneFn) => {
    cartService.count$.subscribe(value => {
      expect(value).toBe(countValue);
      done();
    });

    cartService.getCartCount().subscribe();
  });

  it('should make http request for cart data', function (done: DoneFn) {
    cartService.getCart().subscribe(() => {
      expect(httpValueServiceSpy.get).toHaveBeenCalledWith(environment.api + 'cart', {withCredentials: true});
      done();
    });
  });

});
