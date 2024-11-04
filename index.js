console.log("index.js start");

document.getElementById("debug").addEventListener("click", function() {
    currentSpeaker += 1;
    speakerEventsSetup();
});

import {generalEventData, speakerEventData} from "./data.js";

console.log(speakerEventData[0].name);

// var newSpeakerEventData = speakerEventData;

// var currentSpeakerData;
// var currentSpeakerEvents;
// var currentSpeakerEvent;

// for (let i = 0; i < speakerEventData.length; i++) {
//     currentSpeakerData = newSpeakerEventData[i];
//     currentSpeakerEvents = currentSpeakerData.events;

//     currentSpeakerData.priority = 0;

//     for (let j = 0; j < currentSpeakerEvents.length; j++) {
//         currentSpeakerEvent = currentSpeakerEvents[j];
//         // console.log(currentSpeakerEvent.date);
        
//         if (currentSpeakerEvent.date.includes("-")) {
//             // console.log(currentSpeakerEvent.date + " -> " + toDateNum(currentSpeakerEvent.date))
//             currentSpeakerEvent.dateNum = toDateNum(currentSpeakerEvent.date);
//         }
//     }
// }

// console.log(JSON.stringify(newSpeakerEventData, null, 4));

const styles = document.styleSheets[0];
const r = document.querySelector(":root");

const upperOptions = document.getElementById("upperOptions").firstElementChild;
const timelineBody = document.getElementById("timelineBody");
const lowerOptions = document.getElementById("lowerOptions").firstElementChild;

const timelineContent = document.getElementById("timelineContent");
const timelineOverlay = document.getElementById("timelineOverlay");
const timelineBase = document.getElementById("timelineBase");
const timelineElements = document.getElementById("timelineElements");

var isDragging = false;
let startX, startY, scrollLeft, scrollTop;

timelineContent.addEventListener('mousedown', (e) => {
    // e.preventDefault();
    isDragging = true;
    startX = e.pageX - timelineContent.offsetLeft;
    startY = e.pageY - timelineContent.offsetTop;
    scrollLeft = timelineContent.scrollLeft;
    scrollTop = timelineContent.scrollTop;
});
timelineContent.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - timelineContent.offsetLeft;
    const y = e.pageY - timelineContent.offsetTop;
    const walkX = (x - startX) * 1;
    const walkY = (y - startY) * 1;
    timelineContent.scrollLeft = scrollLeft - walkX;
    timelineContent.scrollTop = scrollTop - walkY;
    speakerOverview.scrollLeft = scrollLeft - walkX;
    speakerOverview.scrollTop = scrollTop - walkY;

    if (Math.abs(walkX) > 10) {
        dateRangeContainer.classList.add("changed");
    }
});
document.addEventListener("mouseup", function() {
    isDragging = false;
});

const tickContainer = document.getElementById("tickContainer");

const switches = document.getElementsByClassName("switch");
for (let i = 0; i < switches.length; i++) {
    let switchI = switches[i];
    let switchValues = switchI.innerHTML.split("/");
    switchI.addEventListener("click", function() {
        switches[i].innerHTML = switchValues[(switchValues.indexOf(switchI.innerHTML) + 1) % switchValues.length];
    });
    switchI.innerHTML = switchValues[0];
}

const textInputs = document.getElementsByClassName("textInput");
for (let i = 0; i < textInputs.length; i++) {
    let textInputI = textInputs[i];
    textInputI.addEventListener("mousedown", function(e) {
        if (document.activeElement !== this) {
            e.preventDefault();
            this.focus();
            this.select();
        }
    });
}

const eventContainers = document.getElementsByClassName("eventContainer");
for (let i = 0; i < eventContainers.length; i++) {
    let eventContainer = eventContainers[i];
    let nRows = eventContainer.innerHTML;
    eventContainer.innerHTML = "";
    var eventRow;
    for (let j = 0; j < nRows; j++) {
        eventRow = document.createElement("div");
        eventRow.className = "eventRow";
        eventContainer.appendChild(eventRow);
    }
}

const dateRangeContainer = document.getElementById("dateRangeContainer");
const startDateInput = document.getElementById("dateRangeStartYear");
const endDateInput = document.getElementById("dateRangeEndYear");
const startDateADBCswitch = document.getElementById("dateRangeStartADBC");
const endDateADBCswitch = document.getElementById("dateRangeEndADBC");
var startDate = -700;
var endDate = 500;
var startDateADBC = -1;
var endDateADBC = 1;
startDateInput.addEventListener("focusout", function() {
    updateDates();
});
endDateInput.addEventListener("focusout", function() {
    updateDates();
});
startDateADBCswitch.addEventListener("click", function() {
    updateDates();
});
endDateADBCswitch.addEventListener("click", function() {
    updateDates();
});

function updateDates() {
    let obj = {"BC": -1, "AD": 1};
    startDateADBC = obj[startDateADBCswitch.innerHTML];
    endDateADBC = obj[endDateADBCswitch.innerHTML];
    startDate = startDateInput.value * startDateADBC;
    endDate = endDateInput.value * endDateADBC;
    alignTimelineBase();
}

