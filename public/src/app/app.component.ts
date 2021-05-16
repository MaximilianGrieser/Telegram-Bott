import {Component} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

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
  ELEMENT_DATA: info[] = [];
  displayedColumns: string[] = ['Name', 'Due', 'Description'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  chat_ID = "";

  loadData(): void {
    console.log(this.chat_ID)
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log("Read Info");  
        }
    }

    request.open("GET", "localhost:3000/info/"+ this.chat_ID, true);
    request.send();


    //this.dataSource = new MatTableDataSource(ELEMENT_DATA);
  }


  changeID(event: Event): void {
    this.chat_ID = (event.target as HTMLInputElement).value;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

