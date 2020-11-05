import { Component, Input, OnInit, TemplateRef, ViewChild, NgZone  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';


import { CategoryDetail } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';
import { ExtensionModalComponent } from '../cat-extension/cat-extension.component';
import { similarWordParams } from 'src/app/interfaces/extension';

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
  models : string[];
  similarWord_param : similarWordParams;

  addTermStr: string = '';
  addTermStrList: string[] = [];
  syncSeed: boolean = false;

  candidates: string[];

  termStyle: {[k: string] : string} = {};

  selectedCandidates: Set<string> = new Set();
  
  constructor(private cs: CategoryService, private route: ActivatedRoute, 
              private ms: NzModalService, private zone: NgZone,
              private message: NzMessageService) {
    this.route.queryParams.subscribe((param)=> {
      this.loading = true
      this.cid = param.cid
      this.cs.getCategory(this.cid).subscribe((ret) => {
        this.catDetail = { ...ret.data}
        this.child_mutex = this.catDetail.childmutex
        this.similarWord_param = {
          term : '',
          n_results: 10,
          cid : this.catDetail._id,
          with_sim : false,
          model: 'wiki_news',
          f_removed: true,     // TRUE: 過濾已經被刪除過的字詞
          f_exist: true        // TRUE: 過濾已經存在的類別詞
        }
        this.loading = false
      })
    })
  }

  ngOnInit() {
    this.candidates = []
    this.models = ['wiki_news', 'dcard']
    this.modal_visible = {
      seed: false,
      extension: false, 
      termExtensionParam: false
    }
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
    }, (error)=> {
      console.log(error)
      this.message.create('error', error.error.message)
    })
  }
  
  // delete seeds
  deleteSeed(seed: string) {
    this.cs.deleteSeeds(this.catDetail._id, seed).subscribe((ret) => {
      this.catDetail = { ...this.catDetail, ...ret.data};
      this.message.create('success', `成功刪除種子 ${seed} `)
    }, (error)=> {
      this.message.create('error', error.message)
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
        let termList = [...this.addTermStrList];
        if(this.addTermStr !== ''){
          termList = [...termList, ...this.addTermStr.split(',')]
        }

        const terms = termList.join(',')

        this.addTerm(terms);
        if(this.syncSeed) {
          this.addSeeds(terms);
        }
        this.addTermStr = ''
        this.addTermStrList = []
      }
      else {
        console.log('cancel')
      }
    })
  }

  // Add terms
  addTerm(terms: string) {
    if(terms.length < 1) {
      return;
    }
    /// terms is a string with many term separated by ','
    this.cs.addTerms(this.catDetail._id, terms).subscribe((ret) => {
      this.catDetail = { ...this.catDetail, ...ret.data};
      terms.split(',').forEach((term) => {
        this.candidates = this.candidates.filter(t => t !== term)
      })
    }, (error) => {
      this.message.create('error', error.error.message)
    })
  }
  addToTermList() {
    this.addTermStrList = [...this.addTermStrList, ...this.addTermStr.split(',')]
    this.addTermStr = ''
  }
  deleteAddTerm(term: string) {
    this.addTermStrList = this.addTermStrList.filter(t => t !== term)
  }

  // delete term
  deleteTerm(term: string) {
    this.cs.deleteTerms(this.catDetail._id, term).subscribe((ret) => {
      this.catDetail = { ...this.catDetail, ...ret.data};
    })
  }

  deleteCandidate(term: string) {
    this.candidates = this.candidates.filter(v => v !== term)
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
        const id = this.message.loading('擴展中...', { nzDuration: 0 }).messageId
        this.cs.extendCategory(this.catDetail._id, result).subscribe((ret) => {
          this.message.remove(id)
          this.message.create('success', ret.message)
          const candidatesSet = new Set([ ...this.candidates, ...ret.datas])
          this.candidates = [...candidatesSet]

        })
        setTimeout(() => {
          this.message.remove(id)
          this.message.create('error', 'Server no response for 20 sec!')
        }, 20000)
      }
    })

  }

  
  openTermExtensionParamModal(title: string | TemplateRef<{}>, content: TemplateRef<{}>) {
    const modal: NzModalRef = this.ms.create({
      nzTitle: title,
      nzClosable: false,
      nzContent: content,
      nzFooter: [{
        type: 'primary',
        label: '完成',
        onClick: () =>  modal.destroy()
      }]
    })

  }
  extendTerm(term: string) {
    this.similarWord_param.term = term;
    this.cs.extendTerm(this.similarWord_param).subscribe((ret) => {
      console.log(ret)
      this.termStyle[term] = 'success'
      console.log(this.termStyle)
      this.message.create('success', ret.message)
      const candidatesSet = new Set([ ...this.candidates, ...ret.datas])
      this.candidates = [...candidatesSet]
    }, (error)=> {
      console.log(error)
      this.termStyle[term] = 'danger'
      this.message.create('error', error.error.message)
    })
  }

/// Candidates part
  selectCandidates(event : {stat: boolean, term: string}) {
    if(event.stat){
      this.selectedCandidates.add(event.term)
    } else {
      this.selectedCandidates.delete(event.term)
    }
  }
  moveCandidates() { 
    console.log(this.selectedCandidates, ' with size ', this.selectedCandidates.size)
    if(this.selectedCandidates.size > 0) {
      const terms = [...this.selectedCandidates.keys()]
      this.addTerm(terms.join(','));
    } else {
      const terms = [...this.candidates]
      this.addTerm(terms.join(','))
    }

  }
  clearCandidates() {
    if(this.selectedCandidates.size > 0) {
      const terms = [...this.selectedCandidates.keys()]
      terms.forEach((term) => {
        this.candidates = this.candidates.filter(t => t !== term)
      })
    } else {
      this.candidates = []
    }

  }
} 
