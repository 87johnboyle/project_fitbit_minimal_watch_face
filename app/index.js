import clock from "clock";
import date from "date";
import { battery } from "power";
import { charger } from "power";
import { HeartRateSensor } from "heart-rate";
import document from "document";
import { BodyPresenceSensor } from "body-presence";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// Declare months for date display

let months = ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug",  "Sep",  "Oct",  "Nov", "Dec"];

// Get a handle on the <text> element
const myHours = document.getElementById("myHours");
const myMins = document.getElementById("myMins");
const myDate = document.getElementById("myDate");
let hrLabel = document.getElementById("hrLabel");
const myBattery = document.getElementById("myBattery");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  myHours.text = `${hours}`;
  myMins.text = `${mins}`;
  myDate.text =  months[evt.date.getMonth()] 
                    + " " + evt.date.getDate();
}

// HR

var hrm = new HeartRateSensor();

// Declare an event handler that will be called every time a new HR value is received.
hrm.onreading = function() {
  hrLabel.text = hrm.heartRate;
  hrm.start();
}

// Body Presence sensor switches hr rate on and off if body is detected.

if (BodyPresenceSensor) {
  const body = new BodyPresenceSensor();
  body.addEventListener("reading", () => {
    if (!body.present) {
      hrm.stop();
    } else {
      hrm.start();
    }
  });
  body.start();
}

// Battery

myBattery.text = `${battery.chargeLevel}%`; // initialize on startup
battery.onchange = (charger, evt) => {
   myBattery.text = `${battery.chargeLevel}%`;
}