import { Injectable } from '@angular/core';

import { Log, MIRecord } from '@infor-up/m3-odin';

@Injectable({
  providedIn: 'root',
})
export class DemoReplaceVariableService {
  constructor() {}

  public replace(url: string, record: MIRecord): string {
    let newUrl: string = url;
    const fields = Object.keys(record);
    for (let field of fields) {
      const replacementVariable: string = '{' + field + '}';
      let index: number;
      index = url.indexOf(replacementVariable);
      if (index > -1) {
        try {
          let tempString: string = newUrl;
          if (tempString) {
            newUrl = tempString.substring(0, index);
            newUrl += record[field as keyof MIRecord];
            newUrl += tempString.substring(index + replacementVariable.length);
          }
        } catch (error) {
          Log.error(JSON.stringify(error));
        }
      }
    }
    return newUrl;
  }
}
