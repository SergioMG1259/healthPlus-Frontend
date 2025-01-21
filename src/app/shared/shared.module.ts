import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFormatPipe } from './pipes/text-format.pipe';

@NgModule({
  declarations: [
    TextFormatPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TextFormatPipe
  ]
})
export class SharedModule { }
