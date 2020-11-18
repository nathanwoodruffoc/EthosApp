<template>
  <Page class="page" @loaded="pageLoaded" @unloaded="pageUnloaded">
    <ActionBar class="action-bar">
      <Label text="Log In"></Label>
    </ActionBar>
    <StackLayout class="form">
      <Image class="logo" src="res://ethos_oc_upscaled" />
      
      <StackLayout class="input-field">
        <TextField
          class="input"
          v-model="username"
          hint="Username"
          autocorrect="false"
          autocapitalizationType="none"
          returnKeyType="next"
        ></TextField>
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>

      <StackLayout class="input-field">
        <TextField
          class="input"
          v-model="password"
          hint="Password"
          secure="true"
          returnKeyType="done"
          @returnPress="login"
        ></TextField>
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>

      <Button text="Log In" class="btn btn-primary" @tap="login"></Button>
    </StackLayout>
  </Page>
</template>

<style scoped>
.page {
  align-items: center;
  flex-direction: column;
}
.form {
  margin-left: 30;
  margin-right: 30;
  flex-grow: 2;
  /* vertical-align: middle; */
}

.logo {
  /* margin-bottom: 12; */
  margin-bottom: 50;
  margin-top: 80;
  height: 90;
  font-weight: bold;
}
.header {
  horizontal-align: center;
  font-size: 25;
  font-weight: 600;
  margin-bottom: 70;
  text-align: center;
  /* color: #D51A1A; */
}

.input-field {
  margin-bottom: 25;
}
.input {
  font-size: 18;
  placeholder-color: #a8a8a8;
}

/* .btn-primary {
  height: 50;
  margin: 30 5 15 5;
  background-color: #D51A1A;
  border-radius: 5;
  font-size: 20;
  font-weight: 600;
} */
.login-label {
  horizontal-align: center;
  color: #a8a8a8;
  font-size: 16;
}
.sign-up-label {
  margin-bottom: 20;
}
.bold {
  color: #000000;
}
</style>



<script>
var application = require("application");
import Home from "./Home";

import * as OCApi from "../src/ocApi.js";
import * as Settings from "../src/settings.js";

export default {
  props: {
    settings: {}
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  mounted() {
    this.username = this.settings.username;
    //this.password = this.settings.password;
  },
  methods: {
    pageLoaded() {
      if (application.android) {
        application.android.on(
          application.AndroidApplication.activityBackPressedEvent,
          backEvent
        );
      }
    },
    pageUnloaded() {
      if (application.android) {
        application.android.off(
          application.AndroidApplication.activityBackPressedEvent,
          backEvent
        );
      }
    },
    login() {
      console.log("Logging In...");
      OCApi.login(this.username, this.password)
      .then((token) => {
        console.log("Login successful");
        // write token and username to settings file
        this.settings.token_oc = token;
        this.settings.username = this.username;
        Settings.write(this.settings);
        console.log("navigating to home");
        this.$navigateTo(Home, {
          clearHistory: true,
          props: {
            settings: this.settings
          }
        });
      })
      .catch((err) => {
        // show a notification or something
        console.log("Error logging in: ", err);
      });
    }
  }
};

function backEvent(args) {
  args.cancel = true;
}
</script>
