<template>
<ListView for="item in listItems" @itemTap="openEvent" height="100%">
    <v-template>
        <DockLayout stretchLastChild="true">
            <StackLayout dock="left" width="60em" verticalAlignment="center">
                <Label :text="item.weekday" class="event-weekday" />    
                <Label :text="item.day" class="event-day" />
            </StackLayout>
            <StackLayout dock="right" verticalAlignment="center">
                <Label :text="item.event.event_name" class="event-name" />
                <Label :text="item.timeAndPlace" class="event-time-location" />
            </StackLayout>
        </DockLayout>
    </v-template>
    <v-template if="item.isSeparator">
        <Label :text="item.text" class="event-separator" />
    </v-template>
</ListView>
</template>

<style scoped>
.event-weekday {
    font-size: 16em;
    text-align: center;
    padding: 0;
}
.event-day {
    font-size: 22em;
    text-align: center;
    font-weight: bold;
    padding: 0;
}
.event-time-location {
    font-size: 18em;
    padding: 0;
}
.event-name {
    font-size: 24em;
    font-weight: bold;
    padding: 0;
}
.event-separator {
    padding-top: 24;
    padding-left: 20;
    font-weight: bold;
    color:  #811429;
    /* text-align: center; */
}
StackLayout {
    padding: 0;
    margin: 0;
}
Label {
    padding: 0;
    margin: 0;
}
DockLayout {
    padding: 0;
    padding-top: 16;
    padding-bottom: 16;
    margin: 0;
}
</style>

<script>
import EventDetails from '../EventDetails';

export default {
computed: {
    listItems() {
        if (this.hidePrivate) {
            this.events = this.events.filter((e) => {
                return !e.event_private;
            });
        }


        let listItems = [];
        let lastMonth = -1;
        
        let today = new Date().toLocaleDateString();
        let checkToday = true;

        this.events.forEach((e) => {
            // if soonest evnet is today, add "Today" separator
            let d = e.event_start.toLocaleDateString();
            let m = e.event_start.getMonth();
            if (checkToday) {
                if (d == today) {
                    listItems.push({
                        text: "Today",
                        isSeparator: true
                    });
                    checkToday = false;
                    m = -1;  // set month of event to "today" essentially, so that month separator gets added right after today's events
                } else if (d > today) {
                    checkToday = false;
                }
            }



            // if event month is different than last month, add month separator
            if (m != lastMonth) {
                listItems.push({
                    text: this.months[m],
                    isSeparator: true
                });
                lastMonth = m;
            }

            
            listItems.push({
                day: e.event_start.getDate(),
                weekday: this.getWeekday(e.event_start),
                timeAndPlace: this.getTimeAndPlace(e),
                event: e,
                isSeparator: false
            });
        })
        return listItems;
    }
},
data() {
    return {
        weekdays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        months: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
    }
},
props: {
    events: [],
    hidePrivate: false
},
methods: {
    openEvent(e) {
        //console.log("User tapped event: ", e.item);
        this.$navigateTo(EventDetails, {
            props: {
                event: e.item.event
            }
        })
    },
    getWeekday(date) {
        return this.weekdays[date.getDay()];
    },
    getTime(date) {
        return ((date.getHours() + 11) % 12 + 1) +    // hours converted to 12-hour time
                ":" +
                (date.getMinutes() < 10 ? "0" : "") +  // add leading zero
                date.getMinutes() +                    // minutes
                (date.getHours() > 12 ? "PM" : "AM");
    },
    getTimeAndPlace(event) {
        let date = event.event_start;  
        return this.getTime(date) + ", " + event.event_location;
    }
}
}
</script>