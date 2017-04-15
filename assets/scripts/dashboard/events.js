'use strict';

const jobsApi = require('../jobs/api');
const homeUi = require('./home-ui');
const remindersApi = require('../reminders/api');

// LOGIN EVENTS

const onGetDash = function() {
  event.preventDefault();
  // jobsApi.getJobs()
  //   .done(homeUi.showJobDashTable)
  //   .fail(homeUi.homeFailure);
  // remindersApi.getReminders()
  //   .done(homeUi.showRemindersDashTable)
  //   .fail(homeUi.homeFailure);
};


const addHandlers = () => {
  $('.content').on('click', "#get-dash-btn", onGetDash);
};

module.exports = {
  addHandlers,
};
