'use strict';

const remindersApi = require('../reminders/api');
const dashboardHomeUi = require('./home-ui');

const onGetDash = function() {
  event.preventDefault();
  let screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    $(".nav-mobile-ul").slideUp();
  }
  remindersApi.getReminders()
    .done(dashboardHomeUi.showRemindersDashTable)
    .fail(dashboardHomeUi.homeFailure);
};

const showMobileOptions = function() {
  dashboardHomeUi.showMobileOptions();
};


const addHandlers = () => {
  $('#get-dash-home-btn').on('click', onGetDash);
  $('#nav-mobile-dropdown').on('click', showMobileOptions);
};

module.exports = {
  addHandlers,
};
