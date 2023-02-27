import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'h5-application-menu',
  templateUrl: './application-menu.component.html',
  styleUrls: ['./application-menu.component.css'],
})
export class ApplicationMenuComponent implements OnInit {
  @ViewChild('template', { static: true })
  template!: TemplateRef<unknown>;

  triggers: string[] = [];

  constructor(private viewContainerRef: ViewContainerRef) {}
  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);
  }
}
