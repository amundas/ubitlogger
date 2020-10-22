import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { SerialService, MircoBitPacket } from '../serial.service';
import { MatSnackBar } from '@angular/material';
import { Chart } from 'chart.js';
import { language } from 'src/language/language';

const maxPointsToPlot = 5000;

//TODO: Litt treigt endå. Kjør utanfor ngZone?
@Component({
    selector: 'app-monitor',
    templateUrl: './monitor.component.html',
    styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements AfterViewInit, OnDestroy {

    @ViewChild('chartCanvas', { static: false }) public chartRef;
    lang;
    constructor(public serialService: SerialService, private snackbar: MatSnackBar) {
        this.lang = language;
    }
    lastMessage: MircoBitPacket;
    supportsSerial = true;
    receivedPackets: MircoBitPacket[] = []
    messageCount = 0;
    channel = 0;
    includeRawhex = false;
    includeRSSI = false;
    seenKeys: any = {}; // id as key, list of keys as value
    seenIds = []
    idToPlot = 'All';
    keyToPlot = '';
    idToDownload = 'All';
    drawLine = false;
    livePlotStarted = false;
    idsInPlot = [];
    chart: Chart;

    private chartOptions = {
        type: 'scatter',
        data: {
            datasets: []
        },
        options: {
            animation: {
                duration: 1000
            },
            title: {
                display: false,
            },
            legend: {
                display: true
            },
            tooltips: {
                enabled: true,
                intersect: false,
                mode: 'index',
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    display: true,
                    time: {
                        tooltipFormat: 'DD. MMM, HH:mm:ss',
                        displayFormats: {
                            millisecond: 'HH:mm:ss',
                            second: 'HH:mm:ss',
                            minute: 'HH:mm:ss',
                            hour: 'HH:mm',
                            day: 'HH:mm',
                        },
                    },
                    ticks: {
                        maxTicksLimit: 5,
                        maxRotation: 0,
                        minRotation: 0,
                        sampleSize: 1,
                    }
                }]
            },

        },
    }

    ngAfterViewInit() {
        this.supportsSerial = this.serialService.serialSupported() ? true : false;
        if (this.supportsSerial) {
            this.chart = new Chart(this.chartRef.nativeElement.getContext('2d'), this.chartOptions);
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
                this.messageCount++;
                if (!this.seenKeys[pkt.microBitId]) {
                    this.seenIds.push(pkt.microBitId);
                    this.seenKeys[pkt.microBitId] = [pkt.key];
                } else if (this.seenKeys[pkt.microBitId].indexOf(pkt.key) === -1) {
                    this.seenKeys[pkt.microBitId].push(pkt.key);
                }
                const idIdx = this.idsInPlot.indexOf(pkt.microBitId)
                if (this.livePlotStarted && idIdx !== -1 && ((this.idToPlot === 'All' && typeof pkt.data === 'number') || pkt.key === this.keyToPlot)) {
                    if (this.receivedPackets.length > maxPointsToPlot) {
                        this.livePlotStarted = false;
                        this.chartOptions.options.tooltips.enabled = true;
                        this.openSnackBar(this.lang.monitor.snackBarRealtimeStopped, this.lang.monitor.snackBarRealtimeStoppedAction, 0);
                    } else {
                        this.chartOptions.data.datasets[idIdx].data.push({ x: pkt.utcTimestamp, y: pkt.data })
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
        let topRow = `${this.lang.monitor.csvKeys.id},${this.lang.monitor.csvKeys.timestamp},${this.lang.monitor.csvKeys.utcTimestamp}`;
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
                let rowString = `${e.microBitId},${e.timestamp},${e.utcTimestamp}`;
                uniqueKeys.forEach(key => {
                    rowString += `,${e.key === key ? e.data : ''}`;
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
        this.clearPlot();
    }

    onChannelChange() {
        this.channel = this.channel < 0 ? 0 : this.channel;
        this.channel = this.channel > 255 ? 255 : this.channel;
        this.serialService.setChannel(this.channel);
    }

    ngOnDestroy() {
        this.serialService.disconnect();
    }

    getFilteredPackets(id?: string, key?: string): MircoBitPacket[] {
        let filteredPackets = [];
        filteredPackets = id !== 'All' ? this.receivedPackets.filter(e => e.microBitId === id) : this.receivedPackets;
        if (key === '') {
            filteredPackets = [];
        } else if (key === 'plottable') {
            filteredPackets = filteredPackets.filter(e => typeof e.data === 'number')
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
        const dataToPlot = {};
        if (this.idToPlot === 'All') {
            this.seenIds.forEach((id) => {
                dataToPlot[id] = this.getFilteredPackets(id, 'plottable');
            })
        } else {
            dataToPlot[this.idToPlot] = this.getFilteredPackets(this.idToPlot, this.keyToPlot);
            if (typeof dataToPlot[this.idToPlot][0]["data"] !== 'number') {
                this.openSnackBar(this.lang.monitor.snackBarNoTextPlot, '', 2000);
                return;
            }
        }

        if (this.receivedPackets.length > maxPointsToPlot) { // Protects users form themselves. Plotting too much will make the browser unresponsive
            this.openSnackBar(this.lang.monitor.snackBarTooMuchData, '', 2000);
        } else if (true) {
            let colourIdx = 0;
            const colours = ['#00CED1', '#FF1493', '#FFD700', '#000000']
            this.idsInPlot = this.idToPlot === 'All' ? [...this.seenIds] : [this.idToPlot];
            this.chartOptions.data.datasets = [];
            this.idsInPlot.forEach(id => {
                this.chartOptions.data.datasets.push({
                    label: id,
                    showLine: this.drawLine,
                    data: dataToPlot[id].map(element => ({ x: element.utcTimestamp, y: element.data })),
                    borderColor: colours[colourIdx],
                    fill: false,
                    pointHitRadius: 20,
                })
                colourIdx = colourIdx >= colours.length ? 0 : colourIdx + 1;
            })


            // Tooltips don't work well with live plotting. Disable them if live
            this.chartOptions.options.tooltips.enabled = live ? false : true;
            this.livePlotStarted = live;
            this.chart.update();
        } else {
            this.openSnackBar(this.lang.monitor.snackBarInvalidDataID, '', 2000);
        }

    }
    clearPlot() {
        this.chartOptions.data.datasets.forEach((set) => set.data = []);
        this.chart.update();
    }

    openSnackBar(message: string, action: string, duration: number) {
        this.snackbar.open(message, action, { duration: duration })
    }
}
