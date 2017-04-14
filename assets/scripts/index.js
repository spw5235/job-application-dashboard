'use strict';

const setAPIOrigin = require('../../lib/set-api-origin');
const config = require('./config');
const authEvents = require('./auth/events.js');
const jobEvents = require('./jobs/events.js');
const reminderEvents = require('./reminders/events.js');
const dashboardEvents = require('./dashboard/events.js');
const documentEvents = require('./documents/events.js');
const contactEvents = require('./contacts/events.js');
const communicationEvents = require('./communications/events.js');

$(() => {
  authEvents.addHandlers();
  dashboardEvents.addHandlers();
  jobEvents.addHandlers();
  reminderEvents.addHandlers();
  documentEvents.addHandlers();
  contactEvents.addHandlers();
  communicationEvents.addHandlers();
  $("body").show();
});

$(() => {
  setAPIOrigin(location, config);
});

// use require with a reference to bundle the file and use it in this file
// const example = require('./example');

// use require without a reference to ensure a file is bundled
require('./example');
