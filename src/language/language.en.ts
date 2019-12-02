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
    },
    example: {
        title: 'Example: Measuring acceleration',
        text1: `In this example we will measure the acceleration of a micro:bit.
        This tool requires that a device that can receive micro:bit messages is configured and connected to the PC. If you have not done that already, go to "receiver setup" in the menu and program the receiver.`,
        text2: `We program a micro:bit with the code shown below. This code makes the micro:bit send acceleration data 1000 times, with about 20 milliseconds between each packet. Note that we have specified that the micro:bit should send it's serial number. If we don't do this, the serial number is set to all zeros, and we can't tell different micro:bits apart.`,
        text3: `After clicking the connect button, you should see a list of connected devices. 
        If you are using a micro:bit as the receiver it will be called "BBC_micro:bit" or "USB Serial Device", depending on your operating system. If you are using one of the other options the name will include "J-link".
        Select the correct input and continue.`,
        text4: `Since we programmed the micro:bit to use radio group 10, we need to select the same radio group on top of the monitor page.
        Now the tool is ready to receive messages from the micro:bit. When the "A" button is pressed, the data should start coming in.
        The received data can be plotted directly in the tool. The graph below is the result of rotating the micro:bit slowly while it was sending data.
        The received data can also be downloaded in csv format, which can be directly imported into a number of programs like Excel and Google Sheets.`,
    }
}