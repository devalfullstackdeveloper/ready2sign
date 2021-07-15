import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  // selector: '[appCustomMinValidator]'
  selector: '[customMin][formControlName],[customMin][formControl],[customMin][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: CustomMinValidatorDirective, multi: true}]
})
export class CustomMinValidatorDirective implements Validator {

  @Input()
  customMin: number;

  constructor() { }

  validate(c: FormControl): {[key: string]: any} {
    let v = c.value;
    return ( v < this.customMin)? {"customMin": true} : null;
  }

}
