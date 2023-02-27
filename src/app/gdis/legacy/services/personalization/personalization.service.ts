import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  Observable,
  Subject,
} from 'rxjs';
import { tap } from 'rxjs/operators';

import { MIService, FormService, UserService } from '@infor-up/m3-odin-angular';
import {
  ArrayUtil,
  IFormRequest,
  IFormResponse,
  Log,
  MIRecord,
} from '@infor-up/m3-odin';

import {
  IConditionalStyle,
  IConditionalStyleAttributes,
  IConditionalStyleCondition,
  IHyperLink,
  IHyperLinkAttributes,
  IPersonalization,
  IReplacementText,
  IReplacementTextAttributes,
  IXmlCustomization,
} from '../..';

@Injectable({
  providedIn: 'root',
})

/**
 * The DemoPersonalizationService loads personalizations and constructs style sheets which
 * are used by the listpanel and detailpanel components
 */
export class DemoPersonalizationService {
  constructor(
    private miService: MIService,
    private userService: UserService,
    private formService: FormService
  ) {}

  /**
   * Retrieves the personalizations for a program. Used by the list component and the panel
   * component
   * @param program
   */
  public getPersonalization(program: string): Observable<IPersonalization> {
    let subject = new Subject<IPersonalization>();
    this.runProgram(program, true).subscribe((response: IFormResponse) => {
      if (response) {
        // Get customization from document
        let xmlCustomization: IXmlCustomization = {
          xmlConditionalStyles: [],
          xmlHyperLinks: [],
          xmlReplacementTexts: [],
        };

        let custElements: any[] = [].slice.call(
          // @ts-expect-error: TODO
          response.document.getElementsByTagName('Cust')
        );
        if (custElements.length > 0) {
          for (let custElement of custElements) {
            if (custElement.hasChildNodes()) {
              for (let custString of custElement.childNodes) {
                let custXml = new DOMParser().parseFromString(
                  custString.data,
                  'text/xml'
                );
                xmlCustomization.xmlConditionalStyles = [].slice.call(
                  custXml.getElementsByTagName('ConditionalStyle')
                );
                xmlCustomization.xmlHyperLinks = [].slice.call(
                  custXml.getElementsByTagName('HyperLink')
                );
                xmlCustomization.xmlReplacementTexts = [].slice.call(
                  custXml.getElementsByTagName('ReplacementText')
                );
              }
            }
          }
        }

        // Parse customization
        const customization: IPersonalization = this.parseCustomization(
          program,
          xmlCustomization
        );

        // Close program
        // @ts-expect-error: TODO
        const sid: string = response.sessionId;
        // @ts-expect-error: TODO
        const iid: string = response.instanceId;
        this.closeProgram(sid, iid, program).subscribe(
          (response: IFormResponse) => {
            if (response) {
              Log.debug(
                'Personalization for program ' +
                  program +
                  ' retrieved. Program closed'
              );
            }
          }
        );
        subject.next(customization);
      }
    });
    return subject.asObservable();
  }

  /**
   * Retrieves the personalizations for a program. Used by the list component and the panel
   * component
   * @param program
   */
  public getPersonalizations(
    programs: string[]
  ): Observable<IPersonalization[]> {
    // let observables: Observable<IPersonalization[]>;
    return combineLatest(
      programs.map((program) => {
        return this.getPersonalization(program);
      })
    );
  }

  /**
   * Retrieves the conditional style for a field. Used by the list component and the panel
   * component
   * @param personalization
   * @param field
   * @param value
   * @param record
   */
  public getConditionalStyle(
    personalization: IPersonalization,
    field: string,
    value: any,
    record?: MIRecord
    // @ts-expect-error: TODO
  ): string {
    if (personalization) {
      try {
        let conditionalStyle: IConditionalStyle;
        if (
          ArrayUtil.itemByProperty(
            personalization.conditionalStyles,
            'field',
            field
          )
        ) {
          conditionalStyle = this.trySetConditionalStyle(
            personalization,
            field,
            value,
            record
          );
          if (conditionalStyle) {
            return this.getClassName(
              // @ts-expect-error: TODO
              personalization.program,
              conditionalStyle,
              false
            );
          }
        }
        // @ts-expect-error: TODO
        return null;
      } catch (err) {
        Log.error(err);
        // @ts-expect-error: TODO
        return null;
      }
    }
  }

