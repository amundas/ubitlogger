import {LanguageInterface} from './languageInterface'

export const language: LanguageInterface = {
    app: {
        title: "micro:bit logger",
        menuMonitor: 'Monitor',
        menuFindId: 'Finn ID',
        menuExample: 'Eksempel',
        menuSetup: 'Mottakeroppsett',
        menuInfo: 'Om denne siden'
    },
    monitor: {
        csvKeys: {
            id: 'microbitID',
            timestamp: 'Tid',
            rssi: 'Signalstyrke',
            rawData: 'Rådata',
        },
        all: 'Alle',
        snackBarTooMuchData: 'For mye data for å plotte',
        snackBarInvalidDataID: 'Kombinasjonen av ID og datatype har ingen data',
        snackBarRealtimeStopped: 'Stoppet sanntidsplott, for mye data',
        snackBarRealtimeStoppedAction: 'ok',
        snackBarNoTextPlot: 'Plotting av tekst støttes ikke',
        cardLogging: 'Logging av data',
        cardDownload: 'Last ned data',
        cardPlot: 'Plotting av data',
        radioGroup: 'Radiogruppe',
        receivedCount: 'Motatte meldinger',
        lastMessage: 'Forrige melding',
        timestamp: 'Tidsstempel',
        messageContent: 'Data',
        rssi: 'Signalstyrke',
        id: 'micro:bit-ID',
        buttonConnect: 'Koble til',
        buttonDisconnect: 'Koble fra',
        buttonClearData: 'Slett data',
        includeRaw: 'Inkluder rådata',
        includeRssi: 'Inkluder signalstyrke',
        buttonSave: 'Lagre fil',
        idToPlot: 'micro:bit-ID',
        keyToPlot: 'Data',
        drawLine: 'Trekk linjer',
        buttonPlot: 'Plott',
        buttonLivePlot: 'Plott i sanntid',
        buttonLiveStop: 'Stopp sanntid',
        unsupportedTitle: 'Ikke støttet',
        unsupportedExplanation: `Denne nettleseren støtter ikke kommunikasjon med serielle porter.
        Nye versjoner av Chrome skal fungere, men det kan hende at du må skru på denne funksjonaliteten
        ved å lime inn dette i adressefeltet:`,
    },
    identify: {
        findId: 'Finn ID til en micro:bit',
        radioGroup: 'Radiogruppe',
        stopFirst: 'Stopp på første',
        foundId: 'ID',
        buttonConnect: 'Koble til',
        buttonDisconnect: 'Koble fra',
        buttonScan: 'Søk',
        buttonStopScan: 'Stopp',
    },
    setup: {
        receiverSetup: 'Mottakeroppsett',
        text1: 'For å bruke dette verktøyet må man ha en mottaker koblet til datamaskinen. Selve mottakeren kan være en micro:bit, en ',
        text2: ', en ',
        text3: ' eller et ',
        text4: 'Mottakeren må programmeres, Dette gjøres ved å laste ned rett fil under, for så å programmere den på samme måte som en micro:bit.',
        receiver: 'Mottaker',
        buttonDownload: 'Last ned',
    },
    example: {
        title: 'Eksempel: Måling av akselerasjon',
        text1: `I dette eksempelet vil vi måle akselerasjonen til en micro:bit.
        For å bruke dette verktøyet må en mottaker være koblet koblet til PCen. Dersom du ikke har gjort dette klart, gå til "mottakeroppsett" i menyen for å konfigurere en mottaker.`,
        text2: `Koden under får en micro:bit til å sende akselerasjonen in x-reting 1000 ganger med 20 millisekunders mellomrom. Merk at vi har spesifisert at micro:biten skal sende serienummeret sitt, dersom dette ikke blir gjort kan vi ikke skille på data mottatt fra forskjellige micro:bit.`,
        text3: `For å koble til mottakeren trykker vi på "koble til", da vil en liste med tilgjengelige enheter dukke opp. Dersom du bruker en micro:bit som mottaker vil den hete "BBC_micro:bit" eller "USB Serial Device", 
        avhengig av operativsystemet ditt. Dersom du bruker en av de andre alternativene som mottaker, vil navnet inneholde "J-Link". 
        Velg rett enhet, og trykk videre.`,
        text4: `Siden vi i koden over valgte å sende på radiogruppe 10, må vi velge den samme radiogruppen i dette verktøyet.
        Nå er vi klar for å motta data. Når knappen merket "A" på micro:biten trykkes begynner den å sende data, og det skal dukke opp i dette verktøyet.
        Vi kan plotte data direkte i dette verktøyet. Grafen under viser resulterende data etter at micro:biten ble rotert sakte mens den sendte data.
        Mottatt data kan også lastes ned i csv-format, disse filene kan importeres direkte i regneark for videre behandling.`,
    }

}