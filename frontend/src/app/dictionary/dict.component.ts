import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dict',
  templateUrl: './dict.component.html',
  styleUrls: ['./dict.component.css']
})
export class DictComponent implements OnInit {

//   categories: Array<Category> = [];
//   isOpen: boolean[] = []

//   constructor(private cs: CategoryService, private router: Router) { 
//     this.cs.getCategoryList().subscribe((x: CatAPIResponse)=> {
//       this.categories = x.datas.sort((a, b) => b.children.length - a.children.length)
//     })
//   }

  ngOnInit() {
  }
 

}