  /**
   * Retrieves the replacement text for a field. Used by the list component and the panel
   * component
   * @param personalization
   * @param field
   * @param value
   * @param record
   */
  public getReplacementText(
    personalization: IPersonalization,
    field: string,
    value: any,
    record?: MIRecord
    // @ts-expect-error: TODO
  ): string {
    if (personalization) {
      try {
        let conditionalStyle: IConditionalStyle;
        let replacementText: string;

        conditionalStyle = this.trySetConditionalStyle(
          personalization,
          field,
          value,
          record
        );
        if (conditionalStyle) {
          if (conditionalStyle.attributes.text) {
            return conditionalStyle.attributes.text;
          }
        }
        // @ts-expect-error: TODO
        return null;
      } catch (err) {
        Log.error(err);
        // @ts-expect-error: TODO
        return null;
      }
    }
  }

  /**
   * Checks if a personalization value exist for a field. Used by the list component
   * @param personalization
   * @param field
   */
  public fieldHasPersonalization(
    personalization: IPersonalization,
    field: string
    // @ts-expect-error: TODO
  ): boolean {
    if (personalization) {
      try {
        let conditionalStyle: IConditionalStyle;
        if (
          ArrayUtil.itemByProperty(
            personalization.conditionalStyles,
            'field',
            field
          )
        ) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        Log.error(err);
        return false;
      }
    }
  }

  /**
   * Parses the personalizations for a program and create browser style sheets that are
   * used by the list component and the detail component to display personalizations.
   * @param program
   * @param xmlCustomization
   */
  public parseCustomization(
    program: string,
    xmlCustomization: IXmlCustomization
    // @ts-expect-error: TODO
  ): IPersonalization {
    if (xmlCustomization) {
      try {
        // @ts-expect-error: TODO
        let conditionalStyles: IConditionalStyle[] =
          this.parseConditionalStyle(xmlCustomization);
        // @ts-expect-error: TODO
        let hyperLinks: IHyperLink[] = this.parseHyperLinks(xmlCustomization);
        // @ts-expect-error: TODO
        let replacementTexts: IReplacementText[] =
          this.parseReplacementText(xmlCustomization);
        let personalization: IPersonalization = {
          conditionalStyles: conditionalStyles,
          hyperLinks: hyperLinks,
          replacementTexts: replacementTexts,
          program: program,
        };
        if (
          personalization.conditionalStyles.length > 0 ||
          personalization.hyperLinks.length > 0 ||
          personalization.replacementTexts.length > 0
        ) {
          if (!document.getElementById(program)) {
            this.createStyleSheet(program, personalization);
          }
        }
        return personalization;
      } catch (err) {
        Log.error(err);
      }
    }
  }

  /**
   * Creates a style sheet containing personalizations for a program
   * @param program
   * @param personalization
   */
  private createStyleSheet(program: string, personalization: IPersonalization) {
    let sheet = document.createElement('style');
    sheet.setAttribute('id', program);
    sheet.innerHTML = '';
    for (let conditionalStyle of personalization.conditionalStyles) {
      let styleClass: string = this.getClassName(
        program,
        conditionalStyle,
        true
      );
      let styleAttributes: string = this.getClassAttributes(conditionalStyle);
      sheet.innerHTML += styleClass;
      // Conditional styles for detail fields (that has length 6) do not have children of type div
      if (!conditionalStyle.field || conditionalStyle.field.length != 6) {
        sheet.innerHTML += ' > div > div ';
      }
      sheet.innerHTML += styleAttributes;
      sheet.innerHTML += ' ';
    }
    document.body.appendChild(sheet);
  }

