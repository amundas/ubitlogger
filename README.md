# uBitlogger

This is a project created by the IoT-lab at the [Department of Electronic Systems](https://www.ntnu.edu/ies) at NTNU. The intention of this project is to create an easy to use piece of software to interface BBC micro:bits.

The tool is hosted at [ubitlogger.com](https://en.ubitlogger.com/)

## Working principle
This project consists of two parts. Firmware for receivers, and a web page that collects and displays data. A number of devices (including the micro:bit) can be used as reveicers. These receivers will receive data from a micro:bit when it sends data with the "radio"-protocol (i.e not BLE). The reveiver then sends the received packet to the user's PC over UART, and the web page uses [webSerial](https://wicg.github.io/serial/) to read the packets. webSerial is currently only supported by Chromium.
