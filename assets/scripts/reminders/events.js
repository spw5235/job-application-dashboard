'use strict';
const remindersApi = require('./api');
const remindersUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const linkLogic = require('../dashboard/link-logic');
const displayReminderDetails = require('../templates/reminder/show-reminder-record.handlebars');
// Reminder EVENTS

const onGetReminders = function(event) {
  event.preventDefault();
  remindersApi.getReminders()
    .done(remindersUi.getReminderSuccess)
    .fail(remindersUi.getReminderFailure);
};

const onShowReminderRecord = function(event) {
  event.preventDefault();
  store.currentReminderId = $(this).attr("data-current-reminder-id");
  remindersApi.showReminder()
    .done(remindersUi.showReminderRecordSuccess)
    .fail(remindersUi.showReminderRecordFailure);
};

// const onSummaryShowReminder = function(event) {
//   event.preventDefault();
//   store.currentReminderId = (this).attr("data-reminder-id");
//   store.lastShowReminderData = data;
//
//   $(".content").children().remove();
//
//   let reminderDetails = displayReminderDetails({
//     reminder: data.reminder
//   });
//   $('.content').append(reminderDetails);
// }

const onEditReminder = function(event) {
  event.preventDefault();
  store.currentReminderId = $(this).attr("data-current-reminder-id");
  store.currentJobRefId = $(this).attr("data-current-job-ref-id");
  store.currentJobRefText = $(this).attr("data-current-job-ref-text");
  store.currentReminderType = $(this).attr("data-current-reminder-type");

  // Template
  let formCategory = "reminder";
  let listCategory = "job";
  remindersUi.generateUpdateForm(listCategory, formCategory);
};

const onCreateReminder = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);

  let listCategory = "job";

  let submitValue = linkLogic.obtainOptionVal(listCategory);
  data.reminder.job_ref_id = parseInt(submitValue);

  let submitText = linkLogic.obtainOptionText(listCategory);
  data.reminder.job_ref_text = submitText;

  if (submitValue === -1) {
    data.reminder.job_ref_id = 0;
    data.reminder.job_ref_text = "";
  }

  delete data["job-category-radio"];

  data.reminder.reminder_type = $("#reminder-type-select").val();
  data.reminder.reminder_details = $("#reminder-details-field").val();
  store.createReminderData = data;
  store.lastShowReminderData = data;
  remindersApi.createReminder(data)
    .done(remindersUi.createReminderSuccess)
    .fail(remindersUi.createReminderFailure);
};

const onDeleteReminder = function(event) {
  event.preventDefault();
  store.currentReminderId= $("#reminder-record-delete").attr("data-current-reminder-id");
  remindersApi.deleteReminder(store.currentReminderId)
    .done(remindersUi.deleteReminderSuccess)
    .fail(remindersUi.deleteReminderFailure);
};

const onUpdateReminder = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);

  let prevJobRefId = store.currentJobRefId;
  let prevJobRefText = store.currentJobRefText;
  let isRefBeingUpdated = $("#job-update-link").prop("checked");
  let isRadioNoChecked = $("#job-radio-no").prop("checked");
  let isRadioYesChecked = $("#job-radio-yes").prop("checked");
  let isEitherRadioChecked = $("#job-radio-no").prop("checked") || $("#job-radio-yes").prop("checked");

  if (isRefBeingUpdated) {

    if (isEitherRadioChecked) {
      if (isRadioNoChecked) {
        if ( $("#alt-input-entry-job").val() === "") {
          data.reminder.job_ref_text = prevJobRefText;
          data.reminder.job_ref_id = prevJobRefId;
        } else {
          data.reminder.job_ref_text = $("#alt-input-entry-job").val();
          data.reminder.job_ref_id = 0;
        }
      } else if (isRadioYesChecked) {
        let jobRefIdSelected = parseInt($("#select-element-job").val());
        if (jobRefIdSelected === -1) {
          data.reminder.job_ref_id = prevJobRefId;
          data.reminder.job_ref_text = prevJobRefText;
        } else {
          let jobRefIdSelected = $("#select-element-job").val();
          let textValueSelectDiv =  "#select-element-job option[value=" + jobRefIdSelected + "]";
          data.reminder.job_ref_id = jobRefIdSelected;
          data.reminder.job_ref_text = $(textValueSelectDiv).text();
        }
      }
    } else {
      data.reminder.job_ref_text = prevJobRefText;
      data.reminder.job_ref_id = prevJobRefId;
    }
  } else {
    data.reminder.job_ref_text = prevJobRefText;
    data.reminder.job_ref_id = prevJobRefId;
  }

  if (data.reminder.job_ref_text === "Click to Select") {
    data.reminder.job_ref_text = prevJobRefText;
    data.reminder.job_ref_id = prevJobRefId;
  }

  // let listCategory = "job";
  //
  // let refUpdatedDiv = "#" + listCategory + "-update-link";
  //
  // let isRefBeingUpdated = $(refUpdatedDiv).prop("checked");
  //
  // console.log(isRefBeingUpdated);
  //
  // if (isRefBeingUpdated) {
  //   let submitValue = linkLogic.obtainOptionVal(listCategory);
  //
  //   data.reminder.job_ref_id = submitValue;
  //
  //
  //   let submitText = linkLogic.obtainOptionText(listCategory);
  //   data.reminder.job_ref_text = submitText;
  //
  //
  //   if (submitValue === -1) {
  //     data.reminder.job_ref_id = 0;
  //     data.reminder.job_ref_text = "";
  //   }
  // } else {
  //   data.reminder.job_ref_id = parseInt(store.currentJobRefId);
  //   data.reminder.job_ref_text = store.currentJobRefText;
  // }

  data.reminder.reminder_type = $("#reminder-type-select").val();
  data.reminder.reminder_details = $("#reminder-details-field").val();
  store.createReminderData = data;
  store.lastShowReminderData = data;

  remindersApi.updateReminder(data)
    .done(remindersUi.updateReminderSuccess)
    .fail(remindersUi.updateReminderFailure);
};

