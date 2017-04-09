'use strict';

const store = require('../store');
const displayEditReminder = require('../templates/reminder/update-reminder-form.handlebars');
const displayReminderDashboard = require('../templates/reminder/get-reminders.handlebars');
const displayReminderDetails = require('../templates/reminder/show-reminder-record.handlebars');
const displayReminderCreateForm = require('../templates/reminder/create-reminder.handlebars');
const displaySecondaryReminderContact = require('../templates/reminder/secondary-get-reminders-contacts.handlebars');


const remindersApi = require('./api');
const dashboardLogic = require('../dashboard/logic');

const getReminderSuccess = (data) => {
  $(".notification-container").children().text("");
  store.reminderDataForEdit = data;
  console.log(data);

  $(".content").children().remove();

  let reminderDashboard = displayReminderDashboard({
    reminders: data.reminders
  });

  $('.content').append(reminderDashboard);

  let secondaryReminderContact = displaySecondaryReminderContact({
    reminders: data.reminders
  });

  $('.content').append(secondaryReminderContact);

  dashboardLogic.removeDuplicateRows($('.secondary-table'));

};

const showReminderRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowReminderData = data;

  let reminderDetails = displayReminderDetails({
    reminder: data.reminder
  });
  $('.content').append(reminderDetails);
};

const showReminderRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};

const showReminderCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateReminderForm = displayReminderCreateForm();
  $('.content').append(showCreateReminderForm);
};

const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowReminderData;

  let editReminder = displayEditReminder({
    reminder: data.reminder
  });
  $('.content').append(editReminder);

};

const getReminderFailure = () => {
  $(".notification-container").children().text("");
  console.log('get reminder failure');
};

const createReminderSuccess = (data) => {
  console.log(data);
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Reminder Has Been Successfully Created");

  store.currentReminderId = data.reminder.id;

  let showReminderDetails = displayReminderDetails({
    reminder: data.reminder
  });
  $(".content").append(showReminderDetails);
  $(".current").attr("data-current-reminder-id", store.currentReminderId);
};

const deleteReminderSuccess = () => {
  $(".notification-container").children().text("");
  console.log('delete success');
  remindersApi.getReminders()
    .done(getReminderSuccess)
    .fail(getReminderFailure);
};

const deleteReminderFailure = () => {
  $(".notification-container").children().text("");
  console.log('delete fail');
};

const updateReminderSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".success-alert").text("Reminder Has Been Successfully Updated");
  store.currentReminderId = data.reminder.id;
  $(".content").children().remove();
  console.log(data);
  remindersApi.showReminder()
    .done(showReminderRecordSuccess)
    .fail(showReminderRecordFailure);
};

module.exports = {
  getReminderSuccess,
  showReminderRecordSuccess,
  deleteReminderSuccess,
  deleteReminderFailure,
  updateFormGenerator,
  showReminderCreateForm,
  getReminderFailure,
  updateReminderSuccess,
  showReminderRecordFailure,
  createReminderSuccess,
};