  /**
   * Sets the class attributes for a conditional style
   * @param conditionalStyle
   */
  private getClassAttributes(conditionalStyle: IConditionalStyle): string {
    let attributes = ' { ';
    if (conditionalStyle.attributes.background) {
      attributes += 'background: ' + conditionalStyle.attributes.background;
      attributes += '!important;';
    }
    if (conditionalStyle.attributes.foreground) {
      attributes += 'color: ' + conditionalStyle.attributes.foreground;
      attributes += '!important;';
    }
    attributes += ' }';
    return attributes;
  }

  /**
   * Sets the class name
   * @param program
   * @param conditionalStyle
   * @param includeDot
   */
  private getClassName(
    program: string,
    conditionalStyle: IConditionalStyle,
    includeDot: boolean
  ): string {
    try {
      let name: string;
      name = includeDot ? '.' : '';
      name += program;
      name += '-';
      name += conditionalStyle.condition.field;
      name += '-';
      name += conditionalStyle.condition.operand;
      name += '-';
      name += conditionalStyle.condition.operator;
      name += '-';
      name += conditionalStyle.condition.type;
      name += '-';
      if (conditionalStyle.condition.operator.toString() === '6') {
        //Range
        name += conditionalStyle.condition.from;
        name += '-';
        name += conditionalStyle.condition.to;
      } else {
        name += conditionalStyle.condition.value;
      }
      return name;
    } catch (err) {
      return '';
    }
  }

  /**
   * Gets the condition for a conditional style
   * @param conditionArray
   */
  private getCondition(conditionArray: any[]): IConditionalStyleCondition {
    // @ts-expect-error: TODO
    let field: string = null;
    // @ts-expect-error: TODO
    let operand: number = null;
    // @ts-expect-error: TODO
    let operator: number = null;
    // @ts-expect-error: TODO
    let value: string = null;
    // @ts-expect-error: TODO
    let from: string = null;
    // @ts-expect-error: TODO
    let to: string = null;
    // @ts-expect-error: TODO
    let type: number = null;

    for (let condition of conditionArray) {
      switch (condition['name']) {
        case 'field':
          field = condition['value'];
          break;
        case 'operand':
          operand = condition['value'];
          break;
        case 'operator':
          operator = condition['value'];
          break;
        case 'value':
          value = condition['value'];
          break;
        case 'from':
          from = condition['value'];
          break;
        case 'to':
          to = condition['value'];
          break;
        case 'type':
          type = condition['value'];
          break;
      }
    }
    let condition: IConditionalStyleCondition = {
      field: field,
      operand: operand,
      operator: operator,
      value: value,
      from: from,
      to: to,
      type: type,
    };
    return condition;
  }

  /**
   * Gets the attributes for a conditional style
   * @param attributeArray
   */
  private getConditionalStyleAttributes(
    attributeArray: any[]
  ): IConditionalStyleAttributes {
    // @ts-expect-error: TODO
    let alignment: string = null;
    // @ts-expect-error: TODO
    let background: string = null;
    // @ts-expect-error: TODO
    let enabled: boolean = null;
    // @ts-expect-error: TODO
    let foreground: string = null;
    // @ts-expect-error: TODO
    let hasbackground: boolean = null;
    // @ts-expect-error: TODO
    let hasforeground: boolean = null;
    // @ts-expect-error: TODO
    let name: string = null;
    // @ts-expect-error: TODO
    let target: string = null;
    // @ts-expect-error: TODO
    let text: string = null;
    // @ts-expect-error: TODO
    let tooltip: string = null;
    // @ts-expect-error: TODO
    let type: number = null;
    // @ts-expect-error: TODO
    let version: number = null;

    for (let attribute of attributeArray) {
      switch (attribute['name']) {
        case 'alignment':
          alignment = attribute['value'];
          break;
        case 'background':
          background = '#' + attribute['value'].toString().substring(3);
          break;
        case 'enabled':
          enabled = attribute['value'];
          break;
        case 'foreground':
          foreground = '#' + attribute['value'].toString().substring(3);
          break;
        case 'hasbackground':
          hasbackground = attribute['value'];
          break;
        case 'hasforeground':
          hasforeground = attribute['value'];
          break;
        case 'name':
          name = attribute['value'];
          break;
        case 'target':
          target = attribute['value'];
          break;
        case 'text':
          text = attribute['value'];
          break;
        case 'tooltip':
          tooltip = attribute['value'];
          break;
        case 'type':
          type = attribute['value'];
          break;
        case 'version':
          version = attribute['value'];
          break;
      }
    }

    let attributes: IConditionalStyleAttributes = {
      alignment: alignment,
      background: background,
      enabled: enabled,
      foreground: foreground,
      hasbackground: hasbackground,
      hasforeground: hasforeground,
      name: name,
      target: target,
      text: text,
      tooltip: tooltip,
      type: type,
      version: version,
    };
    return attributes;
  }

