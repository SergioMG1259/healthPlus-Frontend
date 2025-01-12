import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function timeRangeValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const startField = form.get('startField')?.value
      const endField = form.get('endField')?.value
  
      if (startField && endField && startField >= endField)
        return { invalidTimeRange: true }

      return null
    }
}