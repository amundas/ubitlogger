import {LanguageInterface} from './languageInterface'

export const language: LanguageInterface = {
    app: {
        title: "micro:bit logger",
        menuMonitor: 'Monitor',
        menuFindId: 'Find ID',
        menuExample: 'Example',
        menuSetup: 'Receiver setup',
        menuInfo: 'About this page'
    },
    monitor: {
        csvKeys: {
            id: 'microbitID',
            timestamp: 'Time',
            rssi: 'Signal strength',
            rawData: 'Raw data',
        },
        all: 'All',
        snackBarTooMuchData: 'Too much data to plot',
        snackBarInvalidDataID: 'The combination of ID and datatype has no registered data',
        snackBarRealtimeStopped: 'Stopped real time plot, too much data',
        snackBarRealtimeStoppedAction: 'ok',
        snackBarNoTextPlot: 'Plotting of text is not supported',
        cardLogging: 'Receive data',
        cardDownload: 'Download data',
        cardPlot: 'Plot data',
        radioGroup: 'Radio group',
        receivedCount: 'Received messages',
        lastMessage: 'Previous message',
        timestamp: 'Timestamp',
        messageContent: 'Data',
        rssi: 'Signal strength',
        id: 'micro:bit-ID',
        buttonConnect: 'Connect',
        buttonDisconnect: 'Disconnect',
        buttonClearData: 'Clear data',
        includeRaw: 'Include raw data',
        includeRssi: 'Include signal strength',
        buttonSave: 'Save file',
        idToPlot: 'micro:bit-ID',
        keyToPlot: 'Data',
        drawLine: 'Draw lines',
        buttonPlot: 'Plot',
        buttonLivePlot: 'Plot in real time',
        buttonLiveStop: 'Stop real time plot',
    },
    identify: {
        findId: 'Find the ID of a micro:bit',
        radioGroup: 'Radio group',
        stopFirst: 'Stop at first',
        foundId: 'ID',
        buttonConnect: 'Connect',
        buttonDisconnect: 'Disconnect',
        buttonScan: 'Scan',
        buttonStopScan: 'Stop',
    },
    setup: {
        receiverSetup: 'Prepare a receiver',
        text1: 'In order to use this tool, you will need a receiver connected to your computer. The receiver could be a micro:bit, a ',
        text2: ', a ',
        text3: ' or a ',
        text4: 'The receiver needs to be programmed with the correct code. This is done by downloading the file corresponding to your receiver below, and then programming your receiver in the same way that you would program your micro:bit.',
        receiver: 'Receiver',
        buttonDownload: 'Download',
    }
}