export interface LanguageInterface {
    app: {
        title: string,
        menuMonitor: string,
        menuFindId: string,
        menuExample: string,
        menuSetup: string,
        menuInfo: string
    },
    monitor: {
        csvKeys: {
            id: string,
            timestamp: string,
            rssi: string,
            rawData: string,
        },
        all: string,
        snackBarTooMuchData: string,
        snackBarInvalidDataID: string,
        snackBarRealtimeStopped: string,
        snackBarRealtimeStoppedAction: string,
        snackBarNoTextPlot: string,
        cardLogging: string,
        cardDownload: string,
        cardPlot: string,
        radioGroup: string,
        receivedCount: string,
        lastMessage: string,
        timestamp: string,
        messageContent: string,
        rssi: string,
        id: string,
        buttonConnect: string,
        buttonDisconnect: string,
        buttonClearData: string,
        includeRaw: string,
        includeRssi: string,
        buttonSave: string,
        idToPlot: string,
        keyToPlot: string,
        drawLine: string,
        buttonPlot: string,
        buttonLivePlot: string,
        buttonLiveStop: string,
        unsupportedTitle: string,
        unsupportedExplanation: string,
    },
    identify: {
        findId: string,
        radioGroup: string,
        stopFirst: string,
        foundId: string,
        buttonConnect: string,
        buttonDisconnect: string,
        buttonScan: string,
        buttonStopScan: string,
    }
    setup: {
        receiverSetup: string,
        text1: string,
        text2: string,
        text3: string,
        text4: string,
        receiver: string,
        buttonDownload: string,
    },
    example: {
        title: string,
        text1: string,
        text2: string,
        text3: string,
        text4: string,
    },
    info: {
        card1Title: string,
        card1Title2: string,
        card1Text1: string,
        card1Title3: string,
        card1Text2: string,
        card2Title: string,
        card2Title2: string,
        card2Text1: string,
        card2Title3: string,
        card2Text2: string,
        card2Title4: string,
        card2Text3: string,
        card3Title: string,
        card3Text1: string,
        card3Text2: string,
        here: string,
    }
}
