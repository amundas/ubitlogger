import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';
import { SerialService, MircoBitPacket } from '../serial.service';
import { ChartService, ChartData } from '../chart.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit, OnDestroy {
    @ViewChild('chartCanvas', { static: false }) public chartRef;

    constructor(public serialService: SerialService, public chartService: ChartService, private snackbar: MatSnackBar) {}
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
    idToPlot = 'Alle';
    keyToPlot = '';
    showLine = false;

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
                this.messageCount ++;
                if(this.seenKeys.indexOf(pkt.key) === -1) {
                    this.seenKeys.push(pkt.key);
                }
                if(this.seenIds.indexOf(pkt.microBitId) === -1) {
                    this.seenIds.push(pkt.microBitId);
                }
            });
        }
    }


    saveFile() {
        const date = new Date();
        const filename = `data_${("0" + date.getHours()).slice(-2)}${("0" + date.getMinutes()).slice(-2)}.csv`
        const filteredPackets = this.getFilteredPackets(this.selectedId);
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
        this.messageCount = 0;
    }

    onChannelChange() {
        this.channel = this.channel < 0 ? 0 : this.channel;
        this.channel = this.channel > 255 ? 255 : this.channel;
        this.serialService.setChannel(this.channel);
    }

    ngOnDestroy(){
        this.serialService.disconnect();
    }
    
    getFilteredPackets(id?: string, key?: string): MircoBitPacket[] {
        let filteredPackets = [];
        filteredPackets = (id && id !== 'Alle') ? this.receivedPackets.filter(e => e.microBitId === id) : this.receivedPackets;
        if (key === '') {
            filteredPackets = [];
        } else if (key) {
            filteredPackets = filteredPackets.filter(e => e.key === key);
        } 
        
        return filteredPackets;
    }
    
    plotData() {
        let filteredPackets = this.getFilteredPackets(this.idToPlot, this.keyToPlot);
        if (filteredPackets.length > 5000) { // Protects users form themselves. Plotting too much will make the browser unresponsive
            this.openSnackBar('For mye data for å plotte', 2000);

        } else if (filteredPackets.length !== 0) {
            const data = new ChartData('#00AEFF', this.keyToPlot, filteredPackets.map(element => ({ x: element.timestamp, y: element.data[this.keyToPlot] })));
            this.chartService.getChart([data], this.chartRef, this.showLine);
        } else {
            this.openSnackBar('Kombinasjonen av ID og datatype har ingen data', 2000);
        }

    }

    openSnackBar(message: string, duration: number) {
        this.snackbar.open(message, '', {duration: duration})
    }
}
