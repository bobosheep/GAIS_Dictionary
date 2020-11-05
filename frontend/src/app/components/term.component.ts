import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-term',
    template: `
    <div class="wrapper" 
        [ngClass]="{'shaking': selectable && selected  && mode['shake'],
                    'bounding': selectable && selected && mode['bound'], 
                    'default-type': type === 'default', 
                    'success-type': type === 'success',
                    'danger-type': type === 'danger',
                    'info-type': type === 'info',
                    'warning-type': type === 'warning'}" 
        (click)="toggle()">
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
        .default-type {
            color: #111;
            border-color: #333;
            background-color: #eee;
        }
        .success-type {
            color: darkgreen;
            border-color: green;
            background-color: lightgreen;
        }
        .danger-type {
            color: red;
            border-color: tomato;
            background-color: rgba(255, 99, 71, 0.5);
        }
        .info-type {
            color: darkblue;
            border-color: blue;
            background-color: lightblue;
        }
        .warning-type {
            color: #776d00;
            border-color: yellow;
            background-color: lightyellow;
        }

        span {
            font-size: 14px;        
            color: inherit;
        }
        .close-icon {
            font-size: 12px;
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
        .shaking {
            animation-name: shake;
            animation-duration: 0.7s;
            animation-iteration-count: infinite;
        }
        .bounding {
            animation-name: bound;
            animation-duration: 0.55s;
            animation-iteration-count: infinite;
        }

        @keyframes shake {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(-3deg); }
            20% { transform: rotate(3deg); }
            30% { transform: rotate(0deg); }
            40% { transform: rotate(3deg); }
            50% { transform: rotate(-3deg); }
            60% { transform: rotate(0deg); }
            70% { transform: rotate(-3deg); }
            80% { transform: rotate(3deg); }
            90% { transform: rotate(0deg); }
            100% { transform: rotate(-3deg); }
        }
        
        @keyframes bound {
            0% { transform: translateY(-10px)}
            10% { transform: translateY(-9.5px)}
            20% { transform: translateY(-8px)}
            30% { transform: translateY(-6px)}
            40% { transform: translateY(-3.5px)}
            50% { transform: translateY(0px)}
            60% { transform: translateY(-3.5px)}
            70% { transform: translateY(-6px)}
            80% { transform: translateY(-8px)}
            90% { transform: translateY(-9.5px)}
            100% { transform: translateY(-10px)}
            
        }
        `
    ]
})
export class TermComponent implements OnInit {

    selected: boolean;
    mode: {[k: string]: boolean} = {
        'shake' : true,
        'bound' : false
    }

    @Input() term: string;
    @Input() type: string = 'default';
    @Input() toolList: string | TemplateRef<void>;
    @Input() closeable: boolean = false;
    @Input() selectable: boolean = false;
    @Input() set selectMode(val:string) {
        Object.keys(this.mode).forEach(v => {
            if(v === val){
                this.mode[v] = true
            }
            else {
                this.mode[v] = false
            }
        })
    }

    @Output() closeEvent = new EventEmitter<string>();
    @Output() selectEvent = new EventEmitter<{stat: boolean, term: string}>();
    constructor() { }

    ngOnInit() {
        this.selected = false
    }

    close() {
        this.closeEvent.emit(this.term)
    }

    toggle() {
        if(this.selectable) {
            this.selected = !this.selected
            this.selectEvent.emit({stat: this.selected, term: this.term})
        }
    }
}
