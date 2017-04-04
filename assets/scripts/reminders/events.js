'use strict';
const remindersApi = require('./api');
const remindersUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
// const logic = require('./logic');

// STUDENT EVENTS

// const onGetReminders = function(event) {
//   event.preventDefault();
//   remindersApi.getReminders()
//     .done(remindersUi.getStatusSuccess)
//     .fail(remindersUi.getStatusFailure);
// };
//
// const onShowReminder = function(event) {
//   event.preventDefault();
//   remindersApi.showReminder()
//     .done(remindersUi.showReminderSuccess)
//     .fail(remindersUi.showReminderFailure);
// };
//
//
// const onShowReminderRecord = function(event) {
//   event.preventDefault();
//   store.currentReminderId = $(this).attr("data-current-reminder-id");
//   remindersApi.showReminder()
//     .done(remindersUi.showReminderRecordSuccess)
//     .fail(remindersUi.showReminderRecordFailure);
// };
//
// const onEditReminder = function(event) {
//   event.preventDefault();
//   store.currentReminderId = $(this).attr("data-current-reminder-id");
//   remindersUi.updateFormGenerator();
// };
//
const onCreateReminder = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  data.status.status_type = $('#reminder-type-select').val();;
  // data.reminder.reminder_page = true;
  // data.reminder.id = store.currentReminderId;
  // store.reminderPage = data.reminder.reminder_page;
  store.createReminderData = data;
  remindersApi.createReminder(data)
    .then((response) => {
      store.currentReminderId = response.status.id;
      return store.currentReminderId;
    })
    .done(remindersUi.createReminderSuccess)
    .fail(remindersUi.createReminderFailure);
};
//
// const onDeleteReminder = function(event) {
//   event.preventDefault();
//   store.currentReminderId= $("#status-record-delete").attr("data-current-reminder-id");
//   remindersApi.deleteReminder(store.currentReminderId)
//     .done(remindersUi.deleteReminderSuccess)
//     .fail(remindersUi.deleteReminderFailure);
// };
//
// const onUpdateReminder = function(event) {
//   event.preventDefault();
//   let data = getFormFields(event.target);
//   remindersApi.updateReminder(data)
//     .done(remindersUi.updateReminderSuccess)
//     .fail(remindersUi.updateReminderFailure);
// };
//
const onShowReminderCreateForm = function(event) {
  event.preventDefault();
  store.currentJobId = $(this).attr("data-current-job-id");
  remindersUi.showReminderCreateForm();
  // store.currentJobId = $("#job-reminder-create").attr("data-current-job-id");
};

const addHandlers = () => {
  // $('.content').on('submit', '#new-status-form', onCreateStatus);
  // $('.content').on('submit', '#update-status-form', onUpdateReminder);
  // $('.content').on('click', '#status-record-btn-edit', onEditReminder);
  // $('.content').on('click', '#new-job-new-status', onShowReminderCreateForm);
  // $('.content').on('click', '.dashboard-status-record-btn', onShowReminderRecord);
  // $('.content').on('click', '#dashboard-home-btn', onGetReminders);
  // $('.content').on('click', '#status-record-delete', onDeleteReminder);
  // $('.content').on('click', '#job-back-status-overview', onShowReminderRecord);
  $('.content').on('click', '#job-reminder-create', onShowReminderCreateForm);
  $('.content').on('submit', '#new-reminder-form', onCreateReminder);
};

module.exports = {
  addHandlers,
};
