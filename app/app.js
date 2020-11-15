import Vue from "nativescript-vue";

import Main from "./components/Main";

new Vue({
    render: h => h('frame', [h(Main)]),
}).$start();