var ticks;

function createTimelineBase() {
    ticks = [];
    var tick;
    var line;
    var year;
    for (let i = -700; i <= 500; i++) {
        tick = document.createElement("div");
        tick.className = "tick";

        line = document.createElement("div");
        line.className = "line";
        tick.appendChild(line);

        year = document.createElement("p");
        year.className = "year";
        year.innerHTML = Math.abs(i);
        tick.appendChild(year);

        ticks.push(tick);
        tickContainer.appendChild(tick);
    }

    alignTimelineBase();
}

var pixelsPerYear

function alignTimelineBase() {
    dateRangeContainer.classList.remove("changed");

    var spanLength = endDate - startDate;
    var timelineWindowWidth = timelineBody.offsetWidth - 60;
    var timelineWidth = (timelineWindowWidth) * (1200/spanLength);
    pixelsPerYear = (timelineWindowWidth)/spanLength;

    console.log("timelineWidth: " + timelineWidth);
    console.log("pixelsPerYear: " + pixelsPerYear);

    if (r.style.getPropertyValue("--timelineWidth") != timelineWidth + "px") {
        r.style.setProperty("--timelineWidth", timelineWidth + "px");
        var waitTime = 500;
    } else {
        var waitTime = 0;
    }

    setTimeout(() => {

    timelineContent.scrollTo({left: (startDate + 700) * pixelsPerYear, behavior: "smooth"});

    var tickFrequency = Math.round(10/pixelsPerYear);
    var tickDisplacement = pixelsPerYear * tickFrequency;

    // console.log("(spanLength/tickFrequency): " + (spanLength/tickFrequency));
    console.log("tickDisplacement * (spanLength/tickFrequency): " + tickDisplacement * (spanLength/tickFrequency));

    // r.style.setProperty("--tickDisplacement", tickDisplacement - 1.5 + "px");

    console.log("tickFrequency: " + tickFrequency);
    console.log("tickDisplacement: " + tickDisplacement);
    for (let i = 0; i < ticks.length; i++) {
        if (i % tickFrequency == 0) {
            if (i % (5*tickFrequency) == 0) {
                ticks[i].className = "tick longTick show";
            } else {
                ticks[i].className = "tick show";
            }
        } else {
            ticks[i].className = "tick";
        }
    }

    ticks[0].className = "tick longTick highlighted show";
    ticks[startDate + 700].className = "tick longTick highlighted show";
    ticks[endDate + 700].className = "tick longTick highlighted show";
    ticks[ticks.length - 1].className = "tick longTick highlighted show";

    // timelineContent.scrollTo({left: (startDate + 700) * pixelsPerYear, behavior: "smooth"});

    generalEventsSetup();
    speakerEventsSetup();
    updateSpeakerTimeline();

    }, waitTime); //                                       x < intersection point of... 
}

function timelineLayoutSetup() {
    var timelineHeight = timelineBody.offsetHeight;
    r.style.setProperty("--timelineHeight", timelineHeight + "px");
}

const speakerOption = document.createElement("div");
const eventsOption = document.createElement("div"); // < this line
const booksOption = document.createElement("div");

speakerOption.ID = "speakerOption";
eventsOption.ID = "eventsOption"; // < and this line
booksOption.ID = "booksOption";

const speakerOverview = document.createElement("div");
speakerOverview.style.width = timelineBody.offsetWidth + "px";

function createOptions() {
    speakerOption.className = "displayOption";
    eventsOption.className = "displayOption";
    booksOption.className = "displayOption";

    speakerOverview.className = "speakerOverview";
    var speakerOverviewRow;
    for (let i = 0; i < 6; i++) {
        speakerOverviewRow = document.createElement("div");
        speakerOverviewRow.className = "speakerOverviewRow";
        speakerOverview.appendChild(speakerOverviewRow);
    }
    speakerOption.appendChild(speakerOverview);

    updateSpeakerTimeline();

    upperOptions.appendChild(speakerOption);
}

function updateSpeakerTimeline() {
    var speakers = [];
    var speaker;
    var data = [];
    var dataPoint;
    for (let i = 0; i < speakerEventData.length; i++) {
        speaker = document.createElement("div");
        speaker.className = "speaker";
        speaker.style.width = (speakerEventData[i].lifespanEndNum - speakerEventData[i].lifespanStartNum) * pixelsPerYear + "px";
        // speaker.style.marginLeft = -0.5 * (speakerEventData[i].lifespanEndNum - speakerEventData[i].lifespanStartNum) * pixelsPerYear + "px";
        speaker.style.marginRight = -1 * (speakerEventData[i].lifespanEndNum - speakerEventData[i].lifespanStartNum) * pixelsPerYear + "px";
        speaker.innerHTML = speakerEventData[i].name;

        speakers.push(speaker);

        dataPoint = {
            dateNum: (speakerEventData[i].lifespanStartNum + speakerEventData[i].lifespanEndNum) / 2,
            priority: speakerEventData[i].priority
        };

        data.push(dataPoint);
    }

    arrangeRows(speakers, data, speakerOverview.children, [5, 4, 3, 2, 1, 0]);
}

