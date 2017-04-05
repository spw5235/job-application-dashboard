'use strict';

const store = require('../store');
const displayStatusDetails = require('../templates/reminder/show-reminder-record.handlebars');
const displayStatusCreateForm = require('../templates/reminder/create-reminder.handlebars');


// Status UI

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
//   const currentStatusName = store.statusName;
//   $("#job-record-btn-edit").attr("data-current-reminder-id", store.currentReminderId);
//   $("#job-record-delete").attr("data-current-reminder-id", store.currentReminderId);
//   $("#create-job-status-btn").attr("data-current-reminder-id", store.currentReminderId);
//   $(".current-status-name").text(currentStatusName);
// };

// const getJobFailure = () => {
//   $(".notification-container").children().text("");
// };

//
// const getStatusSuccess = (data) => {
//   $(".notification-container").children().text("");
//   store.statusPage = false;
//   store.currentReminderId = 0;
//   store.currentJobId = 0;
//   store.statusDataForEdit = data;
//
//   $(".content").children().remove();
//   let statusDashboard = displayStatusDashboard({
//     statuses: data.statuses
//   });
//   $('.content').append(statusDashboard);
// };
//
// const showReminderRecordSuccess = (data) => {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   store.lastShowStatusData = data;
//   store.statusName = data.status.name;
//   data.status.status_page = true;
//   store.statusPage = data.status.status_page;
//   let statusDetails = displayStatusDetails({
//     status: data.status
//   });
//   $('.content').append(statusDetails);
//   jobsApi.getJobs()
//     .done(getJobSuccess)
//     .fail(getJobFailure);
// };
//
// const showReminderRecordFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('failure');
// };

const showReminderCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateForm = displayStatusCreateForm();
  $('.content').append(showCreateForm);
  $(".current").attr("data-current-job-id", store.currentJobId);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
};

// const updateFormGenerator = function() {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//
//   let editStatus = displayEditStatus({
//     status: store.lastShowStatusData.status
//   });
//   $('.content').append(editStatus);
// };
//
// const getStatusFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('get status failure');
// };
//
const createReminderSuccess = () => {
  console.log(store.createReminderData);
  console.log(store.currentReminderId);
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Status Has Been Successfully Created");
  store.statusPage = true;
  let showReminderDetails = displayStatusDetails({
    status: store.createReminderData.status
  });
  $(".content").append(showReminderDetails);
  $(".current").attr("data-current-reminder-id", store.currentReminderId);

};
//
// const deleteReminderSuccess = () => {
//   $(".notification-container").children().text("");
//   console.log('delete success');
//   remindersApi.getReminders()
//     .done(getStatusSuccess)
//     .fail(getStatusFailure);
// };
//
// const deleteReminderFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('delete fail');
// };
//
// const updateReminderSuccess = (data) => {
//   $(".notification-container").children().text("");
//   $(".success-alert").text("Status Has Been Successfully Updated");
//   store.currentReminderId = data.status.id;
//   $(".content").children().remove();
//   remindersApi.showReminder()
//     .done(showReminderRecordSuccess)
//     .fail(showReminderRecordFailure);
// };
//
// const updateReminderFailure = (data) => {
//   $(".notification-container").children().text("");
//   $("#update-status-error").text("Error: Status not updated.  Please ensure all required fields have values");
// };

const createReminderFailure = function() {
  console.log('failure');
};

module.exports = {
  showReminderCreateForm,
  createReminderFailure,
  createReminderSuccess,
};
