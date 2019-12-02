import { Component } from '@angular/core';
import { language } from 'src/language/language'

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {

  constructor() { }
  lang = language;

}
