'use strict';

const remindersApi = require('../reminders/api');
const dashboardHomeUi = require('./home-ui');
const store = require('../store');
const jobsApi = require('../jobs/api');
const jobsUi = require('../jobs/ui');

const onGetDash = function() {
  event.preventDefault();
  let screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    $(".nav-mobile-ul").slideUp();
  }
  remindersApi.getReminders()
    .done(dashboardHomeUi.showRemindersApproachDashTable)
    .fail(dashboardHomeUi.homeFailure);
};

const showMobileOptions = function() {
  dashboardHomeUi.showMobileOptions();
};

// const clearDefaultDate = function() {
//   $(".default-date").val("");
// };

const showLinkedCompany = function(event) {
  event.preventDefault();
  store.currentJobId = parseInt($(this).attr("data-job-ref-id"));
  jobsApi.showJob()
    .done(jobsUi.showJobRecordSuccess)
    .fail(jobsUi.showJobRecordFailure);
};

const addHandlers = () => {
  $('#get-dash-home-btn').on('click', onGetDash);
  $('#nav-mobile-dropdown').on('click', showMobileOptions);
  $('.content').on('click', '.linked-company', showLinkedCompany);
  // $('.content').on('click', '.clear-default-date', clearDefaultDate);
};

module.exports = {
  addHandlers,
};
