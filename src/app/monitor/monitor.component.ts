import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {
    reader;
    writer;
    lastMessage: MircoBitPacket;
    pkt = [];
    supportsSerial = true;
    receivedPackets:MircoBitPacket[] = []
    messageCount = 0;
    channel = 0;
    includeRawhex = false;
    connected = false;
    port;
    selectedId = 'Alle';
    seenIds: string[] = ['Alle'];
    seenKeys: string[] = [];

    ngOnInit() {
       if (!navigator['serial']) {
            this.supportsSerial = false;
       }
    }

    toggleConnection() {
        var options = { // not doing anything. Replace with "nofilter" or proper nrf52 filter
        filters: [{ vendorId: 0x1366}]
        };
        // Could and should be navigator.serial, but I got tired of angular cli telling me that "serial does not exist on..."
        if (!this.connected) {
            navigator['serial'].requestPort(options).then((p) => {
                this.port = p;
                p.open({ baudrate: 230400 }).then(() => {
                    this.connected = true;
                    this.reader = p.readable.getReader();
                    this.writer = p.writable.getWriter();
                    this.writer.write(new Uint8Array([this.channel])).catch(err => console.error('error while writing to port'));
                    this.reader.read().then((valAndDone) => this.handleData(valAndDone.value, valAndDone.done))
                    .catch(err => console.error('error while reading from port'));
    
                }).catch(err => console.error('error while opening port'));
            }).catch(err => console.error('error while requesting port'));
        } else {
            this.port.close();
            this.reader = null;
            this.writer = null;
            this.connected = false;
        }
        

    }

    handleData(val, done) {
        this.pkt = this.pkt.concat(Array.prototype.slice.call(val));
        // Check if we received "\n" (ASCII 10)
        let idx = this.pkt.indexOf(10)
        if (idx !== -1) {
            let leftOver = this.pkt.splice(idx);
            leftOver.shift(); // remove the newline

            if (this.pkt.length === 72) { // Crude check of validity. Microbit sends 35 bytes, I added rssi at the end. Receiver prints every byte as two characters -> 72
                this.lastMessage = new MircoBitPacket(this.parseRawData(this.pkt));
                if (this.seenKeys.indexOf(this.lastMessage.key) == -1) {
                    this.seenKeys.push(this.lastMessage.key);
                }
                this.receivedPackets.push(this.lastMessage);
                this.messageCount ++;
                if (this.seenIds.indexOf(this.lastMessage.microBitId) === -1) {
                    this.seenIds.push(this.lastMessage.microBitId);
                }
            } else {
                console.error('Received invalid packet');
            }
            this.pkt = leftOver;
        }
        if (this.reader) {
            this.reader.read().then((valAndDone) => this.handleData(valAndDone.value, valAndDone.done))
            .catch(err => console.error('error while reading from port'));
        }
    }

    getString(array: number[], start: number, end: number) {
        array.slice(start, end).map(e => String.fromCharCode(e)).join('');
    }

    parseRawData(raw: number[]): number[] {
        const newArray = [];
        let low = 0;
        let high = 0;
        for (let i = 0; i < raw.length; i+=2) {
            high = raw[i] >= 65 ? raw[i] - 55 : raw[i] - 48;  // 65 is ASCII code for 'A', 48 for '0'
            low  = raw[i+1] >= 65 ? raw[i+1] - 55 : raw[i+1] - 48;
            newArray.push(high * 16 + low);
        }
        return newArray;
    }

    saveFile() {
        const date = new Date();
        const filename = `data_${("0" + date.getHours()).slice(-2)}${("0" + date.getMinutes()).slice(-2)}.csv`
        const filteredPackets = this.selectedId === 'Alle' ? this.receivedPackets : this.receivedPackets.filter(e => e.microBitId === this.selectedId);
        let keys ='microbitID,Time,Type';
        this.seenKeys.forEach(key => {
            keys += `,${key}`;
        });
        keys += `,RSSI${this.includeRawhex ? ',RawHex' : ''}\n`;
        saveAs(new Blob([keys, 
        filteredPackets.map(e => {
            let rowString =   `${e.microBitId},${e.timestamp},${e.type}`;
            this.seenKeys.forEach(key => {
                rowString += `,${e.data[key] ? e.data[key] : ''}`;
            });
            rowString += `,${e.rssi}${this.includeRawhex ? ',' + e.rawHex : ''}\n`;
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
        if (this.connected) {
            this.writer.write(new Uint8Array([this.channel]));
        }
    }
}


function convertTypedArray(src, type) {
    return new type(src.buffer);
}
function toPaddedHexString(num, len) {
    let str = num.toString(16);
    return "0".repeat(len - str.length) + str;
}

class MircoBitPacket {
    constructor (rawData: number[]) {
        this.rawHex = rawData.slice(0, rawData.length-1).map(e => toPaddedHexString(e, 2)).join('');
        this.rssi = rawData[rawData.length-1] * -1;
        this.microBitId = this.rawHex.slice(16, 24);
        this.timestamp = convertTypedArray(new Uint8Array(rawData.slice(4, 8)), Uint32Array)[0];
        this.type = rawData[3];
        this.data = {};

        switch(rawData[3]) {
            case 0: // int
                this.key = 'Data';
                this.data[this.key] = convertTypedArray(new Uint8Array(rawData.slice(12, 12 + 4)), Int32Array)[0];
                break;
            case 1: // "key" = int
                this.key = 'Data_' + rawData.slice(17, 17 + rawData[16]).map(e => String.fromCharCode(e)).join('');
                var val = convertTypedArray(new Uint8Array(rawData.slice(12, 12 + 4)), Int32Array)[0];
                this.data[this.key] = val;
                break;
            case 2: // string
                this.key = 'Data';
                this.data[this.key] = rawData.slice(13, 13 + rawData[12]).map(e => String.fromCharCode(e)).join('');
                break;
            case 3: // never seen it :/ Probably supposed to be "key"=string, but that is not available in makecode
                this.data = -1;
                break;
            case 4: // double
                this.key = 'Data';
                this.data[this.key] = convertTypedArray(new Uint8Array(rawData.slice(12, 12 + 8)), Float64Array)[0];
                break;
            case 5: // "key"=double
                this.key = 'Data_' + rawData.slice(21, 21 + rawData[20]).map(e => String.fromCharCode(e)).join('');
                var val = convertTypedArray(new Uint8Array(rawData.slice(12, 12 + 8)), Float64Array)[0];
                this.data[this.key] = val;
                break;
            default:
                break;
        }
    }
    public rawHex: string;
    public type: number;
    public timestamp: number; // milliseconds since microbit started
    public data: any;
    public microBitId: string;
    public rssi: number;
    public key;
}