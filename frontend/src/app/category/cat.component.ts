import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CatAPIResponse } from '../interfaces/api';

import { Category } from '../interfaces/category';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-cat',
  templateUrl: './cat.component.html',
  styleUrls: ['./cat.component.css']
})
export class CatComponent implements OnInit {

  categories: Array<Category> = [];
  isOpen: boolean[] = []

  constructor(private cs: CategoryService, private router: Router) { 
    this.cs.getCategoryList().subscribe((x: CatAPIResponse)=> {
      this.categories = x.datas.sort((a, b) => b.children.length - a.children.length)
    })
  }

  ngOnInit() {
  }
 

}
