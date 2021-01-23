import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchTerm: string;
  randomTerms: string[];

  constructor(private route: Router) { }

  ngOnInit() {
    this.searchTerm = '';
    this.randomTerms = ['中正大學', '台北', '蔡英文', '柯文哲', '周杰倫', '美國', '台鐵', '體操', '重訓', '射箭', '電池', '插座',  '遙控器']
  }
  search() {
    console.log(this.searchTerm)
    if (this.searchTerm !== ''){
      this.route.navigateByUrl(`/search?q=${this.searchTerm}`)
    }
  }
  randomSearch() {
    let idx = Math.ceil( Math.random() * 12);
    this.route.navigateByUrl(`/search?q=${this.randomTerms[idx]}`)
  }
}
