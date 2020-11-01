import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { CategoryDetail } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-cat-detail',
  templateUrl: './cat-detail.component.html',
  styleUrls: ['./cat-detail.component.css']
})
export class CatDetailComponent implements OnInit {

  cid: string;
  catDetail: CategoryDetail;
  routeParams: string | string[] = [];
  constructor(private cs: CategoryService, private route: ActivatedRoute, private ms: NzModalService) { }

  ngOnInit() {
    // this.cid = history.state.cid;
    this.route.params.subscribe((param) => {
      this.routeParams = Object.values(param)
      this.routeParams.unshift('edit')
      this.routeParams.unshift('/category')
      // this.routeParams = this.routeParams.join('/')
    })
    this.route.queryParams.subscribe((param) => {
      this.cid = param.cid
      this.cs.getCategory(this.cid).subscribe((ret) => {
        this.catDetail = ret.data
      })
    }, (error) => {
      console.log(error)
    })
  }

  openModal(part: string, title: string, modalContent: TemplateRef<{}>){
    const modal: NzModalRef = this.ms.create({
      nzTitle: title,
      nzClosable: false,
      nzContent: modalContent,
      nzFooter: [
        {
          type: 'primary',
          label: '關閉',
          onClick: () =>  modal.destroy()
        }
      ]
    })
    if(part === 'seeds'){
      modal.afterClose.subscribe(() => {
        console.log('seed success')
      })
    }
  }

  
  handleCancel(part: string) {
  }
}
