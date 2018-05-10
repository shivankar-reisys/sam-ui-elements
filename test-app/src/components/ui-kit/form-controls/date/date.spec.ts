import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';
// Load the implementations that should be tested
import { SamDateComponent } from './date.component';
import { SamWrapperModule } from '../../wrappers';
import {SamFormService } from '../../form-service';

describe('The Sam Date component', () => {
  describe('Isolated tests', () => {
    let component: SamDateComponent;
    const cdr: ChangeDetectorRef = undefined;
    beforeEach(() => {
      component = new SamDateComponent(new SamFormService(), cdr);
    });

    it('should check for name', () => {
      try {
        component.ngOnInit();
        fail();
      } catch (e) {
        expect(true).toBe(true);
      }
    });

    it('should use moment for getting date', () => {
      const dateModel = {
        month: 10,
        day: 10,
        year: 2017
      };
      component.model = {...dateModel};
      expect(component.getDate().format(component.OUTPUT_FORMAT))
      .toBe('2017-10-10');
      expect(component.getDate(dateModel).format(component.OUTPUT_FORMAT))
      .toBe('2017-10-10');
    });

    it('should be able to check for leap years', () => {
      expect(component._isLeapYear('2016')).toBe(true);
      expect(component._isLeapYear('2017')).toBe(false);
    });
  });
  describe('Rendered tests', () => {
    let component: SamDateComponent;
    let fixture: any;
    let monthEl;
    let dayEl;
    let yearEl;
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SamWrapperModule, FormsModule],
        declarations: [SamDateComponent],
        providers: [SamFormService]
      });
  
      fixture = TestBed.createComponent(SamDateComponent);
      component = fixture.componentInstance;
      component.value = '2016-12-29';
      component.name = 'test';
      component.ngOnChanges();
      fixture.detectChanges();
      monthEl = fixture.debugElement.query(By.css('input[name=date_month]'));
      dayEl = fixture.debugElement.query(By.css('input[name=date_day]'));
      yearEl = fixture.debugElement.query(By.css('input[name=date_year]'));
    });
  
    it('should initialize Date', function () {
      expect(true).toBe(true);
    });
  
    it('should match specified date', function () {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.month.nativeElement.value).toBe('12');
        expect(component.day.nativeElement.value).toBe('29');
        expect(component.year.nativeElement.value).toBe('2016');
        expect(component.isValid()).toBe(true);
        expect(component.isClean()).toBe(false);
      });
    });
  
    it('should update', function () {
      component.model.month = '1';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.month.nativeElement.value).toBe('1');
        expect(component.day.nativeElement.value).toBe('29');
        expect(component.year.nativeElement.value).toBe('2016');
      });
    });

    it('should work with leap years', () => {
      component.month.nativeElement.value = '2';
      component.day.nativeElement.value = '29';
      component.year.nativeElement.value = '2015';
      component.onYearBlur(undefined);
      expect(component.day.nativeElement.value).toBe('');
    });

    it('should update with key presses', function() {
      monthEl.triggerEventHandler('focus', {
        target: {
          value: ''
        }
      });

      fixture.detectChanges();

      monthEl.triggerEventHandler('keydown', {
        key: 1,
        target: {
          value: ''
        },
        preventDefault: () => undefined
      });

      monthEl.triggerEventHandler('keydown', {
        key: 2,
        target: {
          value: ''
        },
        preventDefault: () => undefined
      });

      dayEl.triggerEventHandler('keydown', {
        key: 1,
        target: {
          value: ''
        },
        preventDefault: () => undefined
      });
      dayEl.triggerEventHandler('keydown', {
        key: 6,
        target: {
          value: ''
        },
        preventDefault: () => undefined
      });

      [2,0,0,0].forEach(
        digit => {
          yearEl.triggerEventHandler('keydown', {
            key: digit,
            target: {
              value: ''
            },
            preventDefault: () => undefined
          });
        }
      );

      fixture.detectChanges();
      const model = component.inputModel;

      console.log(model, component.inputModel);

      expect(model.month).toBe('12');
      expect(model.day).toBe('16');
      expect(model.year).toBe('2000');
    });
  });
});
