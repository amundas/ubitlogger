import { Component } from '@angular/core';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent{
    files = [{fileName: 'microbit_firmware.hex', displayName: 'micro:bit'}, 
    {fileName: 'nRF52_dk_firmware.hex', displayName: 'nRF52 DK'}, 
    {fileName: 'nRF51_dongle_firmware.hex', displayName: 'nRF51 Dongle'}];

    selectedFile = this.files[0];

  constructor() { }

}
