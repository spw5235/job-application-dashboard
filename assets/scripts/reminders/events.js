'use strict';
const remindersApi = require('./api');
const remindersUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const companiesApi = require('../companies/api');
// const logic = require('./logic');

// STUDENT EVENTS

// const onGetReminders = function(event) {
//   event.preventDefault();
//   remindersApi.getReminders()
//     .done(remindersUi.getReminderSuccess)
//     .fail(remindersUi.getReminderFailure);
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
  data.reminder.reminder_type = $('#reminder-type-select').val();
  // data.reminder.reminder_page = true;
  // data.reminder.id = store.currentReminderId;
  // store.reminderPage = data.reminder.reminder_page;
  store.createReminderData = data;
  remindersApi.createReminder(data)
    .then((response) => {
      store.currentReminderId = response.reminder.id;
      return store.currentReminderId;
    })
    .done(remindersUi.createReminderSuccess)
    .fail(remindersUi.createReminderFailure);
};
//
// const onDeleteReminder = function(event) {
//   event.preventDefault();
//   store.currentReminderId= $("#reminder-record-delete").attr("data-current-reminder-id");
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
  store.currentCompanyId = $(this).attr("data-current-company-id");
  remindersUi.showReminderCreateForm();
};

const onSelectOptionCompanyVal = function() {
  let obtainVal = $(this).val();
  let obtainValString = '#select-option-company-name option[value="' + obtainVal + '"]';
  console.log(obtainValString);
  let companyName = $(obtainValString).text();
  console.log(companyName);

  store.selectedCompanyId = obtainVal;
  store.selectedCompanyName = companyName;

  let currentSelectedValue = $("#select-option-company-name").val();

  if( currentSelectedValue === "blank" ) {
    console.log('error');
  } else {
    console.log('run get for job');
  }
};

const onDisplayCompanyDropdown = function() {
  if (this.checked) {
    companiesApi.getCompanies()
      .done(remindersUi.displayCompanyDropdownSuccess)
      .fail(remindersUi.displayCompanyDropdownFail);
  } else {
    $("#company-select-options").remove();
    console.log("remove");
  }

  // if (isChecked) {
  //   companiesApi.getCompanies()
  //     .done(remindersUi.displayCompanyDropdownSuccess)
  //     .fail(remindersUi.displayCompanyDropdownFail);
  // } else {
  //   $("#company-select-options").hide();
  // }
};

const addHandlers = () => {
  // $('.content').on('submit', '#new-reminder-form', onCreateReminder);
  // $('.content').on('submit', '#update-reminder-form', onUpdateReminder);
  // $('.content').on('click', '#reminder-record-btn-edit', onEditReminder);
  // $('.content').on('click', '#new-job-new-reminder', onShowReminderCreateForm);
  // $('.content').on('click', '.dashboard-reminder-record-btn', onShowReminderRecord);
  // $('.content').on('click', '#dashboard-home-btn', onGetReminders);
  // $('.content').on('click', '#reminder-record-delete', onDeleteReminder);
  // $('.content').on('click', '#job-back-reminder-overview', onShowReminderRecord);
  $('.content').on('click', '#job-reminder-create', onShowReminderCreateForm);
  $('.content').on('submit', '#new-reminder-form', onCreateReminder);
  $('.content').on('click', '#associate-reminder-with-company', onDisplayCompanyDropdown);
  $('.content').on('change', '#select-option-company-name', onSelectOptionCompanyVal);
};

module.exports = {
  addHandlers,
};
