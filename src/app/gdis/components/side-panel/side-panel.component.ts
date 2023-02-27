import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { SohoModalDialogService } from 'ids-enterprise-ng';

import { GdisStore, SidePanelService } from '../../index';

import { SidePanelModalComponent } from './side-panel-modal/side-panel-modal.component';

@Component({
  selector: 'h5-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
})
export class SidePanelComponent
  extends CoreBase
  implements OnDestroy, AfterViewInit
{
  store$ = this.globalStore.state$;

  constructor(
    private globalStore: GdisStore,
    private sidePanelService: SidePanelService,
    private elementRef: ElementRef,
    private modalService: SohoModalDialogService
  ) {
    super('SidePanelComponent');
  }

  ngAfterViewInit(): void {
    this.width = this.sidePanelService.width;
  }

  ngOnDestroy(): void {
    this.sidePanelService.width = this.width;
  }

  get width() {
    return this.elementRef.nativeElement.style.width;
  }

  set width(width: string) {
    this.elementRef.nativeElement.style.width = width;
  }

  onResize(event: any[]): void {
    if (!this.sidePanelService.isOpen) {
      return;
    }

    const sidePanel = event[0].currentTarget;
    const mainPanel = sidePanel.offsetParent;
    const breakpoint = 40;

    if (mainPanel.clientWidth - sidePanel.offsetLeft <= breakpoint) {
      // Close side panel and reset width
      this.sidePanelService.resetWidth();
      this.width = this.sidePanelService.width;
      this.sidePanelService.toggle();
    }
  }

  openFullSize() {
    this.modalService
      .modal<SidePanelModalComponent>(SidePanelModalComponent)
      .title('this.title')
      .buttons([
        {
          text: 'Cancel',
          click: (_, modal) => modal.close(),
        },
        {
          text: 'Add',
          click: (_, modal) => modal.close(),
          isDefault: true,
        },
      ])
      .open()

      .beforeClose((ref) => {
        ref.componentDialog?.onSave();
        return true;
      })
      .afterClose((result: any) => {
        result;
      });
  }
}
