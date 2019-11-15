import { Component, OnDestroy } from '@angular/core';
import { SerialService } from '../serial.service';

@Component({
    selector: 'app-identify',
    templateUrl: './identify.component.html',
    styleUrls: ['./identify.component.css']
})
export class IdentifyComponent implements OnDestroy {

    constructor(public serialService: SerialService) { }
    channel = 0;
    lastId = '';
    stopOnFirst = true;
    scanning = false;
    first = true;

    toggleConnection() {
        if (this.serialService.connected) {
            this.serialService.disconnect();
        } else {
            this.serialService.connect(this.channel);
            this.serialService.packetSubject.subscribe(pkt => {
                if (this.scanning) {
                    if((this.stopOnFirst && this.first) || !this.stopOnFirst) {
                        this.lastId = pkt.microBitId;
                        this.first = false;
                        if(this.stopOnFirst && !this.first) {
                            this.scanning = false;
                        }
                    }
                }
            });
        }
    }

    onChannelChange() {
        this.channel = this.channel < 0 ? 0 : this.channel;
        this.channel = this.channel > 255 ? 255 : this.channel;
        this.serialService.setChannel(this.channel);
    }

    toggleScan() {
        this.scanning = !this.scanning;
        if(this.scanning) {
            this.lastId = '';
            this.first = true;
        }
    }

    ngOnDestroy(){
        this.serialService.disconnect();
    }
}
