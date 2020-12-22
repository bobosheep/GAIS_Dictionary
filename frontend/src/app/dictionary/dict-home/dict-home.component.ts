import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dict-home',
  templateUrl: './dict-home.component.html',
  styleUrls: ['./dict-home.component.css']
})
export class DictHomeComponent implements OnInit {

//   categories: Array<Category> = [];
//   isOpen: boolean[] = []

//   constructor(private cs: CategoryService, private router: Router) { 
//     this.cs.getCategoryList().subscribe((x: CatAPIResponse)=> {
//       this.categories = x.datas.sort((a, b) => b.children.length - a.children.length)
//     })
//   }

  update_time: number ;

  ngOnInit() {
    this.update_time = Date.now();
  }
 

}
