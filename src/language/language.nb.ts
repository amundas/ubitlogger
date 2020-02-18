import {LanguageInterface} from './languageInterface'

export const language: LanguageInterface = {
    app: {
        title: "micro:bit logger",
        menuMonitor: 'Monitor',
        menuFindId: 'Finn ID',
        menuExample: 'Eksempel',
        menuSetup: 'Mottakeroppsett',
        menuInfo: 'Hjelp og informasjon'
    },
    monitor: {
        csvKeys: {
            id: 'microbitID',
            timestamp: 'Tid',
            rssi: 'Signalstyrke',
            rawData: 'Rådata',
            utcTimestamp: 'Epochtid'
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
        receivedCount: 'Mottatte meldinger',
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
        unsupportedTitle: 'En instilling i nettleseren må endres',
        unsupportedExplanation: `Denne nettleseren støtter ikke kommunikasjon med serielle porter.
        Nye versjoner av Chrome, eller Chromium-baserte nettlesere fungerer. Det kan hende at du må skru på denne funksjonaliteten
        ved å lime inn dette i adressefeltet og velge "enabled":`,
    },
    identify: {
        findId: 'Finn IDen til en micro:bit',
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
        text5: 'Dersom du bruker en nRF52 dongle som mottaker, må den programmeres på en litt annerledes måte: Last ned',
        text6: ', start programmet og velg "Programmer". Sett donglen i PCen og trykk på reset-knappen dens, skriv så hex-filen til donglen. Etter å ha koblet donglen fra og til igjen, skal den kunne oppdages som "uBit Receiver".',
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
        titlePython: 'MicroPython eksempel',
        text1Python: 'Ett eksempel for MicroPython finnes',
        here: 'her',
        text2Python: 'Dette eksempelet blinker en tilfeldig LED og sender akselerometerdata.',
    },
    info: {
        card1Title: 'Feilsøking',
        card1Title2: 'Kan ikke koble til en micro:bit konfigurert som mottaker',
        card1Text1: 'Dette kan bety at firmwaren til micro:biten må oppdateres. Denne siden forklarer hvordan det gjøres: ',
        card1Title3: 'Kun et fåtall av sendte meldinger blir mottatt',
        card1Text2: `Det er normalt at noen få prosent av meldingene ikke kommer fram. Dersom du opplever at mange meldinger forsvinner kan det være at meldingene blir sendt for raskt, uten pause mellom hver melding. Det kan også være at micro:biten er utenfor rekkevidden til mottakeren`,
        card2Title: 'Meldingsformat',
        card2Title2: 'Tidsstempel',
        card2Text1: 'Tidsstempelet viser antall millisekunder siden en micro:bit ble skrudd på. I nedlastede .csv-filer vil du også finne Epoch-tid, som er tiden rapportert av PCen din da meldingen ble mottatt.',
        card2Title3: 'Signalstyrke',
        card2Text2: 'Signalstyrken er RSSI (Received Signal Strength Indicator) rapportert av mottakeren. Denne verdien ligger normalt mellom -40 og -100, lavere verdier betyr dårligere signalstyrke. Denne verdien kan til en viss grad bli brukt til å estimere avstand mellom sender og mottaker, mer informasjon om dette finnes ',
        card2Title4: 'Rådata',
        card2Text3: 'Rådata kan lastes ned som som en rekke heksadesimale tall som inneholder all data som ble sendt. Mer informasjon om formatet finnes i kildekoden til dette prosjektet, og ',
        card3Title: 'Om dette prosjektet',
        card3Text1: 'Dette prosjektet er laget av IoT-laben på NTNU. Formålet er å tilby et nyttig verktøy i undervisning. Kildekoden til prosjektet er tilgjengelig ',
        card3Text2: 'lisensiert under XX lisensen. Spørsmål kan sendes til ',
        here: 'her',
    }
}