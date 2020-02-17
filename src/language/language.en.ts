import {LanguageInterface} from './languageInterface'

export const language: LanguageInterface = {
    app: {
        title: "micro:bit logger",
        menuMonitor: 'Monitor',
        menuFindId: 'Find ID',
        menuExample: 'Example',
        menuSetup: 'Receiver setup',
        menuInfo: 'Help and information'
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
        snackBarInvalidDataID: 'The combination of ID and data type has no registered data',
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
        unsupportedTitle: 'Functionality needs to be enabled',
        unsupportedExplanation: `This browser either has no support for reading serial ports, or this is not enabled.
        Newer versions of Chrome, or Chromium based browsers support this feature. You might have to enable the feature by
        entering this in your address bar and select "enabled":`,
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
        text5: 'If you are using an nRF52 dongle as a receiver, it needs to be programmed in a slightly different way: Download',
        text6: ', start the program and select the programmer tool. Plug inn the dongle and press its reset button, then write the hex file to the dongle. After reconnecting the dongle, it should be discoverable as "uBit Receiver" on the monitor page.',
        receiver: 'Receiver',
        buttonDownload: 'Download',
    },
    example: {
        title: 'Example: Measuring acceleration',
        text1: `In this example we will measure the acceleration of a micro:bit.
        This tool requires that a device that can receive micro:bit messages is configured and connected to the PC. If you have not done that already, go to "receiver setup" in the menu and program the receiver.`,
        text2: `We program a micro:bit with the code shown below. This code makes the micro:bit send acceleration data 1000 times, with about 20 milliseconds between each packet. Note that we have specified that the micro:bit should send its serial number. If we don't do this, the serial number is set to all zeros, and we can't tell different micro:bits apart.`,
        text3: `After clicking the connect button, you should see a list of connected devices. 
        If you are using a micro:bit as the receiver it will be called "BBC_micro:bit" or "USB Serial Device", depending on your operating system. If you are using one of the other options the name will include "J-link".
        Select the correct input and continue.`,
        text4: `Since we programmed the micro:bit to use radio group 10, we need to select the same radio group on top of the monitor page.
        Now the tool is ready to receive messages from the micro:bit. When the "A" button is pressed, the data should start coming in.
        The received data can be plotted directly in the tool. The graph below is the result of rotating the micro:bit slowly while it was sending data.
        The received data can also be downloaded in csv format, which can be directly imported into a number of programs like Excel and Google Sheets.`,
        titlePython: 'MicroPython example',
        text1Python: 'A MicroPython example can be found',
        here: 'here',
        text2Python: 'This example flashes a random LED and sends accelerometer data.',

    },
    info: {
        card1Title: 'Troubleshooting',
        card1Title2: 'Unable to connect to a micro:bit configured as a receiver',
        card1Text1: 'This can mean that the firmware of your micro:bit needs to be updated. Use this guide to upgrade: ',
        card1Title3: 'Only a fraction of the sent messages are received',
        card1Text2: `It is normal that a few percent of the messages sent by the micro:bit is lost. If you are experiencing many lost messages it can mean that you are sending too fast (e.g no delay between sent messages), or that the micro:bit is out of the receiver's range`,
        card2Title: 'Message format',
        card2Title2: 'Timestamp',
        card2Text1: 'The timestamp represents the time in milliseconds since the micro:bit was powered on.',
        card2Title3: 'Signal strength',
        card2Text2: 'The signal strength is the so called RSSI (Received Signal Strength Indicator) reported by the receiver. This will normally be a negative value between -40 and -100. More negative values means lower signal strength. Apart from being useful to check the signal strength, this value can to some extent be used for estimating the distance between the receiver and the transmitter. A starting point for distance measuring can be found',
        card2Title4: 'Raw data',
        card2Text3: 'The raw data can be downloaded as a series of hexadecimal numbers, this contains all the data sent by the transmitter. More information of the format can be found in the source code of this project, and ',
        card3Title: 'About this project',
        card3Text1: 'This project is created by the IoT-lab at the Norwegian University of Science and Technology. It is intended as a helpful tool for educational purposes. The source code is available at ',
        card3Text2: 'licencsed under the XX license. Inquiries can be sent to ',
        here: 'here',
    }
}