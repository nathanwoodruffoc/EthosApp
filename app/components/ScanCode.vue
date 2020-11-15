<template>
<Page class="page">
    <StackLayout>
        <BarcodeScanner
            row="1"
            height="300"
            formats="QR_CODE"
            beepOnScan="true"
            reportDuplicates="true"
            preferFrontCamera="false"
            :pause="pause"
            @scanResult="onScanResult"
            v-if="isIOS">
        </BarcodeScanner>
    </StackLayout>
</Page>
</template>

<script>
import Vue from 'nativescript-vue'
Vue.registerElement('BarcodeScanner', () => require('nativescript-barcodescanner').BarcodeScannerView)
var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;


import Home from './Home';
import EventDetails from './EventDetails';

export default {
mounted() {
    var barcodescanner = new BarcodeScanner();
    barcodescanner.scan({
        formats: "QR_CODE",   // Pass in of you want to restrict scanning to certain types
        //cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
        //cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
        //message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
        //showFlipCameraButton: true,   // default false
        preferFrontCamera: false,     // default false
        //showTorchButton: true,        // default false
        beepOnScan: false,             // Play or Suppress beep on scan (default true)
        fullScreen: true,             // Currently only used on iOS; with iOS 13 modals are no longer shown fullScreen by default, which may be actually preferred. But to use the old fullScreen appearance, set this to 'true'. Default 'false'.
        //torchOn: false,               // launch with the flashlight on (default false)
        closeCallback: this.close, // invoked when the scanner was closed (success or abort)
        resultDisplayDuration: 0,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
        orientation: "portrait",     // Android only, optionally lock the orientation to either "portrait" or "landscape"
        openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
    }).then((result) => this.success(result), (error) => this.error(error)
    );
},
props: {
    settings: {},
    student: {}
},
methods: {
    navigate(Location) {
        console.log("Navigating ScanCode -> ", Location.__file)
        this.$navigateTo(Location, {
            props: {
                settings: this.settings,
                student: this.student
            }
        });
    },
    success(result) {
        console.log("Scan format: " + result.format);
        console.log("Scan text:   " + result.text);
        this.navigate(Home);
    },
    error(error) {
        console.log("Scan Error: " + error);
    },
    close() {
        console.log("Scanner closed");
        this.navigate(Home);
    }

}
}
</script>