const onShowReminderCreateForm = function(event) {
  event.preventDefault();
  remindersUi.showReminderCreateForm();
};

const onDisplayJobDropdown = function(event) {
  event.preventDefault();
  let formCategory = "reminder";
  let listCategory = "job";

  let linkContainerSelect = ".display-dropdown-" + listCategory;

  let altFormContainer = ".display-alt-" + listCategory;
  let selectVal = parseInt($(this).val());

  if (selectVal === 1) {
    $(altFormContainer).children().remove();
    linkLogic.showDropOptionsCreatePage(formCategory, listCategory);
  } else {
    $(linkContainerSelect).children().remove();
    linkLogic.altOptionAppend(formCategory, listCategory);
  }
};

const onHideShowCreateOptions = function() {
  let isUpdateChecked = $(this).prop("checked");
  console.log(isUpdateChecked);
  if ( isUpdateChecked ) {
    $("#job-radio-btns-container input").prop("checked", false);
    $("#job-category-radio-container").show();
  } else {
    $("#job-radio-btns-container input").prop("checked", false);
    $("#contact-ref-text-alt-job-container").remove();
    $(".display-dropdown-job").children().remove();
    $("#job-category-radio-container").hide();
  }
};

const onHideShowUpdateOptions = function() {
  let isUpdateChecked = $(this).prop("checked");
  let radioButtonContainer = $(this).parent().parent().parent().children(".update-radio-container-btn");
  console.log(isUpdateChecked);
  if ( isUpdateChecked ) {
    $(".job-radio-container input").prop("checked", false);
    $(radioButtonContainer).show();
  } else {
    $(".job-radio-container input").prop("checked", false);
    $("#reminder-ref-text-alt-job-container").remove();
    $(".display-dropdown-job").children().remove();
    $(radioButtonContainer).hide();
  }
};

const addHandlers = () => {
  $('.content').on('submit', '#new-reminder-form', onCreateReminder);
  $('.content').on('submit', '#update-reminder-form', onUpdateReminder);
  $('.content').on('click', '#reminder-record-btn-edit', onEditReminder);
  $('.content').on('click', '#generate-create-reminder-btn', onShowReminderCreateForm);
  $('.content').on('click', '.view-reminder-record-btn', onShowReminderRecord);
  $('#get-reminders-btn').on('click', onGetReminders);
  $('.content').on('click', '#reminder-record-delete', onDeleteReminder);
  $('.content').on('click', '.get-reminders', onGetReminders);
  // $('.content').on('change', '.job-category', onDisplayJobDropdown);
  $('.content').on('change', "#job-update-link", onHideShowUpdateOptions);
  $('.content').on('change', '.update-job', onDisplayJobDropdown);
  $('.content').on('change', "#job-create-link", onHideShowCreateOptions);
  // $('.content').on('submit', '.view-secondary-reminder-record-btn', onSummaryShowReminder);
};

module.exports = {
  addHandlers,
};
