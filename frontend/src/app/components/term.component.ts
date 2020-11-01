import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-term',
    template: `
    <div class="wrapper">
        <span nz-tooltip [nzTooltipTitle]="toolList" >{{ term }}</span> 
        <span *ngIf="closeable" class="close-icon" (click)="close()"><i nz-icon nzType="close-circle" nzTheme="fill"></i></span>
    </div>
    `,
    styles: [
        `
        .wrapper {
            position: relative;
            display: inline-block;
            padding: 4px 6px;
            border: 1px solid #333;
            border-radius: 4px;
            margin: 8px 6px;
            background-color: #EEE;
        }
        .wrapper:hover {
            cursor: pointer;
        }
        span {
            font-size: 14px;
            
        }
        .close-icon {
            font-size: 14px;
            width: 1em;
            height: 1em;
            position: absolute;
            right: -0.5em;
            top: -0.8em;
            color: rgb(255,99,71);
            border-radius: 50%;
            background-color: #fff;
            vertical-align: 0;
        }
        .close-icon:hover {
            background-color: #fff;
            color: rgba(255,99,71, 0.7);
        }
        `
    ]
})
export class TermComponent implements OnInit {

    @Input() term: string;
    @Input() toolList: string | TemplateRef<void>
    @Input() closeable: boolean = false;

    @Output() closeEvent = new EventEmitter<string>();
    constructor() { }

    ngOnInit() {
    }

    close() {
        this.closeEvent.emit(this.term)
    }
}