  /**
   * Gets hyperlink attributes
   * @param attributeArray
   */
  private getHyperLinkAttributes(attributeArray: any[]): IHyperLinkAttributes {
    // @ts-expect-error: TODO
    let column: string = null;
    // @ts-expect-error: TODO
    let externalbrowser: string = null;
    // @ts-expect-error: TODO
    let id: string = null;
    // @ts-expect-error: TODO
    let option: number = null;
    // @ts-expect-error: TODO
    let text: string = null;
    // @ts-expect-error: TODO
    let tooltip: string = null;
    // @ts-expect-error: TODO
    let url: string = null;

    for (let attribute of attributeArray) {
      switch (attribute['name']) {
        case 'column':
          column = attribute['value'];
          break;
        case 'externalbrowser':
          externalbrowser = attribute['value'];
          break;
        case 'id':
          id = attribute['value'];
          break;
        case 'option':
          option = attribute['value'];
          break;
        case 'text':
          text = attribute['value'];
          break;
        case 'toolTip':
          tooltip = attribute['value'];
          break;
        case 'url':
          url = attribute['value'];
          break;
      }
    }

    let attributes: IHyperLinkAttributes = {
      column: column,
      externalBrowser: externalbrowser,
      id: id,
      option: option,
      text: text,
      tooltip: tooltip,
      url: url,
    };
    return attributes;
  }

  /**
   * Gets replacement text attributes
   * @param attributeArray
   */
  private getReplacementTextAttributes(
    attributeArray: any[]
  ): IReplacementTextAttributes {
    // @ts-expect-error: TODO
    let column: string = null;
    // @ts-expect-error: TODO
    let originaltext: string = null;
    // @ts-expect-error: TODO
    let text: string = null;

    for (let attribute of attributeArray) {
      switch (attribute['name']) {
        case 'column':
          column = attribute['value'];
          break;
        case 'originalText':
          originaltext = attribute['value'];
          break;
        case 'text':
          text = attribute['value'];
          break;
      }
    }

    let attributes: IReplacementTextAttributes = {
      column: column,
      originaltext: originaltext,
      text: text,
    };
    return attributes;
  }

  /**
   * Closes a program in M3
   * @param sid
   * @param iid
   * @param program
   */
  private closeProgram(
    sid: string,
    iid: string,
    program: string
  ): Observable<IFormResponse> {
    const programrequest = {
      commandType: 'FNC',
      commandValue: 'ENDPGM',
      params: {
        SID: sid,
        IID: iid,
      },
      sessionId: sid,
    };
    const request: IFormRequest = programrequest;
    return this.formService.executeRequest(request);
  }

