import { NgModule } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prettifyTitle' })
export class PrettifyTitlePipe implements PipeTransform {
  constructor() {}

  capitalizeFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  transform(title: string) {
    const blackList = ['h5', 'sdk', 'demo'];
    const convertedTitle = title
      .split('-')
      .filter((word) => !blackList.includes(word.toLowerCase()))
      .map((word) => this.capitalizeFirstLetter(word))
      .join(' ');

    return convertedTitle;
  }
}

@NgModule({
  declarations: [PrettifyTitlePipe],
  imports: [],
  exports: [PrettifyTitlePipe],
})
export class PrettifyTitlePipeModule {}
