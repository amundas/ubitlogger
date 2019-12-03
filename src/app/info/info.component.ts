import { Component } from '@angular/core';
import { language } from 'src/language/language';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  lang = language;
  constructor() { }
}
