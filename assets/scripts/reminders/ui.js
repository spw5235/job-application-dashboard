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
const logic = require('../dashboard/logic');

const getReminderSuccess = (data) => {
  $(".notification-container").children().text("");
  store.reminderDataForEdit = data;

  $(".content").children().remove();

  let remindersArr = data.reminders;

  for (let i = 0; i < remindersArr.length; i++ ) {
    let unavailable = "N/A";
    let currArrayRefText = (remindersArr[i].job_ref_text);
    let currArrayReminderDate = (remindersArr[i].reminder_date);
    let currArrayReminderDetails = (remindersArr[i].reminder_details);

    if (currArrayRefText === "" || currArrayRefText === null) {
      remindersArr[i].job_ref_text = unavailable;
    }
    if (currArrayReminderDate === "" || currArrayReminderDate === null) {
      remindersArr[i].reminder_date = unavailable;
    }
    if (currArrayReminderDetails === "" || currArrayReminderDetails === null) {
      remindersArr[i].reminder_details = unavailable;
    }
  }

  let reminderDashboard = displayReminderDashboard({
    reminders: data.reminders
  });

  $('.content').append(reminderDashboard);

  let allRemindersEmptyLength = $("#reminder-summary-table tbody").children().length;

  if (allRemindersEmptyLength === 0) {
    $("#reminder-summary-table").remove();
    $(".all-reminders-empty").text('There are no reminders associated with your account. Click "Create Reminder" to get started.');
  }

  logic.dateFormatByClass();

};

const showReminderRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowReminderData = data;
  // data.reminder.reminder_date = logic.formatDate(data.reminder.reminder_date)

  let reminderDetails = displayReminderDetails({
    reminder: data.reminder
  });
  $('.content').append(reminderDetails);
  logic.dateFormatByClass();
};

const showReminderRecordFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be retrieved");
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
  $("#job-category-radio-container").hide();
  let defaultDate = logic.defaultDate();
  $(".default-date").val(defaultDate);
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

  let preselectVal = store.currentReminderType;
  let preselectDiv = "#reminder-type-select";
  linkLogic.preselectDefault(preselectDiv, preselectVal);

  let divId = "#reminder-details-field";
  logic.textAreaHeightUpdate(divId);
};

const getReminderFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the records could not be retrieved");
};

const createReminderSuccess = (data) => {
  store.currentReminderId = data.reminder.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Reminder Has Been Successfully Created");

  let showReminderDetails = displayReminderDetails({
    reminder: data.reminder
  });

  $(".content").append(showReminderDetails);
  $("#reminder-record-btn-edit").attr("data-current-reminder-type", data.reminder.reminder_type);
  $(".current").attr("data-current-reminder-id", store.currentReminderId);
  logic.dateFormatByClass();
};

const deleteReminderSuccess = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be deleted.");
  logic.dateFormatByClass();
  remindersApi.getReminders()
    .done(getReminderSuccess)
    .fail(getReminderFailure);
};

const deleteReminderFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the records could not be deleted");
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
  logic.dateFormatByClass();
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

const createReminderFailure = function() {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be created.  Please make sure all required fields are complete");
};

const updateReminderFailure = function() {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be updated.  Please make sure all required fields are complete");
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
  generateUpdateForm,
  createReminderFailure,
  updateReminderFailure,
};
