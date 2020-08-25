import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  editorContent = "Hi Soham"

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  testButton(){
    console.log("Editor---", this.editorContent);
    // this.router.navigate(['/dashboard']);
  }

}