const generalEventsContainer = document.getElementById("generalEvents");
function generalEventsSetup() {
    var events = [];

    var event;
    for (let i = 0; i < generalEventData.length; i++) {
        event = createEvent(generalEventData[i], "generalEvent");

        events.push(event);
    }

    var rows = generalEventsContainer.children;

    arrangeRows(events, generalEventData, rows, [0, 1, 2]);
}

var currentSpeaker = 0;
const speakerEventsContainer = document.getElementById("speakerEvents");
function speakerEventsSetup() {
    var data = speakerEventData[currentSpeaker].events;
    var events = [];

    var event;
    for (let i = 0; i < data.length; i++) {
        event = createEvent(data[i], "speakerEvent");

        events.push(event);
    }

    var rows = speakerEventsContainer.children;

    arrangeRows(events, data, rows, [4, 3, 2, 1, 0]);
}

function createEvent(data, extraClass) {
    var event = document.createElement("div");
    event.className = "event " + extraClass;

    var eventMarker = document.createElement("div");
    eventMarker.className = "eventMarker";

    var eventDate = document.createElement("div");
    eventDate.className = "eventDate";
    eventDate.innerHTML = data.date;

    var eventText = document.createElement("p");
    eventText.className = "eventText";
    eventText.innerHTML = data.text;

    event.appendChild(eventMarker);
    event.appendChild(eventDate);
    event.appendChild(eventText);

    return event;
}

const hiddenContainer = document.getElementById("hiddenContainer");
function arrangeRows(itemElements, data, rowElements, rowPriority) {
    var items = [];
    var item;
    for (let i = 0; i < itemElements.length; i++) {
        document.body.appendChild(itemElements[i]);

        item = {
            element: itemElements[i],
            width: itemElements[i].getBoundingClientRect().width,
            time: data[i].dateNum,
            displacement: Math.round((data[i].dateNum + 700) * pixelsPerYear),
            place: [],
            priority: data[i].priority,
            costs: []
        }

        item.place.push(Math.round(item.displacement - 0.5 * item.width));
        item.place.push(Math.round(item.displacement + 0.5 * item.width));

        item.element.style.left = item.displacement - 0.5 * item.width + "px";

        for (let i = 0; i < rowElements.length; i++) {
            item.costs.push(0);
        }

        document.body.removeChild(itemElements[i]);

        items.push(item);

        if (itemElements[i].innerHTML == "Jacob") {
            // console.log(item);
        }
    }

    var rows = [];
    var row;
    for (let i = 0; i < rowElements.length; i++) {
        row = {
            element: rowElements[i],
            items: [],
            spaces: []
        }

        rows.push(row);
    }

    function placeItem(item, startIndex = 0) {
        var row;
        var overlap;

        for (let j = startIndex; j < rows.length; j++) {

            row = rows[rowPriority[j]];
    
            overlap = findOverlap(item.place, row.spaces);

            if (overlap + 1) {
                if (item.priority > row.items[overlap].priority) {
                    placeItem(row.items[overlap], j + 1);
                    rows[j].items[overlap] = undefined;
                    rows[j].spaces[overlap] = [0, 0];
                    placeItem(item);
                    return;
                }
            } else {
                // console.log("worked");
                row.items.push(item);
                row.spaces.push(item.place);
                // console.log("putting " + data[items.indexOf(item)].text + " in " + j);
                return;
            }
        }
        return;
    }

    for (let i = 0; i < items.length; i++) {
        item = items[i];

        // console.log(data[i].text + ": ");
        placeItem(item);
    }

    for (let i = 0; i < rows.length; i++) {
        row = rows[i];

        row.element.innerHTML = "";

        for (let j = 0; j < row.items.length; j++) {
            if (row.items[j]) {
                row.element.appendChild(row.items[j].element);
            }
        }

        if (rowPriority.length == 6) {
            console.log(row.spaces);
        }
    }
}

function findOverlap(place, row) {
    for (let i = 0; i < row.length; i++) {
        if (place[0] < row[i][1] && place[1] > row[i][0]) {
            return i;
        }
    }
    return undefined;
}

function dateDisplay(date) {
    if (date < 0) {
        return `${-date} BC`;
    } else if (date == 0) {
        return "0";
    } else {
        return `AD ${date}`;
    }
}

function toDateNum(date) {
    var dateSplit = date.split(" ");
    if (dateSplit[0] == "A.D.") {
        return 1 * dateSplit[1].split("-")[0];
    } else {
        return -1 * dateSplit[0].split("-")[0];
    }
}

timelineLayoutSetup();
createTimelineBase();
generalEventsSetup();
speakerEventsSetup();
createOptions();