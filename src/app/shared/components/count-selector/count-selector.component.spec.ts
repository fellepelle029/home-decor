import {CountSelectorComponent} from "./count-selector.component";
import {TestBed} from "@angular/core/testing";
import {FormsModule} from "@angular/forms";

describe('count selector', () => {
  let countSelectorComponent: CountSelectorComponent;

  beforeEach(() => {
    countSelectorComponent = new CountSelectorComponent();
  });

  it('should have count set', function () {
    expect(countSelectorComponent.count).toBeDefined();
  });

  it('should change value after increasing', function () {
    countSelectorComponent.count = 1;
    countSelectorComponent.increaseCount();
    expect(countSelectorComponent.count).toBe(2);
  });

  it('should not decrease value if it is equal 1', function () {
    countSelectorComponent.count = 1;
    countSelectorComponent.decreaseCount();
    expect(countSelectorComponent.count).toBe(1);
  });


  it('should emit value plus 1 after increasing', function (done: DoneFn) {
    countSelectorComponent.count = 1;
    countSelectorComponent.onCountChange.subscribe((newValue: number) => {
      expect(newValue).toBe(2);
    });
    countSelectorComponent.increaseCount();
    done();
  });

  it('should emit value minus 1 after decreasing', function (done: DoneFn) {
    countSelectorComponent.count = 5;
    countSelectorComponent.onCountChange.subscribe((newValue: number) => {
      expect(newValue).toBe(4);
    });
    countSelectorComponent.decreaseCount();
    done();
  });

  it('should change value in input after decreasing', function (done: DoneFn) {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CountSelectorComponent],
    });
    const fixture = TestBed.createComponent(CountSelectorComponent);
    const component = fixture.componentInstance;

    component.count = 5;
    component.decreaseCount();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const componentElement: HTMLElement = fixture.nativeElement;
      const input: HTMLInputElement  = componentElement.querySelector('input') as HTMLInputElement;

      expect(input.value).toBe('4');
      done();
    });
  });


});
