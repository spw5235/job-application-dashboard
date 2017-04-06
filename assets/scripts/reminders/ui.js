'use strict';

const store = require('../store');
const displayReminderDetails = require('../templates/reminder/show-reminder-record.handlebars');
const displayReminderCreateForm = require('../templates/reminder/create-reminder.handlebars');
const displayCompanyDashboard = require('../templates/reminder/display-company-create-form.handlebars');
const displayJobDashboard = require('../templates/reminder/display-job-create-form.handlebars');

// Reminder UI

// const getJobSuccess = (data) => {
//   $(".notification-container").children().text("");
//   const numberOfJobs = data.jobs.length;
//   let singleJobData = data.jobs[0];
//
//   let singleJobDetails = displayShowJobTable({
//     job: singleJobData
//   });
//
//   let jobDashboard = displayJobsTable({
//     jobs: data.jobs
//   });
//
//   if (numberOfJobs === 1) {
//     $(".content").append(singleJobDetails);
//   } else if (numberOfJobs > 1) {
//     $(".content").append(jobDashboard);
//   }
//   const currentReminderName = store.reminderName;
//   $("#job-record-btn-edit").attr("data-current-reminder-id", store.currentReminderId);
//   $("#job-record-delete").attr("data-current-reminder-id", store.currentReminderId);
//   $("#create-job-reminder-btn").attr("data-current-reminder-id", store.currentReminderId);
//   $(".current-reminder-name").text(currentReminderName);
// };

// const getJobFailure = () => {
//   $(".notification-container").children().text("");
// };

//
// const getReminderSuccess = (data) => {
//   $(".notification-container").children().text("");
//   store.reminderPage = false;
//   store.currentReminderId = 0;
//   store.currentJobId = 0;
//   store.reminderDataForEdit = data;
//
//   $(".content").children().remove();
//   let reminderDashboard = displayReminderDashboard({
//     reminders: data.reminders
//   });
//   $('.content').append(reminderDashboard);
// };
//
const showReminderRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  console.log(data);
  store.lastShowReminderData = data;
  let reminderDetails = displayReminderDetails({
    reminder: data.reminder
  });
  $('.content').append(reminderDetails);
  // jobsApi.getJobs()
  //   .done(getJobSuccess)
  //   .fail(getJobFailure);
};
//
// const showReminderRecordFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('failure');
// };

const showReminderCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateForm = displayReminderCreateForm();
  $('.content').append(showCreateForm);
  $(".current").attr("data-current-job-id", store.currentJobId);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
};

// const updateFormGenerator = function() {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//
//   let editReminder = displayEditReminder({
//     reminder: store.lastShowReminderData.reminder
//   });
//   $('.content').append(editReminder);
// };
//
// const getReminderFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('get reminder failure');
// };
//
const createReminderSuccess = () => {
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Reminder Has Been Successfully Created");
  store.reminderPage = true;
  let showReminderDetails = displayReminderDetails({
    reminder: store.createReminderData.reminder
  });
  $(".content").append(showReminderDetails);
  $(".current").attr("data-current-reminder-id", store.currentReminderId);

};
//
// const deleteReminderSuccess = () => {
//   $(".notification-container").children().text("");
//   console.log('delete success');
//   remindersApi.getReminders()
//     .done(getReminderSuccess)
//     .fail(getReminderFailure);
// };
//
// const deleteReminderFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('delete fail');
// };
//
// const updateReminderSuccess = (data) => {
//   $(".notification-container").children().text("");
//   $(".success-alert").text("Reminder Has Been Successfully Updated");
//   store.currentReminderId = data.reminder.id;
//   $(".content").children().remove();
//   remindersApi.showReminder()
//     .done(showReminderRecordSuccess)
//     .fail(showReminderRecordFailure);
// };
//
// const updateReminderFailure = (data) => {
//   $(".notification-container").children().text("");
//   $("#update-reminder-error").text("Error: Reminder not updated.  Please ensure all required fields have values");
// };

const createReminderFailure = function() {
  console.log('failure');
};

const displayCompanyDropdownSuccess = function(data) {
  $(".notification-container").children().text("");

  console.log(data.companies);

  let companyOptionDisplay = displayCompanyDashboard({
    companies: data.companies
  });

  $('.associate-reminder-with-company-container').append(companyOptionDisplay);

};

const displayCompanyDropdownFailure = function() {
  console.log('fail');
};

const displayJobDropdownSuccess = (data) => {
  console.log(data);
  $(".notification-container").children().text("");

  let jobOptionDisplay = displayJobDashboard({
    jobs: data.jobs
  });

  $('.associate-reminder-with-company-container').append(jobOptionDisplay);
};

const displayJobDropdownFailure = () => {
  console.log('failure');
};

module.exports = {
  showReminderCreateForm,
  createReminderFailure,
  createReminderSuccess,
  displayCompanyDropdownSuccess,
  displayJobDropdownSuccess,
  displayCompanyDropdownFailure,
  displayJobDropdownFailure,
  showReminderRecordSuccess,
};
