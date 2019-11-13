import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SerialService {
    public connected = false;
    private writer;
    private reader;
    private port;
    private pkt = [];
    public packetSubject = new Subject<MircoBitPacket>();

    serialSupported(): boolean {
        // Could and should be navigator.serial, but I got tired of angular cli telling me that "serial does not exist on..."
        return typeof navigator['serial'] !== 'undefined';
    }

    handleData(val, done) {
        this.pkt = this.pkt.concat(Array.prototype.slice.call(val));
        // Check if we received "\n" (ASCII 10)
        let idx = this.pkt.indexOf(10)
        if (idx !== -1) {
            let leftOver = this.pkt.splice(idx);
            leftOver.shift(); // remove the newline

            if (this.pkt.length === 72) { // Crude check of validity. Microbit sends 35 bytes, I added rssi at the end. Receiver prints every byte as two characters -> 72
                this.packetSubject.next(new MircoBitPacket(this.parseRawData(this.pkt)));      
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

    connect(channel: number) {
        channel = channel < 0 ? 0 : channel;
        channel = channel > 255 ? 255 : channel;
        var options = { // not doing anything. Replace with "nofilter" or proper nrf52 filter
            filters: [{ vendorId: 0x1366}]
        };
        if (!this.connected) {
            navigator['serial'].requestPort(options).then((p) => {
                this.port = p;
                p.open({ baudrate: 230400 }).then(() => {
                    this.connected = true;
                    this.reader = p.readable.getReader();
                    this.writer = p.writable.getWriter();
                    this.writer.write(new Uint8Array([channel])).catch(err => console.error('error while writing to port'));
                    this.reader.read().then((valAndDone) => {this.handleData(valAndDone.value, valAndDone.done)})
                    .catch(err => console.error('error while reading from port'));

                }).catch(err => console.error('error while opening port'));
            }).catch(err => console.error('error while requesting port'));
        }
        
    }
    disconnect() {
        if (this.connected) {
            this.port.close();
        }
        this.reader = null;
        this.writer = null;
        this.connected = false;
    }

    setChannel(channel: number) {
        channel = channel < 0 ? 0 : channel;
        channel = channel > 255 ? 255 : channel;
        if (this.connected) {
            this.writer.write(new Uint8Array([channel]));
        }
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
    getString(array: number[], start: number, end: number) {
        array.slice(start, end).map(e => String.fromCharCode(e)).join('');
    }


}

function convertTypedArray(src, type) {
    return new type(src.buffer);
}
function toPaddedHexString(num, len) {
    let str = num.toString(16);
    return "0".repeat(len - str.length) + str;
}

export class MircoBitPacket {
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