  /**
   * Parses xml conditional style data
   * @param xmlCustomization
   */
  // @ts-expect-error: TODO
  private parseConditionalStyle(xmlCustomization: IXmlCustomization) {
    try {
      let conditionalStyles: IConditionalStyle[] = [];
      if (xmlCustomization.xmlConditionalStyles) {
        let xmlCSArray = Array.prototype.slice.call(
          xmlCustomization.xmlConditionalStyles
        );
        for (let xmlCS of xmlCSArray) {
          let attributes: IConditionalStyleAttributes;
          let condition: IConditionalStyleCondition;
          let xmlCSAttributesArray = [];
          if (xmlCS && xmlCS.attributes) {
            xmlCSAttributesArray = Array.prototype.slice.call(xmlCS.attributes);
          }
          let xmlCSConditionArray = [];
          if (
            xmlCS &&
            xmlCS.firstElementChild &&
            xmlCS.firstElementChild.attributes
          ) {
            xmlCSConditionArray = Array.prototype.slice.call(
              xmlCS.firstElementChild.attributes
            );
          }

          attributes = this.getConditionalStyleAttributes(xmlCSAttributesArray);
          condition = this.getCondition(xmlCSConditionArray);
          let conditionalStyle: IConditionalStyle = {
            field: attributes.target,
            attributes: attributes,
            condition: condition,
          };
          conditionalStyles.push(conditionalStyle);
        }
      }
      return conditionalStyles;
    } catch (err) {
      Log.error(err);
    }
  }

  /**
   * Parses xml hyperlink data
   * @param xmlCustomization
   */
  // @ts-expect-error: TODO
  private parseHyperLinks(xmlCustomization: IXmlCustomization) {
    try {
      let hyperLinks: IHyperLink[] = [];
      if (xmlCustomization.xmlHyperLinks) {
        let xmlHLArray = Array.prototype.slice.call(
          xmlCustomization.xmlHyperLinks
        );
        for (let xmlHL of xmlHLArray) {
          let attributes: IHyperLinkAttributes;
          let xmlHLAttributesArray = Array.prototype.slice.call(
            xmlHL.attributes
          );
          attributes = this.getHyperLinkAttributes(xmlHLAttributesArray);
          let hyperLink: IHyperLink = {
            field: attributes.column,
            attributes: attributes,
          };
          hyperLinks.push(hyperLink);
        }
      }
      return hyperLinks;
    } catch (err) {
      Log.error(err);
    }
  }

  /**
   * Parses xml replacement text data
   * @param xmlCustomization
   */
  // @ts-expect-error: TODO
  private parseReplacementText(xmlCustomization: IXmlCustomization) {
    try {
      let replacementTexts: IReplacementText[] = [];
      if (xmlCustomization.xmlReplacementTexts) {
        let xmlRTArray = Array.prototype.slice.call(
          xmlCustomization.xmlReplacementTexts
        );
        for (let xmlRT of xmlRTArray) {
          let attributes: IReplacementTextAttributes;
          let xmlRTAttributesArray = Array.prototype.slice.call(
            xmlRT.attributes
          );
          attributes = this.getReplacementTextAttributes(xmlRTAttributesArray);
          let replacementText: IReplacementText = {
            field: attributes.column,
            attributes: attributes,
          };
          replacementTexts.push(replacementText);
        }
      }
      return replacementTexts;
    } catch (err) {
      Log.error(err);
    }
  }

  /**
   * Starts a program in M3
   * @param program
   * @param isLoadCst
   */
  private runProgram(
    program: string,
    isLoadCst?: boolean
  ): Observable<IFormResponse> {
    const cstload = isLoadCst ? 1 : 2;
    const programrequest = {
      commandType: 'RUN',
      commandValue: program,
      params: {
        CSTLOAD: cstload,
      },
    };
    const request: IFormRequest = programrequest;
    return this.formService.executeRequest(request);
  }

  /**
   * Returns a condititional style for a field
   * @param personalization
   * @param field
   * @param value
   * @param record
   */
  private trySetConditionalStyle(
    personalization: IPersonalization,
    field: string,
    value: any,
    record?: MIRecord
  ): IConditionalStyle {
    let isFound: boolean;
    for (let conditionalStyle of personalization.conditionalStyles) {
      if (
        conditionalStyle?.field?.substr(conditionalStyle.field.length - 4) ==
        field
      ) {
        isFound = this.validateConditionalStyle(
          conditionalStyle,
          value,
          record
        );
        if (isFound) {
          return conditionalStyle;
        }
      }
    }
    // @ts-expect-error: TODO
    return null;
  }

