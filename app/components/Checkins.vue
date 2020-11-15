<template>
<Page class="page">
    <ActionBar class="action-bar">
        <Label text="My Checkins" />
    </ActionBar>
    <StackLayout>
        <EventList :events="events"/>
    </StackLayout>
</Page>
</template>

<script>
import EventDetails from './EventDetails';
import EventList from "./custom/EventList";

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
    console.log("Mounting Checkins");
    let tempEvents;

    let eventPromise = OCApi.getEvents({
        username: this.settings.username,
        token: this.settings.token_oc
    })
    .then((e) => {
        tempEvents = e;
    })
    .catch((err) => {
        console.log("Error while getting events: ", err);
    });

    // Get checkins
    OCApi.getCheckins({
        username: this.settings.username,
        token: this.settings.token_oc
    })
    .then(async (checkins) => {
        console.log("Awaiting events...");
        await eventPromise;

        // Filter events
        let newEvents = [];
        checkins.forEach((c) => {
            let t = tempEvents.find((e) => {
                return e.event_id == c.checkin_event_id
            })
            if (t != undefined) {
                t.checkin_id = c.checkin_id;
                t.checkin_event_id = c.checkin_event_id;
                t.checkin_time = c.checkin_time;
                t.checkin_type = c.checkin_type;
                newEvents.push(t);
            }
        });

        // Sort events by event time, not checkin time
        newEvents.sort((a,b) => {
            return b.event_start - a.event_start; // latest first
        });
        this.events = newEvents;
    })
    .catch((err) => {
        console.log("Error while getting checkins: ", err);
    });
},
methods: {
    
},
components: {
    EventList
}
}
</script>