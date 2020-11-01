import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, Validators  } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { ExtensionParams } from '../interfaces/extension';

@Component({
    selector: 'app-extension-form',
    template: `
    <div class="wrapper">
        <h1 class="title">{{ title }}</h1>
        <div class="content">
            <form [formGroup]="paramForm" class="wrapper" >
                <fieldset class="params-field">
                    <label for="method">擴展方法</label>
                    <select  formControlName="method">
                        <option value="1">方法 1</option>
                    </select>
                </fieldset>

                <fieldset class="params-field">            
                    <label for="iteration">迭代次數 (Iteration)</label>
                    <input type="number" placeholder="1-5" formControlName="iteration">
                    <div *ngIf="paramForm.controls.iteration.invalid && 
                                (paramForm.controls.iteration.dirty || paramForm.controls.iteration.touched)" 
                                class="alert alert-danger">
            
                        <div *ngIf="paramForm.controls.iteration.errors.required">
                        迭代次數不能為空
                        </div>
                        <div *ngIf="paramForm.controls.iteration.errors.min">
                        迭代次數需大於等於 <b>{{limits.iteration.min}}</b>.
                        </div>
                        <div *ngIf="paramForm.controls.iteration.errors.max">
                        迭代次數需小於等於 <b>{{limits.iteration.max}}</b>.
                        </div>
                    </div>
            
                </fieldset>

                <fieldset class="params-field">    
                    <label for="threshold">閾值 (threshold)</label>
                    <input type="number" step="0.05" placeholder="Default 0.5"formControlName="threshold">
                    <div *ngIf="paramForm.controls.threshold.invalid && 
                                (paramForm.controls.threshold.dirty || paramForm.controls.threshold.touched)" 
                                class="alert alert-danger">
            
                        <div *ngIf="paramForm.controls.threshold.errors.required">
                        閾值不能為空
                        </div>
                        <div *ngIf="paramForm.controls.threshold.errors.min">
                        閾值需大於等於 <b>{{limits.threshold.min}}</b>.
                        </div>
                        <div *ngIf="paramForm.controls.threshold.errors.max">
                        閾值需小於等於 <b>{{limits.threshold.max}}</b>.
                        </div>
                    </div>
                </fieldset>

                <fieldset class="params-field">            
                    <label for="n_result">相關詞結果數量 (Related Result)</label>
                    <input type="number" step="5" placeholder="Default 10" formControlName="n_result">
                    <div *ngIf="paramForm.controls.n_result.invalid && 
                                (paramForm.controls.n_result.dirty || paramForm.controls.n_result.touched)" 
                                class="alert alert-danger">
            
                        <div *ngIf="paramForm.controls.n_result.errors.required">
                        結果數量不能為空
                        </div>
                        <div *ngIf="paramForm.controls.n_result.errors.min">
                        結果數量需大於等於 <b>{{limits.n_result.min}}</b>.
                        </div>
                        <div *ngIf="paramForm.controls.n_result.errors.max">
                        結果數量需小於等於 <b>{{limits.n_result.max}}</b>.
                        </div>
                    </div>
            
                </fieldset>

                <fieldset class="params-field">    
                    <div *ngIf="paramForm.value.method == 1">
                        <label for="coverage">覆蓋率 (Coverage)</label>
                        <input type="number" step="0.05" placeholder="Default 0.3" formControlName="coverage">
                        <div *ngIf="paramForm.controls.coverage.invalid && 
                                    (paramForm.controls.coverage.dirty || paramForm.controls.coverage.touched)" 
                                    class="alert alert-danger">
            
                            <div *ngIf="paramForm.controls.coverage.errors.required">
                            覆蓋率不能為空
                            </div>
                            <div *ngIf="paramForm.controls.coverage.errors.min">
                            覆蓋率需大於等於 <b>{{limits.coverage.min}}</b>.
                            </div>
                            <div *ngIf="paramForm.controls.coverage.errors.max">
                            覆蓋率需小於等於 <b>{{limits.coverage.max}}</b>.
                            </div>
                        </div>
            
                    </div>
                
                </fieldset>
                <div class="action-wrapper">
                    <button class="button button-outline action-button" *ngIf="cancelButton" (click)="onCancel()">取消</button>
                    <input class="button button-primary action-button"  [disabled]="!paramForm.valid" type="submit" value="執行" (click)="onSubmit()">
                </div>
            </form>
            
        </div>

    </div>

    `,
    styles: [
        `
        .wrapper {
            width: 95%;
            margin: 0 auto;
        
        }
        
        .title {
            width: 100%;
            font-size: 18px;
            font-weight: 600;
            text-align: center;
        }
        .content {
            width: 100%;
        }
        .action-button {
            flex: 2;
            margin: 1em;
        }
        
        .alert {
            color: tomato;
            font-style: italic;
        }
        .params-field {
            margin-bottom: 1.5em;
        }
        .action-wrapper {
            margin-top: 2.5em;
            width: 100%;
            display: flex;
            justify-content: flex-start;
        }
        `
    ]
})
export class ExtensionFormComponent implements OnInit {

    @Input() title: string | TemplateRef<{}>;
    @Input() cancelButton: boolean = false;

    @Output() onCancelEvent = new EventEmitter<boolean>();
    @Output() onSibmitEvent = new EventEmitter<ExtensionParams>();
    limits = {
        'iteration': {
          'min': 1, 'max': 5
        },
        'threshold': {
          'min': 0.2, 'max': 0.9
        },
        'n_result': {
          'min': 10, 'max': 50
        },
        'coverage': {
          'min': 0.1, 'max': 0.8
        }
      }
    paramForm = this.fb.group({
        method: ['1', Validators.required],
        iteration: [1,  [Validators.required, Validators.min(this.limits['iteration']['min']), Validators.max(this.limits['iteration']['max'])]],
        threshold: [0.5, [Validators.min(this.limits['threshold']['min']), Validators.max(this.limits['threshold']['max'])]],
        n_result: [10, [Validators.min(this.limits['n_result']['min']), Validators.max(this.limits['n_result']['max'])]],
        coverage: [0.3, [Validators.min(this.limits['coverage']['min']), Validators.max(this.limits['coverage']['max'])]]
    
      })
      
    constructor(private fb: FormBuilder, private modal: NzModalRef) { }

    ngOnInit() {
    }
    
    onCancel(){
        this.onCancelEvent.emit(true);
        this.modal.destroy(null);
    }
    onSubmit() {
        this.onSibmitEvent.emit(this.paramForm.value);
        this.modal.destroy(this.paramForm.value);

    }

}
