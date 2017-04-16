'use strict';

const remindersApi = require('../reminders/api');
const dashboardHomeUi = require('./home-ui');

// LOGIN EVENTS

const onGetDash = function() {
  event.preventDefault();
  remindersApi.getReminders()
    .done(dashboardHomeUi.showRemindersDashTable)
    .fail(dashboardHomeUi.homeFailure);
};


const addHandlers = () => {
  $('#get-dash-home-btn').on('click', onGetDash);
};

module.exports = {
  addHandlers,
};
