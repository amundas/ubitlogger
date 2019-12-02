import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { SerialService, MircoBitPacket } from '../serial.service';
import { MatSnackBar } from '@angular/material';
import { Chart } from 'chart.js';
import { language, LanguageInterface } from 'src/language/language';

const maxPointsToPlot = 5000;

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements AfterViewInit, OnDestroy {
    
    @ViewChild('chartCanvas', { static: false }) public chartRef;
    lang: LanguageInterface;
    constructor(public serialService: SerialService, private snackbar: MatSnackBar) {
        this.lang = <LanguageInterface>language;
    }
    lastMessage: MircoBitPacket;
    supportsSerial = true;
    receivedPackets:MircoBitPacket[] = []
    messageCount = 0;
    channel = 0;
    includeRawhex = false;
    includeRSSI = false;
    seenKeys: any = {}; // id as key, list of keys as value
    seenIds = []
    idToPlot = '';
    keyToPlot = '';
    idToDownload = 'All';
    drawLine = false;
    livePlotStarted = false;
    chart: Chart;

    private chartOptions = {
        type: 'scatter',
        data: {
            datasets: []
        },
        options: {
            title: {
                display: false,
            },
            legend: {
                display: true
            },
            tooltips: {
                enabled: true
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                      display: true,
                      scaleLabel: {
                          labelString: 'Timestamp',
                          display: true,
                      }
                }]
            },
                  
        },
    }

    ngAfterViewInit() {
        this.supportsSerial = this.serialService.serialSupported() ? true : false;
        if (this.supportsSerial) {
            this.chart = new Chart(this.chartRef.nativeElement.getContext('2d'), this.chartOptions );
        }
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
                if (!this.seenKeys[pkt.microBitId]) {
                    this.seenIds.push(pkt.microBitId);
                    this.seenKeys[pkt.microBitId] = [pkt.key];
                } else if(this.seenKeys[pkt.microBitId].indexOf(pkt.key) === -1) {
                    this.seenKeys[pkt.microBitId].push(pkt.key);
                }
                if (this.livePlotStarted && pkt.microBitId === this.idToPlot && pkt.key === this.keyToPlot) {
                    if (this.chartOptions.data.datasets[0].data.length > maxPointsToPlot) {
                        this.livePlotStarted = false;
                        this.chartOptions.options.tooltips.enabled = true;
                        this.openSnackBar(this.lang.monitor.snackBarRealtimeStopped,this.lang.monitor.snackBarRealtimeStoppedAction, 0);
                    } else {
                        this.chartOptions.data.datasets[0].data.push({ x: pkt.timestamp, y: pkt.data[this.keyToPlot] })
                        this.chart.update();
                    }
                }
            });
        }
    }


    saveFile() {
        const date = new Date();
        const filename = `data_${("0" + date.getHours()).slice(-2)}${("0" + date.getMinutes()).slice(-2)}.csv`
        const filteredPackets = this.getFilteredPackets(this.idToDownload);
        let topRow =`${this.lang.monitor.csvKeys.id},${this.lang.monitor.csvKeys.timestamp}`;
        let uniqueKeys = [];
        if (this.idToDownload === 'All') {
            this.seenIds.forEach(id => {
                this.seenKeys[id].forEach(k => {
                    if (uniqueKeys.indexOf(k) === -1) {
                        uniqueKeys.push(k);
                    }
                });
            });
        } else {
            uniqueKeys = this.seenKeys[this.idToDownload];
        }
        uniqueKeys.forEach(key => {
            topRow += `,${key}`;
        });
        topRow += `${this.includeRSSI ? `,${this.lang.monitor.csvKeys.rssi}` : ''}`;
        topRow += `${this.includeRawhex ? `,${this.lang.monitor.csvKeys.rawData}` : ''}\n`;
        saveAs(new Blob([topRow, 
        filteredPackets.map(e => {
            let rowString =   `${e.microBitId},${e.timestamp}`;
            uniqueKeys.forEach(key => {
                rowString += `,${typeof e.data[key] !== 'undefined' ? e.data[key] : ''}`;
            });
            rowString += `${this.includeRSSI ? ',' + e.rssi : ''}`
            rowString += `${this.includeRawhex ? ',' + e.rawHex : ''}\n`;
            return rowString;
        }).join('')], { type: "text" }),
        filename);
    }
    
    clearData() {
        this.receivedPackets = [];
        this.seenKeys = {};
        this.seenIds = [];
        this.idToDownload = 'All';
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
        filteredPackets = id !== 'All' ? this.receivedPackets.filter(e => e.microBitId === id) : this.receivedPackets;
        if (key === '') {
            filteredPackets = [];
        } else if (key) {
            filteredPackets = filteredPackets.filter(e => e.key === key);
        } 
        
        return filteredPackets;
    }
    
    plotData(live: boolean) {
        if (live && this.livePlotStarted) {
            this.livePlotStarted = false;
            this.chartOptions.options.tooltips.enabled = true;
            return;  
        }

        let filteredPackets = this.getFilteredPackets(this.idToPlot, this.keyToPlot);
        if (filteredPackets.length > maxPointsToPlot) { // Protects users form themselves. Plotting too much will make the browser unresponsive
            this.openSnackBar(this.lang.monitor.snackBarTooMuchData,'', 2000);

        } else if (filteredPackets.length !== 0) {
            if (typeof filteredPackets[0].data[this.keyToPlot] === 'string') {
                this.openSnackBar(this.lang.monitor.snackBarNoTextPlot, '', 2000);
                return;
            }
            this.chartOptions.data.datasets = [{
                label: this.idToPlot,
                showLine: this.drawLine,
                data: filteredPackets.map(element => ({ x: element.timestamp, y: element.data[this.keyToPlot] })),
                borderColor: '#00AEFF',
                fill: false,
                pointHitRadius: 20,
            }];
            // Tooltips don't work well with live plotting. Disable them if live
            this.chartOptions.options.tooltips.enabled = live ? false : true;
            this.livePlotStarted = live;
            this.chart.update();
        } else {
            this.openSnackBar(this.lang.monitor.snackBarInvalidDataID, '', 2000);
        }

    }

    openSnackBar(message: string, action: string, duration: number) {
        this.snackbar.open(message, action, {duration: duration})
    }
}
