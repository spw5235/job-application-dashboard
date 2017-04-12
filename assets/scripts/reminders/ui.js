'use strict';

const store = require('../store');
const displayEditReminder = require('../templates/reminder/update-reminder-form.handlebars');
const displayReminderDashboard = require('../templates/reminder/get-reminders.handlebars');
const displayReminderDetails = require('../templates/reminder/show-reminder-record.handlebars');
const displayReminderCreateForm = require('../templates/reminder/create-reminder.handlebars');
const remindersApi = require('./api');
const displayRadioButtonsTemplate = require('../templates/form-template/radio-btn-template.handlebars');
const displayReminderOptions = require('../templates/reminder/option-dropdown-reminders.handlebars');
const linkLogic = require('../dashboard/link-logic');

const getReminderSuccess = (data) => {
  $(".notification-container").children().text("");
  store.reminderDataForEdit = data;

  $(".content").children().remove();

  let reminderDashboard = displayReminderDashboard({
    reminders: data.reminders
  });

  $('.content').append(reminderDashboard);

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
  let listCategory = "job";
  let formCategory = "reminder";


  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateReminderForm = displayReminderCreateForm();
  $('.content').append(showCreateReminderForm);

  let radioTemplate = displayRadioButtonsTemplate();
  $("#" + listCategory + "-category-radio-container").append(radioTemplate);

  linkLogic.radioClassIdNameGen(formCategory, listCategory);
};


const generateUpdateForm = function(listCategory, formCategory) {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowReminderData;

  let editReminder = displayEditReminder({
    reminder: data.reminder
  });
  $('.content').append(editReminder);

  let listLinkStatusSelector = "." + listCategory + "-tag-status";
  let listRefId = parseInt(store.currentJobRefId);

  if (listRefId > 0) {
    $(listLinkStatusSelector).text("Linked");
  }

  let updateFormId = "#update-" + formCategory + "-form";
  let updateFormStatus = parseInt($(updateFormId).attr("data-update-form"));

  if ( updateFormStatus === 1) {
    let categoryText = "." + listCategory + "-radio-container ";
    $(categoryText).show();
    $(".update-radio-container-btn").hide();
  }

  let currentRefTextValTxt = "." + listCategory + "-update-radio-text";

  if (store.currentJobRefText === "") {
    $(currentRefTextValTxt).text("N/A");
  }

};

const getReminderFailure = () => {
  $(".notification-container").children().text("");
  console.log('get reminder failure');
};

const createReminderSuccess = (data) => {
  console.log("createsucces");
  console.log(data);
  store.currentReminderId = data.reminder.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Reminder Has Been Successfully Created");

  let showReminderDetails = displayReminderDetails({
    reminder: store.createReminderData.reminder
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

  store.currentReminderId = data.reminder.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Reminder Has Been Successfully Updated");

  let showReminderDetails = displayReminderDetails({
    reminder: data.reminder
  });
  $(".content").append(showReminderDetails);
  $(".current").attr("data-current-reminder-id", store.currentReminderId);
};

const displayReminderDropdownSuccess = function(data) {
  $(".notification-container").children().text("");

  let companyOptionDisplay = displayReminderOptions({
    reminders: data.reminders
  });

  let dataUpdateFormVal = parseInt($("#update-reminder-form").attr("data-update-form"));

  $('.associate-reminder-with-reminder-container').append(companyOptionDisplay);

  if (dataUpdateFormVal === 1) {
    let currentReminderId = store.currentReminderId;
    let valueString = '#select-option-reminder-name option[value=' + currentReminderId + ']';
    $(valueString).prop('selected', true);
  }
};

const dropDownData = function(data) {
  console.log(data);
};

module.exports = {
  getReminderSuccess,
  showReminderRecordSuccess,
  deleteReminderSuccess,
  deleteReminderFailure,
  showReminderCreateForm,
  getReminderFailure,
  updateReminderSuccess,
  showReminderRecordFailure,
  createReminderSuccess,
  displayReminderDropdownSuccess,
  displayReminderOptions,
  dropDownData,
  generateUpdateForm,
};

//
//
//
//
//
//
//
//
//
//
//
// 'use strict';
//
// const store = require('../store');
// const displayEditReminder = require('../templates/reminder/update-reminder-form.handlebars');
// const displayReminderDashboard = require('../templates/reminder/get-reminders.handlebars');
// const displayReminderDetails = require('../templates/reminder/show-reminder-record.handlebars');
// const displayReminderCreateForm = require('../templates/reminder/create-reminder.handlebars');
// const displaySecondaryReminderContact = require('../templates/reminder/secondary-get-reminders-contacts.handlebars');
//
//
// const remindersApi = require('./api');
// const dashboardLogic = require('../dashboard/logic');
//
// const getReminderSuccess = (data) => {
//   $(".notification-container").children().text("");
//   store.reminderDataForEdit = data;
//   console.log(data);
//
//   $(".content").children().remove();
//
//   let reminderDashboard = displayReminderDashboard({
//     reminders: data.reminders
//   });
//
//   $('.content').append(reminderDashboard);
//
//   let secondaryReminderContact = displaySecondaryReminderContact({
//     reminders: data.reminders
//   });
//
//   $('.content').append(secondaryReminderContact);
//
//   dashboardLogic.removeDuplicateRows($('.secondary-table'));
//
// };
//
// const showReminderRecordSuccess = (data) => {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   store.lastShowReminderData = data;
//
//   let reminderDetails = displayReminderDetails({
//     reminder: data.reminder
//   });
//   $('.content').append(reminderDetails);
// };
//
// const showReminderRecordFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('failure');
// };
//
// const showReminderCreateForm = () => {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   let showCreateReminderForm = displayReminderCreateForm();
//   $('.content').append(showCreateReminderForm);
// };
//
// const updateFormGenerator = function() {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//
//   let data = store.lastShowReminderData;
//
//   let editReminder = displayEditReminder({
//     reminder: data.reminder
//   });
//   $('.content').append(editReminder);
//
// };
//
// const getReminderFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('get reminder failure');
// };
//
// const createReminderSuccess = (data) => {
//   console.log(data);
//   $(".form-error").text("");
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   $(".success-alert").text("Reminder Has Been Successfully Created");
//
//   store.currentReminderId = data.reminder.id;
//
//   let showReminderDetails = displayReminderDetails({
//     reminder: data.reminder
//   });
//   $(".content").append(showReminderDetails);
//   $(".current").attr("data-current-reminder-id", store.currentReminderId);
// };
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
//   console.log(data);
//   remindersApi.showReminder()
//     .done(showReminderRecordSuccess)
//     .fail(showReminderRecordFailure);
// };
//
// module.exports = {
//   getReminderSuccess,
//   showReminderRecordSuccess,
//   deleteReminderSuccess,
//   deleteReminderFailure,
//   updateFormGenerator,
//   showReminderCreateForm,
//   getReminderFailure,
//   updateReminderSuccess,
//   showReminderRecordFailure,
//   createReminderSuccess,
// };
