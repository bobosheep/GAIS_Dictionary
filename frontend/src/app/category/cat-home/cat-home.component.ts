import { Component, OnInit } from '@angular/core';
import { CategoryDetail } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-cat-home',
  templateUrl: './cat-home.component.html',
  styleUrls: ['./cat-home.component.css']
})
export class CatHomeComponent implements OnInit {

  cat_list: Array<CategoryDetail>;

  constructor(private cs : CategoryService) { }

  ngOnInit() {
    this.cs.getCategoryStat().subscribe((ret) => {
      this.cat_list = ret.datas
      this.cat_list.sort((a, b) => b.children.length - a.children.length )
      console.log(this.cat_list)
      
    })
  }

  openDownloadOptions() {
    console.log('Open')
  }
}
