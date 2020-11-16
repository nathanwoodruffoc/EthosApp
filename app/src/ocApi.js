const apiURL = "https://ethos.oc.edu/api";
const picURL = "https://account.oc.edu/picture/";

const DEBUG_modifyKudos = true;
const DEBUG_fakeKudosProgress = 16;
const DEBUG_fakeKudosRequired = 20;

const DEBUG_injectEvents = true;
const DEBUG_fakeEvents = [
    {
        "event_id": 111111,
        "event_group_id": 11111,
        "event_name": "Taking Sides Chapel",
        "event_description": "",
        "event_start": DEBUG_genEventStart(),
        "event_end": DEBUG_genEventEnd(),
        "event_location": "Baugh Auditorium",
        "event_private": false,
        "event_contact_id": "1001342",
        "event_contact_show_phone": true,
        "event_contact_show_email": true,
        "contact_email": "brian.simmons@oc.edu",
        "contact_phone": "405-425-5525",
    },

]

function DEBUG_genEventStart() {
    let date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    return date;
}
function DEBUG_genEventEnd() {
    let date = new Date();
    date.setMinutes(date.getMinutes() + 60);
    return date;
}


async function stdGet(name, url) {
    console.log("GET URL: " + apiURL + url);
    return fetch(apiURL + url)
    .then((res) => {
        if (res.status != 200) {
            throw new Error("Status " + res.status + " " + res.statusText);
        } else {
            return res;
        }
    })
    .then((response) => response.json())
    .catch((err) => {
        throw new Error("Error on " + name + " (OC Api): " + err);
    });
}

export async function validateLogin(user) {
    return new Promise((resolve, reject) => {
        stdGet("validateLogin", 
                "/Token/" + 
                user.username +
                "?token=" + encodeURIComponent(user.token) +
                "&timestamp=" + Date.now())
        .then((res) => {
            if (res == true) {
                console.log("Login successful");
                resolve();
            } else {
                console.log("Login unsuccessful");
                reject("Login unsuccessful");
            }
        })
        .catch((err) => {
            reject(err);
        });
    })
}

export async function login(username, password) {
    return new Promise((resolve, reject) => {
        fetch(apiURL + "/Login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then((r) => {
            if (r.status == 200) {
                return r.json();
            } else if (r.status == 400) {
                throw new Error("unauthorized");
            } else {
                throw new Error(r.status);
            }
        }).then((r) => {
            resolve(r.EncryptedData);
        })
        .catch((err) => { 
            reject(err); 
        });
    });
}

export async function getStudent(user) {
    console.log("getStudent");
    return stdGet("getStudent", 
        "/User/" + user.username +
        "?token=" + encodeURIComponent(user.token) +
        "&timestamp=" + Date.now())
    .then((r) => {
        if (DEBUG_modifyKudos) {
            r.CurrentSemesterCheckinCount = DEBUG_fakeKudosProgress;
            r.RequiredKudos = DEBUG_fakeKudosRequired;
        }
        return {
            student_id: undefined,
            student_num: r.UserID,
            student_est_progress: r.EstimatedProgress,
            student_required_kudos: r.RequiredKudos,
            student_current_progress: r.CurrentSemesterCheckinCount,
            student_picture_id: r.PicID,
            user_fname: r.FirstName,
            user_lname: r.LastName,
            user_mname: r.MiddleName,
            user_email: r.EmailAddresses.find((e) => {
                            return e.Type == "OC";
                        }).Address,
            user_phone: r.PhoneNumbers.find((e) => {
                            return e.NumberType == 1;
                        }).Number
        }
    });
}

export async function getCheckins(user) {
    console.log("Fetching checkins...");
    let start = Date.now();
    return stdGet("getStudent", 
        "/Checkins/" + 
        "?username=" + user.username +
        "&token=" + encodeURIComponent(user.token) +
        "&timestamp=" + Date.now())
    .then((r) => {
        let end = Date.now();
        let time = (end - start) / 1000;
        console.log("Done fetching checkins. (", time, "s)");

        let result = [];
        r.forEach(e => {
            result.push({
                checkin_id: e.ID,
                checkin_event_id: e.EventID,
                checkin_time: e.CheckInTime,
                checkin_type: e.CheckInTypeName
            });
        });

        result.sort((a,b) => {
            return a.checkin_time - b.checkin_time;  //latest first
        });

        return result;
    });
}

export async function getEvents(user) {
    console.log("Fetching events...");
    let start = Date.now();
    return stdGet("getStudent", 
        "/Events/" + 
        "?username=" + user.username +
        "&token=" + encodeURIComponent(user.token) +
        "&timestamp=" + Date.now())
    .then((r) => {
        let end = Date.now();
        let time = (end - start) / 1000;
        console.log("Done fetching events. (", time, "s)");

        console.log("Filtering events...");
        start = Date.now();

        let result = [];
        r.forEach(e => {
            result.push({
                event_id: e.ID,
                event_group_id: e.ReservationID,
                event_name: e.EventName,
                event_description: (e.Description == null ? "" : e.Description),
                event_start: new Date(e.EventStart),
                event_end: new Date(e.EventEnd),
                event_location: e.Room,
                event_private: e.PrivateEvent,
                event_contact_id: e.ContactUserID,
                event_contact_show_email: (e.ContactEmail != null && e.ContactEmail != "" && e.ContactEmail != "n/a"),
                event_contact_show_phone: (e.ContactPhone != null && e.ContactPhone != "" && e.ContactPhone != "n/a"),
                contact_email: e.ContactEmail,
                contact_phone: e.ContactPhone
            })
        });

        if (DEBUG_injectEvents) {
            DEBUG_fakeEvents.forEach((e) => {
                console.log("Injected Event: ", e)
                result.push(e)
            })
        }

        result.sort((a,b) => {
            return a.event_start - b.event_start; // earliest first
        });

        end = Date.now();
        time = (end - start) / 1000;
        console.log("Done filtering events. (", time, "s)");

        return result;
    });
}