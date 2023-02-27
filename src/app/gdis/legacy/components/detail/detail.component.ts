/* eslint-disable @angular-eslint/use-lifecycle-interface */
import {
  ElementRef,
  Input,
  SimpleChange,
  Directive,
  Component,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { CoreBase, MIRecord } from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';

import { SohoMessageService } from 'ids-enterprise-ng';

import {
  IAction,
  ICustomAction,
  IDrillBack,
  IRelatedInformation,
  ShortcutService,
} from '../../../index';
import { DemoBusinessContextService } from '../..';
import { DemoRelatedOptionService } from '../..';
import { DemoRoutingStateService } from '../..';

type CustomMIRecord = MIRecord & { [key: string]: string };

/**
 * The GdisDetailComponent should be used as a parent class for components that should
 * display detail data. One should use the data from the selectedRecord property to
 * initialize one or several bookmarks. Those bookmarks can then be used as input for
 *  DemoPanelComponents (which in turn display the detail fields).
 *
 */

@Component({
  selector: 'm3-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent extends CoreBase {
  @Input() header!: string;
  @Input() searchField!: string;
  @Input() selectedRecord!: MIRecord;

  private intersectionObserver!: IntersectionObserver;

  /**
   *  Variable used to control how many bookmarks that are being executed for detail
   *  components. Controls when to turn off the busy indicator.
   */
  bookmarkExecutionCounter = 0;

  isBusy!: boolean;
  isReady!: boolean;
  isDataLoaded!: boolean;
  isIntersecting!: boolean;
  isOptionsLoaded!: boolean;

  actions: IAction[] = [];
  customActions: ICustomAction[] = [];
  drillBacks: IDrillBack[] = [];
  relatedInformation!: IRelatedInformation;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected elementRef: ElementRef,
    protected miService: MIService,
    protected location: Location,
    protected messageService: SohoMessageService,
    protected router: Router,
    // protected translate: TranslateService,
    protected businessContextService: DemoBusinessContextService,
    protected relatedOptionService: DemoRelatedOptionService,
    protected routingStateService: DemoRoutingStateService,

    protected readonly shortcutService: ShortcutService
  ) {
    super('DetailComponent');
  }

  /**
   * Unsubscribes to observables and event emitters.
   */
  ngOnDestroy() {
    this.intersectionObserver.unobserve(<Element>this.elementRef.nativeElement);

    // Clear related actions, customActions and drillbacks
    if (this.relatedInformation) {
      this.shortcutService.removeRelatedInformation(this.relatedInformation);
    }
  }

  /**
   * Load data and options when the selectedRecord is set.
   * @param changes
   */
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes.selectedRecord) {
      if (this.selectedRecord) {
        this.isDataLoaded = false;
        if (this.isIntersecting) {
          this.loadDataAndOptions();
        }
        // const record = this.getTrimmedSelectedRecord();
        // this.initBookmark(record);
      }
    }
  }

  /**
   * Responsible for the handling of related information. Constructs the RelatedInformation
   * object. Loads and unloads the RelatedInformation object based on the visibility of the
   * component.
   */
  ngAfterViewInit() {
    if (
      this.actions.length > 0 ||
      this.customActions.length > 0 ||
      this.drillBacks.length > 0
    ) {
      // Create related object containing actions, customActions and drillbacks
      this.relatedInformation = {
        actions: this.actions,
        customActions: this.customActions,
        drillBacks: this.drillBacks,
        name: this.header,
        record: this.selectedRecord,
      };
    }

    // Add IntersectionObserver
    this.intersectionObserver = new IntersectionObserver((elements) => {
      for (let element of elements) {
        if (element.target == this.elementRef.nativeElement) {
          if (element.isIntersecting) {
            this.isIntersecting = true;
            // if (!this.isDataLoaded) {
            //    if (this.selectedRecord) {
            //       const record = this.getTrimmedSelectedRecord();
            //       this.initBookmark(record);
            //       this.isDataLoaded = true;
            //    }
            // }
            this.loadDataAndOptions();
          } else {
            this.isIntersecting = false;
            this.unloadDataAndOptions();
          }
        }
      }
    }, {});
    this.intersectionObserver.observe(<Element>this.elementRef.nativeElement);

    // Custom Actions
    this.relatedOptionService.customActionClickedEvent.subscribe(
      (customAction: ICustomAction) => {
        this.onCustomAction(customAction);
      }
    );

    this.shortcutService.customActionClickedEvent.subscribe(
      (customAction: ICustomAction) => {
        this.onCustomAction(customAction);
      }
    );
  }

  /**
   * A method to clears variables
   */
  protected clear() {}

  /**
   * Returns the selected MIRecord with out field prefixes.
   */
  protected getTrimmedSelectedRecord(): MIRecord {
    let fields: string[];
    let record: MIRecord = new MIRecord();

    if (this.selectedRecord) {
      fields = Object.keys(this.selectedRecord);
      for (let field of fields) {
        if (field.length == 6) {
          const shortField = field.substring(2);
          // @ts-expect-error: TODO
          record[shortField] = this.selectedRecord[field];
        } else {
          // @ts-expect-error: TODO
          record[field] = this.selectedRecord[field];
        }
      }
    }

    return record;
  }

  /**
   * This method must be defined in the child class. It is intended to define
   * the bookmark, or bookmarks, that should be displayed by the detail component
   *
   * @param record
   */
  protected initBookmark(record: MIRecord): void {}

  /**
   * This method is called by the IntersectionObserver and is responsible
   * for lazy loading of related information
   */
  protected loadDataAndOptions() {
    /**
     * Load data
     */
    if (!this.isDataLoaded) {
      if (this.selectedRecord) {
        const record = this.getTrimmedSelectedRecord();
        this.initBookmark(record);
        this.isDataLoaded = true;
      }
    }

    /**
     * Load related object, containing actions, customActions and drillbacks.
     * Wait for other components to clear their options
     */
    if (!this.isOptionsLoaded) {
      setTimeout(() => {
        if (this.relatedInformation) {
          this.relatedOptionService.setRelatedInformation(
            this.relatedInformation
          );
          this.shortcutService.setRelatedInformation(this.relatedInformation);
        }
        this.isOptionsLoaded = true;
      }, 250);
    }
  }

  /**
   * This method is used when a custom action is clicked. It is called by the
   * customActionClickedEvent in the ngAfterViewInit method.
   *
   * CustomActions are used when you cannot use regular Actions. The subscribing
   * component is responsible for implementing the functionality that should
   * take place when the customAction is clicked.
   *
   * A check should be made of the CustomAction id so that the correct
   * component is handling the custom action
   *
   * Example:
   *    if (customAction == "releasePopLine") {
   *       ...
   *    }
   *
   * @param customAction
   */
  protected onCustomAction(customAction: ICustomAction) {}

  /**
   * Triggers the busy indicator.
   * @param value
   */
  public showBusyindicator(value: boolean) {
    this.isBusy = value;
  }

  /**
   *    This method is called by the IntersectionObserver and is responsible
   *    for unloading of related information
   */
  protected unloadDataAndOptions() {
    // Clear related actions, customActions and drillbacks
    if (this.relatedInformation) {
      this.relatedOptionService.removeRelatedInformation(
        this.relatedInformation
      );
      this.shortcutService.removeRelatedInformation(this.relatedInformation);
    }
    this.isOptionsLoaded = false;
  }
}
