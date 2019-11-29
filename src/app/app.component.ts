import { Component } from '@angular/core';
import { language } from 'src/language/language'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    lang = language;

}
