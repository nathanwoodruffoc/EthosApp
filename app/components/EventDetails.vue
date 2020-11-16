<template>
<Page class="page">
    <ActionBar class="action-bar">
        <Label text="Event Details"></Label>
    </ActionBar>
    <StackLayout padding="16">
        <Label :text="event.event_name" />
        <Label :text="event.event_description" />
        <Label :text="event.event_location" />
        <DockLayout class="event-time" stretchLastChild="true">
            <Label text="Starts at" dock="left" width="100em" />
            <Label :text="this.getDateString(event.event_start)" dock="right"/>
        </DockLayout>
        <DockLayout class="event-time" stretchLastChild="true">
            <Label text="Ends at" dock="left" width="100em" />
            <Label :text="this.getDateString(event.event_end)" dock="right"/>
        </DockLayout>
        
        <Label v-if="event.event_private" text="This event is private." />
        <Label v-if="event.event_contact_show_email" :text="event.contact_email" />
        <Label v-if="event.event_contact_show_phone" :text="event.contact_phone" />

    </StackLayout>
</Page>
</template>

<style scoped>
.event-time Label {
    font-size: 18em;
}
</style>

<script>
function ordinalSuffix(i) {
    let j = i % 10;
        if (j == 1 && i != 11) {
            return i + "st";
        }
        if (j == 2 && i != 12) {
            return i + "nd";
        }
        if (j == 3 && i != 13) {
            return i + "rd";
        }
        return i + "th";
}

function getTime(date) {
    return ((date.getHours() + 11) % 12 + 1) +    // hours converted to 12-hour time
            ":" +
            (date.getMinutes() < 10 ? "0" : "") +  // add leading zero
            date.getMinutes() +                    // minutes
            (date.getHours() > 12 ? "PM" : "AM");
}

export default {
props: {
    event: {}
},
data() {
    return {
        weekdays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        months: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]
    }
},
mounted() {
    console.log("Viewing event details for: ", this.event);
},
methods: {
    getDateString(date) {
        // Sun Nov 15th, 11:00AM
        // Sun 11/15, 11:00AM

        // Sun, Nov 15th @ 11:00AM
        let output = this.weekdays[date.getDay()] + ", " +
                this.months[date.getMonth()] + " " + 
                ordinalSuffix(date.getDate()) + " @ " +
                getTime(date);
        console.log(output);
        return output;
    }
}
}
</script>