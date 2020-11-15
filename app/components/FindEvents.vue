<template>
<Page class="page">
    <ActionBar class="action-bar">
        <Label text="Find Events" />
    </ActionBar>
    <StackLayout>
        <EventList :events="events" :hidePrivate="true"/>
    </StackLayout>
</Page>
</template>

<script>
import EventDetails from './EventDetails';
import EventList from './custom/EventList';

import * as OCApi from '../src/ocApi.js';

export default {
data() {
    return {
        events: []
    }
},
props: {
    settings: {},
    student: {}
},
mounted() {
    console.log("Mounting FindEvents")
    
    // load list of events from internal storage
    // check for updates
    // update 
    OCApi.getEvents({
        username: this.settings.username,
        token: this.settings.token_oc
    })
    .then((e) => {
        let now = Date.now();
        e = e.filter((ev) => {
            return ev.event_end > now;
        });

        this.events = e;
    })
    .catch((err) => {
        console.log("Error while getting events: ", err);
    })
},
methods: {

},
components: {
    EventList
}
}
</script>