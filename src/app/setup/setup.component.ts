import { Component } from '@angular/core';
import { language } from 'src/language/language';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent{
    files = [{fileName: 'microbit_firmware.hex', displayName: 'micro:bit'}, 
    {fileName: 'nRF52_dk_firmware.hex', displayName: 'nRF52 DK'}, 
    {fileName: 'nRF51_dongle_firmware.hex', displayName: 'nRF51 Dongle'},
    {fileName: 'nRF52_dongle_firmware.hex', displayName: 'nRF52 Dongle'}];

    selectedFile = this.files[0];
    lang  = language;
    
}
