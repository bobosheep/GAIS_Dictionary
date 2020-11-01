import { Component, Input, OnInit, TemplateRef, ViewChild, NgZone  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';


import { CategoryDetail } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { ExtensionModalComponent } from '../cat-extension/cat-extension.component';

@Component({
  selector: 'app-cat-edit',
  templateUrl: './cat-edit.component.html',
  styleUrls: ['./cat-edit.component.css']
})
export class CatEditComponent implements OnInit {

  cid: string;
  catDetail: CategoryDetail;
  loading: boolean = false;
  child_mutex: boolean = false;

  modal_visible: { [k:string] : boolean} = {seed: false, extension: false, termExtensionParam: false };
  extension_param : any = {};

  addTerms: string = '';
  addTermsList: string[] = [];
  
  constructor(private cs: CategoryService, private route: ActivatedRoute, 
              private ms: NzModalService, private zone: NgZone,
              private message: NzMessageService) { }

  ngOnInit() {
    // this.cid = history.state.cid;
    this.extension_param = {
      n_results: 10,
      models: ['model 1', 'model 2'],
      filter_removed: true,     // TRUE: 過濾已經被刪除過的字詞
      filter_exist: true        // TRUE: 過濾已經存在的類別詞
    }
    this.modal_visible = {
      seed: false,
      extension: false, 
      termExtensionParam: false
    }
    this.route.queryParams.subscribe((param)=> {
      this.loading = true
      this.cid = param.cid
      this.cs.getCategory(this.cid).subscribe((ret) => {
        this.catDetail = ret.data
        this.child_mutex = this.catDetail.childmutex
        this.loading = false
      })
    })
  }

  changeMutex(){
    this.child_mutex = !this.child_mutex
  }

/// Seed Part
  openSeedModal(title: string | TemplateRef<{}>, content: TemplateRef<{}>) {
    const modal: NzModalRef = this.ms.create({
      nzTitle: title,
      nzClosable: false,
      nzContent: content,
      nzFooter: [
        {
          type: 'primary',
          label: '關閉',
          onClick: () =>  modal.destroy()
        }
      ]
    })
  }

  // Add seeds
  addSeeds(seeds: string) {
    this.cs.addSeeds(this.catDetail._id, seeds).subscribe((ret) => {
      this.catDetail = { ...this.catDetail, ...ret.data};
      this.message.create('success', `成功加入種子 ${seeds} `)
    })
  }
  
  // delete seeds
  deleteSeed(seed: string) {
    this.cs.deleteSeeds(this.catDetail._id, seed).subscribe((ret) => {
      this.catDetail = { ...this.catDetail, ...ret.data};
      this.message.create('success', `成功刪除種子 ${seed} `)
    })
  }


/// Term Part
  openAddTermModal(title: string | TemplateRef<{}>, content: TemplateRef<{}>) {
    const modal: NzModalRef = this.ms.create({
      nzTitle: title,
      nzClosable: false,
      nzContent: content,
      nzFooter: [
        {
          type: 'outline',
          label: '取消',
          onClick: () =>  modal.destroy(false)
        },
        {
          type: 'primary',
          label: '加入',
          onClick: () =>  modal.destroy(true)
        }
      ]
    })
    modal.afterClose.subscribe((ret) => {
      if(ret){
        const terms = this.addTermsList.join(',')
        console.log(terms)
        this.cs.addTerms(this.catDetail._id, terms).subscribe((ret) => {
          this.catDetail = { ...this.catDetail, ...ret.data};
        })
        this.addTerms = ''
        this.addTermsList = []
      }
      else {
        console.log('cancel')
      }
    })
  }

  // Add terms
  addToTermList() {
    this.addTermsList = [...this.addTermsList, ...this.addTerms.split(',')]
    this.addTerms = ''
  }
  deleteAddTerm(term: string) {
    this.addTermsList = this.addTermsList.filter(t => t !== term)
  }

  // delete term
  deleteTerm(term: string) {
    this.cs.deleteTerms(this.catDetail._id, term).subscribe((ret) => {
      this.catDetail = { ...this.catDetail, ...ret.data};
    })
  }

/// Extension Part
  openExtensionModal(title: string) {
    const modal: NzModalRef = this.ms.create({
      nzTitle: title,
      nzClosable: false,
      nzContent: ExtensionModalComponent,
      nzFooter: null
    })
    modal.afterClose.subscribe((result) => {
      if(result){
        console.log(result)
      }
    })

  }

  
  openTermExtensionParamModal(title: string | TemplateRef<{}>, content: TemplateRef<{}>) {
    const modal: NzModalRef = this.ms.create({
      nzTitle: title,
      nzClosable: false,
      nzContent: content,
      nzFooter: [
        {
          type: 'primary',
          label: '完成',
          onClick: () =>  modal.destroy()
        }
      ]
    })
    modal.afterClose.subscribe((result) => {
      if(result){
        console.log(result)
      }
    })

  }


} 
