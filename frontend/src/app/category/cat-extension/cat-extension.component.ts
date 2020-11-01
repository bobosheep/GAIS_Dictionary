import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-cat-extension',
  templateUrl: './cat-extension.component.html',
  styleUrls: ['./cat-extension.component.css']
})
export class CatExtensionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@Component({
  selector: 'app-extension-modal',
  template: `
    <app-extension-form [title]="title"  [cancelButton]="true"></app-extension-form>
  `,
  styles: [``]
})
export class ExtensionModalComponent {
  @Input() title: string | TemplateRef<{}>;
  constructor () {

  }
}
