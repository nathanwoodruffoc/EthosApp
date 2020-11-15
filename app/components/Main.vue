<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <Label text=""></Label>
        </ActionBar>
        <StackLayout>
        </StackLayout>
    </Page>
</template>

<script>
import Home from "./Home";
import LoginPage from "./LoginPage";

import * as OCApi from '../src/ocApi.js';
import * as Settings from '../src/settings.js';

const FS = require("tns-core-modules/file-system");

export default {
data() {
    return {
        settings: {}
    }
},
mounted() {
    Settings.get()
    .then((settings) => {
        this.settings = settings;

        let token = (settings.useCustomApi ? settings.token_custom : settings.token_oc);
        //console.log("Token from settings: ", token);

        // Check if user is logged in and redirect to either Home or LoginPage
        if (token != "" && token != undefined) {
            OCApi.validateLogin({
                username: settings.username,
                token: settings.token_oc
            }).then(() => {
                console.log("resolved");
                this.navigateWithState(Home);
            }).catch((err) => {
                console.log(err);
                this.navigateWithState(LoginPage);
            });
        } else {
            //setTimeout(() => this.navigateWithState(LoginPage), 3000);
            this.navigateWithState(LoginPage);
        }
    })
    
    // Debug: List folder contents
    // let folder = FS.knownFolders.temp();
    // //folder = FS.Folder.fromPath("/data/user/0/org.nativescript.EthosApp/");
    // //folder = FS.Folder.fromPath(FS.path.join(folder.path, "code_cache"));
    // console.log(folder.path);
    // folder.getEntities()
    //     .then((entities) => {
    //         // entities is array with the document's files and folders.
    //         entities.forEach((entity) => {
    //             console.log(entity)
    //         });
    //     }).catch((err) => {
    //         // Failed to obtain folder's contents.
    //         console.log(err.stack);
    //     });
},
methods: {
    navigateWithState(Location) {
        console.log("Navigating Main -> ", Location.__file)
        this.$navigateTo(Location, {
            clearHistory: true,
            props: {
                settings: this.settings,
                student: undefined
            }
        });
    }
}
}
</script>