import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})

/*
    halfway decent guide/documentaiton here https://developers.google.com/web/fundamentals/codelabs/web-serial/#use_a_transformstream_to_parse_incoming_data
*/
export class SerialService {
    public connected = false;
    private writer;
    private reader;
    private port;
    public packetSubject = new Subject<MircoBitPacket>();
    private transform;
    private inputDone;
    private flushedGarbage = false;
    serialSupported(): boolean {
        // Could and should be navigator.serial, but I got tired of angular cli telling me that "serial does not exist on..."
        return typeof navigator['serial'] !== 'undefined';
    }

    handleData(val, done) {

        if (done) {
            this.reader.releaseLock();
        } else {
            if (this.reader) {
                if (this.flushedGarbage) {
                    this.packetSubject.next(new MircoBitPacket(val));
                }
                this.reader.read().then((valAndDone) => this.handleData(valAndDone.value, valAndDone.done))
                    .catch(err => this.handleReadError(err));
            }
        }
    }

    connect(channel: number) {
        channel = channel < 0 ? 0 : channel;
        channel = channel > 255 ? 255 : channel;
        var options = { // not doing anything. Replace with "nofilter" or proper Jlink/Microbit filter
            filters: [{ vendorId: 0x1366}]
        };
        if (!this.connected) {
            navigator['serial'].requestPort(options).then((p) => {
                this.port = p;
                p.open({ baudrate: 230400 }).then(() => {
                    this.connected = true;
                    this.transform = new TransformStream(new RawPacketTransform());
                    this.inputDone = p.readable.pipeThrough(this.transform);
                    this.reader = this.transform.readable.getReader();
                    this.setChannel(channel);
                    this.reader.read().then((valAndDone) => {this.handleData(valAndDone.value, valAndDone.done)})
                        .catch(err => this.handleReadError(err));
                    /*  This timeout is there to remove old data that exists in some buffer. In essence no data is accepted before 100 ms has elapsed.
                        This is far from ideal, there should be function to flush data before we start reading in the serial API, but I can't find it */
                    setTimeout(() => this.flushedGarbage = true, 100);
                }).catch(err => console.error('Error while opening port:', err));
            }).catch(err => console.error('Error while requesting port:', err));
        }

    }

    handleReadError(err: Error) {
        if (err.name === 'NetworkError') { // Should trigger when user disconnects the receiver
            this.connected = false;
            this.packetSubject = new Subject<MircoBitPacket>();
        }
        console.error('Error while reading from port:', err)
    }

    disconnect() {
        if (this.connected)  {
            this.packetSubject = new Subject<MircoBitPacket>();
            this.reader.cancel().then(() => {
                this.inputDone.cancel().then(() => {
                    this.reader = null;
                    this.port.writable.getWriter().close().then(() => {
                        this.writer = null;
                        this.port.close();
                        this.port = null;
                        this.connected = false;
                    })

                })

            })
        }
    }

    setChannel(channel: number) {
        channel = channel < 0 ? 0 : channel;
        channel = channel > 255 ? 255 : channel;
        if (this.connected) {
            this.writer = this.port.writable.getWriter();
            this.writer.write(new Uint8Array([channel]));
            this.writer.releaseLock();
        }
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
        this.rawHex = rawData.slice(0, rawData.length-1).map(e => toPaddedHexString(e, 2)).join(''); // removes RSSI and creates string
        this.rssi = rawData[rawData.length-1] * -1;
        this.microBitId = this.rawHex.slice(16, 24);
        this.timestamp = convertTypedArray(new Uint8Array(rawData.slice(4, 8)), Uint32Array)[0];
        this.data = {};
        // rawData[3] contains a number specifying the type of the packet
        switch(rawData[3]) {
            case 0: // int32
                this.key = 'Data';
                this.data[this.key] = convertTypedArray(new Uint8Array(rawData.slice(12, 12 + 4)), Int32Array)[0];
                break;
            case 1: // "key" = int32. Key length specified in rawData[16]
                this.key = 'Data_' + rawData.slice(17, 17 + rawData[16]).map(e => String.fromCharCode(e)).join('');
                var val = convertTypedArray(new Uint8Array(rawData.slice(12, 12 + 4)), Int32Array)[0];
                this.data[this.key] = val;
                break;
            case 2: // string, length specified in rawData[12]
                this.key = 'Data';
                this.data[this.key] = rawData.slice(13, 13 + rawData[12]).map(e => String.fromCharCode(e)).join('');
                break;
            case 3: // never seen it :/ Probably supposed to be "key"=string, but that is not available in makecode
                this.key = 'Data';
                this.data = -1;
                break;
            case 4: // double
                this.key = 'Data';
                this.data[this.key] = convertTypedArray(new Uint8Array(rawData.slice(12, 12 + 8)), Float64Array)[0];
                break;
            case 5: // "key"=double. Key length specified in rawData[20]
                this.key = 'Data_' + rawData.slice(21, 21 + rawData[20]).map(e => String.fromCharCode(e)).join('');
                var val = convertTypedArray(new Uint8Array(rawData.slice(12, 12 + 8)), Float64Array)[0];
                this.data[this.key] = val;
                break;
            default:
                this.key = 'Data';
                this.data = -1;
                break;
        }
    }
    public rawHex: string;
    public timestamp: number; // milliseconds since microbit started
    public data: any;
    public microBitId: string;
    public rssi: number;
    public key;
}


/* Takes in a stream of uint8_t, handles linebreaks, and outputs number arrays of correct length. 
*/
class RawPacketTransform {
    container;
    parseRawData(raw: number[]): number[] {
        const newArray = [];
        let low = 0;
        let high = 0;
        for (let i = 0; i < raw.length; i += 2) {
            high = raw[i] >= 65 ? raw[i] - 55 : raw[i] - 48;  // 65 is ASCII code for 'A', 48 for '0'
            low = raw[i + 1] >= 65 ? raw[i + 1] - 55 : raw[i + 1] - 48;
            newArray.push(high * 16 + low);
        }
        return newArray;
    }

    start() {
        this.container = [];
    }

    async transform(chunk, controller) {
        this.container = this.container.concat(Array.prototype.slice.call(chunk));
        let idx = this.container.indexOf(10);
        if (idx !== -1) {
            let leftOver = this.container.splice(idx);
            leftOver.shift(); // remove the newline
            if (this.container.length === 72) { // Crude check of validity. Microbit sends 35 bytes, I added rssi at the end. Receiver prints every byte as two characters -> 72
                controller.enqueue(this.parseRawData(this.container));
            }
            this.container = leftOver;
        }

    }
    flush(controller) {
        controller.enqueue(this.container);
    }
}
