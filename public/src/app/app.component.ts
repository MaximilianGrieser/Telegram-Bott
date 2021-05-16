import {Component} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

let ELEMENT_DATA: info[] = [];

export interface info {
  name: string;
  due: string;
  description: string;
}

 @Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class  AppComponent {
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns: string[] = ['Name', 'Due', 'Description'];
  chat_ID = "";

  loadData(): void {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log("Read Info");
          ELEMENT_DATA = JSON.parse(this.responseText)
        }
      }
      
      request.open("GET", "http://localhost:3000/info/"+ this.chat_ID, false);
      request.send();

      this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      console.log(this.dataSource)
  }

  changeID(event: Event): void {
    this.chat_ID = (event.target as HTMLInputElement).value;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

