import { Component, OnInit } from '@angular/core';
import { NzMessageService, UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import { NewWord } from 'src/app/interfaces/new_word';
import { NWDService } from 'src/app/services/nwd.service';

@Component({
  selector: 'app-dict-nwd',
  templateUrl: './dict-nwd.component.html',
  styleUrls: ['./dict-nwd.component.css']
})
export class DictNWDComponent implements OnInit {

    uploading: boolean = false;
    file_list: UploadFile[] = [];
    new_word_list: NewWord[];

    constructor(private nwd: NWDService, private message: NzMessageService) {
        
    }

    ngOnInit(){
      this.loadStat();
    }

    loadStat() {
      this.nwd.getCandidateList().subscribe((ret) => {
        this.new_word_list = [...ret.datas];
      })
    }
    beforeUpload = (file: UploadFile): boolean =>{
      if (this.file_list.length == 0) {
        this.file_list = this.file_list.concat(file)
      }
      else {
        this.file_list = [file]
      }
      return false
    }
    uploadFile(){
      this.uploading = true;
      return this.nwd.uploadFile(this.file_list[0]).subscribe((ret) => {
        console.log(ret)
        this.uploading = false;
        this.new_word_list = [...ret.datas];
        this.file_list = []

      })
    }
    checkTerm(term, stat){
      this.nwd.checkCandidate(term, stat).subscribe((ret) => {
        this.message.success(ret.message)
        this.new_word_list = [...this.new_word_list.filter(v => v.tname !== term)]
        console.log(this.new_word_list)
      })
    }
}
