<template>
<Page class="page">
    <ActionBar class="action-bar">
        <Label text="Home"></Label>
    </ActionBar>

    <StackLayout>
        <Image src="res://ethos_oc_upscaled" horizontalAlignment="center" width="50%" marginTop="25"/>
        <AbsoluteLayout width="245" height="245" horizontalAlignment="center" margin="25">
            <AnimatedCircle class="progressBar"
                    :progress="circleProgress"
                    rimWidth="80" 
                    clockwise="true"/>
            <StackLayout orientation="horizontal" top="0" left="0" width="245" height="245">
                <StackLayout verticalAlignment="center" width="245">
                        <Label text="Semester Goal" class="progressText" id="top"
                            horizontalAlignment="center"/>
                        <Label :text="circleText" class="progressText" id="main"
                            horizontalAlignment="center"/>
                        <Label v-if="allKudos" text="All Kudos Acquired!" class="progressText" id="bottom"
                            horizontalAlignment="center"/>
                </StackLayout>
            </StackLayout>
        </AbsoluteLayout>
        
        <Button class="btn btn-primary btn-rounded-lg button-text" @tap="checkIn" marginTop="10em">
            <FormattedString>
                <Span class="fas button-text" text.decode="&#xf029; "/>
                <Span class="button-text" text="Check In" />
            </FormattedString>
        </Button>
        <Button class="btn btn-primary btn-rounded-lg button-text" @tap="findEvents">
            <FormattedString>
                <Span class="button-text" text="Find Events" />
            </FormattedString>
        </Button>
        <Button class="btn btn-primary btn-rounded-lg button-text" @tap="checkins">
            <FormattedString>
                <Span class="button-text" text="My Checkins" />
            </FormattedString>
        </Button>
    </StackLayout>
</Page>
</template>

<style scoped>
Button {
    margin-left: 40em;
    margin-right: 40em;
    margin-top: 0em;
    margin-bottom: 30em;
    height: 70em;
}
.button-text {
    font-size: 22em;
    font-weight: 600;
    text-transform: uppercase;
}
.progressBar {
    background-color: transparent;
    width: 245;
    height: 245;
    animated: "true";
    animateFrom: "0";
    rim-color: #d8c5c9;
    bar-color: #811429;
    spin-bar-color: #bd5268;
    fill-color: #ededed;
}
.progressText {
    padding: 0;
    margin: 0;
}
#top {
    font-size: 18em;
    color:  #811429;
    text-transform: uppercase;
    font-weight: bold;
}
#main {
    font-size: 38em;
    font-weight: bold;
    color:  #811429;
    margin-top: -10;
    margin-bottom: -4;
}
#bottom {
    font-size: 15em;
}
</style>

<script>
import Vue from 'nativescript-vue'
Vue.registerElement('AnimatedCircle', () => require('@nativescript/animated-circle').AnimatedCircle)

import Checkins from './Checkins';
import FindEvents from './FindEvents';
import LoginPage from './LoginPage';
import ScanCode from './ScanCode';

import * as OCApi from '../src/ocApi.js';

export default {
data() {
    return {
        circleProgress: 0,
        circleText: "-/-",
        navigationReady: undefined,
        navigatingTo: undefined
    }
},
props: {
    settings: {},
    student: {}
},
computed: {
    // circleProgress() {
    //     //console.log("Caculating circle progress");
    //     if (this.student != undefined) {
    //         if (this.student.student_required_kudos == undefined || this.student.student_current_progress == undefined) {
    //             return 0;
    //         } else {
    //             this.student.student_current_progress = 14;
    //             return 100 * Math.min(this.student.student_current_progress / this.student.student_required_kudos, 1);
    //         }
    //     }
    //     return 0;
    // },
    // circleText() {
    //     //console.log("Caculating circle text");
    //     if (this.student != undefined) {
    //         if (this.student.student_required_kudos == undefined || this.student.student_current_progress == undefined) {
    //             return "-/-";
    //         } else {
    //             return this.student.student_current_progress + "/" + this.student.student_required_kudos;
    //         }
    //     }
    //     return "-/-";
    // },
    allKudos() {
        return this.circleProgress == 100;
    }
},
mounted() {
    console.log("Home Mounted");

    //periodically fetch student?
    //needto update student kudos after checkin.
    if (this.student == undefined) {
        this.navigationReady = OCApi.getStudent({
            username: this.settings.username,
            token: this.settings.token_oc
        }).then((student) => {
            console.log("Got student: ", student);
            this.student = student;

            this.updateProgress();
        }).catch((err) => {
            console.log("Could not get student: ", err);
        });
    } else {
        this.updateProgress();
    }
},
methods: {
    async navigate(Location) {
        console.log("Navigating Home -> ", Location.__file)
        if (!this.isNavigating) {
            
            this.isNavigating = true;
            await this.navigationReady;
            this.isNavigating = false;

            this.$navigateTo(Location, {
                props: {
                    settings: this.settings,
                    student: this.student
                }
            });
        }
        
    },
    updateProgress() {
        this.circleProgress = 100 * Math.min(this.student.student_current_progress / this.student.student_required_kudos, 1);
        this.circleText = this.student.student_current_progress + "/" + this.student.student_required_kudos;
    },
    checkIn() {
        this.navigate(ScanCode);
    },
    findEvents() {
        this.navigate(FindEvents);
    },
    checkins() {
        this.navigate(Checkins);
    }
}
};
</script>


