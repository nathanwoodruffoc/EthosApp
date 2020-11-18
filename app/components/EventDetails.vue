<template>
<Page class="page">
    <ActionBar class="action-bar">
        <Label text="Event Details"></Label>
    </ActionBar>
    <ScrollView>
        <StackLayout class="my-container">
            <StackLayout marginBottom="10em">
                <Label :text="event.event_name" class="event-title"/>
                <Label :text="event.timeAndLocation" class="event-time" />
                
                <Label :text="getDateString(event.event_start)" class="event-small" />
                <Label v-if="event.event_private" text="This event is private." class="event-small"/>
            </StackLayout>

            <StackLayout v-if="event.event_show_description" >
                <Label text="Description:" class="event-separator"/>
                <Label :text="event.event_description" textWrap="true"/>
            </StackLayout>
            <!-- <Label :text="event.event_location" /> -->

            <Label v-if="hasContactInfo(event)" text="Contact Info:" class="event-separator"/>
            <Label v-if="event.event_contact_show_name" :text="event.contact_name" />
            <Label v-if="event.event_contact_show_email" :text="event.contact_email" />
            <Label v-if="event.event_contact_show_phone" :text="event.contact_phone" />
        </StackLayout>
    </ScrollView>
</Page>
</template>

<style scoped>
.my-container {
    padding: 12em;
}
Label {
    font-size: 18em;
    margin-left: 12em
}
.event-separator {
    font-size: 24em;
    font-weight: bold;
    margin-top: 20em;
    margin-left: 0;
}
.event-title {
    font-size: 30em;
    font-weight: bold;
    color:  #811429;
    margin-left: 0;
    text-wrap: true;
}
.event-time {
    font-size: 20em;
    font-weight: 500;
    margin-left: 0em;
    text-wrap: true;
}
.event-small {
    font-size: 16em;
    margin-left: 0em;
}
</style>

<script>
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
        // return this.weekdays[date.getDay()] + ", " +
        //         this.months[date.getMonth()] + " " + 
        //         ordinalSuffix(date.getDate()) + " @ " +
        //         getTime(date);

        // Sun, Nov 15th
        // return this.weekdays[date.getDay()] + ", " +
        //         this.months[date.getMonth()] + " " + 
        //         ordinalSuffix(date.getDate());

        // Nov 15
        return this.months[date.getMonth()] + " " + 
                date.getDate();
    },
    hasContactInfo(event) {
        return event.event_contact_show_name ||
                event.event_contact_show_email ||
                event.event_contact_show_phone;
    }
}
}

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
</script>