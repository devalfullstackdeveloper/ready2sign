import { Directive, Input  } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  // selector: '[appCustomMaxValidator]'
  selector: '[customMax][formControlName],[customMax][formControl],[customMax][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: CustomMaxValidatorDirective, multi: true}]
})
export class CustomMaxValidatorDirective implements Validator {
  @Input()
  customMax: number;

  constructor() { }

  validate(c : FormControl) : {[key: string]: any} {
    let v = c.value;
      return ( v > this.customMax)? {"customMax": true} : null;
  }

}
