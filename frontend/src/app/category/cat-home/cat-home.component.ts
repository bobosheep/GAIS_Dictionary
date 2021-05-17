import { Component, OnInit } from '@angular/core';
import { NzTreeNodeOptions } from 'ng-zorro-antd';
import { CategoryDetail } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-cat-home',
  templateUrl: './cat-home.component.html',
  styleUrls: ['./cat-home.component.css']
})
export class CatHomeComponent implements OnInit {

  cat_list: Array<CategoryDetail>;
  modal_visibility: boolean;
  isDownloading: boolean;
  nodes: Array<NzTreeNodeOptions>;

  constructor(private cs : CategoryService) { }

  ngOnInit() {
    this.modal_visibility = false;
    this.isDownloading = false;
    this.nodes = [{
      title: '全部類別',
      key: 'all',
      checked: false,
      expanded: true,
      children: []
    }]
    this.cs.getCategoryStat().subscribe((ret) => {
      this.cat_list = ret.datas
      this.cat_list.sort((a, b) => b.children.length - a.children.length )
      this.cat_list.forEach((v) => {
        this.nodes[0].children.push(this.catNodeToTreeNode(v))
      })
      console.log(this.cat_list)
      console.log(this.nodes)
      
    })
  }

  catNodeToTreeNode(catNode: CategoryDetail): NzTreeNodeOptions {
    let node: NzTreeNodeOptions = {
      title: catNode.cname,
      key: catNode.cname,
      children: [],
      isLeaf: catNode.children.length === 0
    };
    catNode.children.forEach((v) => {
      node.children.push(this.catNodeToTreeNode(v))
    })

    return node
  }
  getNodeChecked(node: NzTreeNodeOptions): Array<string>{
    let checkedNode: string[] = [];
    if(node.key === 'all' && node.checked) return ['all'];
    if(node.checked) checkedNode.push(node.key)
    node.children.forEach(n => {
      checkedNode = checkedNode.concat(this.getNodeChecked(n))
    });
    return checkedNode
  }

  openDownloadOptions() {
    this.modal_visibility = true;
  }
  handleCancel(){
    this.modal_visibility = false;
  }
  handleOk(){
    let checkedCat = [];
    // this.isDownloading = true;
    checkedCat = this.getNodeChecked(this.nodes[0])
    console.log(checkedCat)
    this.cs.downloadCategoryDictionary(checkedCat, 'file').subscribe(
      (data: any) => {
        console.log(data)
        this.downloadFile(data, 'stat.txt', data.type)
      }
    )
  }
  
  downloadFile(data, filename, type) {
    console.log('downloading...')
    let a = document.createElement("a");
    const file = new Blob([data], { type: type });
    const url= window.URL.createObjectURL(file);
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url);

  }
}
