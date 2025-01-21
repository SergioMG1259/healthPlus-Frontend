import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFormat'
})
export class TextFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value

    value = value.toLowerCase().replace(/_/g, ' ')
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

}
