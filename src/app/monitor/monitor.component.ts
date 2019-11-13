import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { SerialService, MircoBitPacket } from '../serial.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {
    constructor(public serialService: SerialService) {}
    lastMessage: MircoBitPacket;
    supportsSerial = true;
    receivedPackets:MircoBitPacket[] = []
    messageCount = 0;
    channel = 0;
    includeRawhex = false;
    includeRSSI = false;
    selectedId = 'Alle';
    seenIds: string[] = ['Alle'];
    seenKeys: string[] = [];

    ngOnInit() {
        this.supportsSerial = this.serialService.serialSupported() ? true : false;
    }

    toggleConnection() {
        if (this.serialService.connected) {
            this.serialService.disconnect();
        } else {
            this.serialService.connect(this.channel);
            this.serialService.packetSubject.subscribe(pkt => {
                this.receivedPackets.push(pkt);
                this.lastMessage = pkt;
            });
        }
    }


    saveFile() {
        const date = new Date();
        const filename = `data_${("0" + date.getHours()).slice(-2)}${("0" + date.getMinutes()).slice(-2)}.csv`
        const filteredPackets = this.selectedId === 'Alle' ? this.receivedPackets : this.receivedPackets.filter(e => e.microBitId === this.selectedId);
        let keys ='microbitID,Time';
        this.seenKeys.forEach(key => {
            keys += `,${key}`;
        });
        keys += `${this.includeRSSI ? ',Signalstyrke' : ''}`;
        keys += `${this.includeRawhex ? ',Rådata' : ''}\n`;
        saveAs(new Blob([keys, 
        filteredPackets.map(e => {
            let rowString =   `${e.microBitId},${e.timestamp}`;
            this.seenKeys.forEach(key => {
                rowString += `,${e.data[key] ? e.data[key] : ''}`;
            });
            rowString += `,${this.includeRSSI ? ',' + e.rssi : ''}`
            rowString += `,${this.includeRawhex ? ',' + e.rawHex : ''}\n`;
            return rowString;
        }).join('')], { type: "text" }),
        filename);
    }
    
    clearData() {
        this.receivedPackets = [];
    }

    onChannelChange() {
        this.channel = this.channel < 0 ? 0 : this.channel;
        this.channel = this.channel > 255 ? 255 : this.channel;
        this.serialService.setChannel(this.channel);
    }
}