  /**
   * Validates a conditional style
   * @param conditionalStyle
   * @param value
   * @param record
   */
  private validateConditionalStyle(
    conditionalStyle: IConditionalStyle,
    value: any,
    record?: MIRecord
  ): boolean {
    // let fieldValue = value;

    try {
      let fieldValue = null;

      // The conditional style is based on the current field
      if (conditionalStyle.field == conditionalStyle.condition.field) {
        fieldValue = value;
      } else {
        // The conditional style is based on another field
        // @ts-expect-error: TODO
        const keys = Object.keys(record);
        for (let key of keys) {
          const shortKey = key.substr(key.length - 4);
          if (shortKey == conditionalStyle.condition.field) {
            // @ts-expect-error: TODO
            fieldValue = record[key];
            break;
          }
        }
      }

      // Return false if we do not have a field value
      if (fieldValue == null) {
        return false;
      }

      /**
       *    Check the conditions of the conditional
       */

      // Equals
      if (conditionalStyle.condition.operator == 0) {
        // Specific value
        if (conditionalStyle.condition.operand == 1) {
          if (fieldValue == conditionalStyle.condition.value) {
            return true;
          }
        }

        // Does not equal
      } else if (conditionalStyle.condition.operator == 1) {
        // Specific value
        if (conditionalStyle.condition.operand == 1) {
          if (fieldValue != conditionalStyle.condition.value) {
            return true;
          }
        }

        // Greater than
      } else if (conditionalStyle.condition.operator == 2) {
        // Specific value
        if (conditionalStyle.condition.operand == 1) {
          if (fieldValue > conditionalStyle.condition.value) {
            return true;
          }
        }

        // Greater than or equal
      } else if (conditionalStyle.condition.operator == 3) {
        // Specific value
        if (conditionalStyle.condition.operand == 1) {
          if (fieldValue >= conditionalStyle.condition.value) {
            return true;
          }
        }

        // Less than
      } else if (conditionalStyle.condition.operator == 4) {
        // Specific value
        if (conditionalStyle.condition.operand == 1) {
          if (fieldValue < conditionalStyle.condition.value) {
            return true;
          }
        }

        // Less than or equal
      } else if (conditionalStyle.condition.operator == 5) {
        // Specific value
        if (conditionalStyle.condition.operand == 1) {
          if (fieldValue <= conditionalStyle.condition.value) {
            return true;
          }
        }

        // Range
      } else if (conditionalStyle.condition.operator == 6) {
        // Specific value
        if (conditionalStyle.condition.operand == 1) {
          if (
            fieldValue >= conditionalStyle.condition.from &&
            fieldValue <= conditionalStyle.condition.to
          ) {
            return true;
          }
        }

        // Contains
      } else if (conditionalStyle.condition.operator == 7) {
        // Specific value
        if (conditionalStyle.condition.operand == 1) {
          if (fieldValue.indexOf(conditionalStyle.condition.value) > -1) {
            return true;
          }
        }

        // Starts with
      } else if (conditionalStyle.condition.operator == 8) {
        // Specific value
        if (conditionalStyle.condition.operand == 1) {
          if (fieldValue.indexOf(conditionalStyle.condition.value) == 0) {
            return true;
          }
        }

        // Ends with
      } else if (conditionalStyle.condition.operator == 9) {
        // Specific value
        if (conditionalStyle.condition.operand == 1) {
          if (fieldValue.match(/conditionalStyle.condition.value$/)) {
            return true;
          }
        }
      }

      // If we end up here then return false
      return false;
    } catch (err) {
      // Something went wrong, return false
      return false;
    }
  }
}
