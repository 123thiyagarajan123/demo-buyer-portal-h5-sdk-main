import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoremComponent } from './lorem.component';

@NgModule({
  declarations: [LoremComponent],
  imports: [CommonModule],
  exports: [LoremComponent],
})
export class LoremModule {}
