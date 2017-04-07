'use strict';
const remindersApi = require('./api');
const remindersUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const companiesApi = require('../companies/api');
const jobsApi = require('../jobs/api');

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
const onShowReminderRecord = function(event) {
  event.preventDefault();
  store.currentReminderId = $(this).attr("data-current-reminder-id");
  store.currentJobId = $(this).attr("data-current-job-id");
  store.currentCompanyId = $(this).attr("data-current-company-id");
  remindersApi.showReminder()
    .done(remindersUi.showReminderRecordSuccess)
    .fail(remindersUi.showReminderRecordFailure);
};
//
const onEditReminder = function(event) {
  event.preventDefault();
  store.currentReminderId = $(this).attr("data-current-reminder-id");
  remindersUi.updateFormGenerator();

};
//
const onCreateReminder = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  data.reminder.company_name = store.selectedCompanyName;
  data.reminder.company_ref_id = store.selectedCompanyId;
  data.reminder.job_ref_id = store.selectedJobId;
  data.reminder.job_title = store.selectedJobTitle;
  data.reminder.reminder_type = $('#reminder-type-select').val();
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
const onUpdateReminder = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  data.reminder.company_name = store.selectedCompanyName;
  data.reminder.company_ref_id = store.selectedCompanyId;
  data.reminder.job_ref_id = store.selectedJobId;
  data.reminder.job_title = store.selectedJobTitle;
  data.reminder.reminder_type = $('#reminder-type-select').val();
  remindersApi.updateReminder(data)
    .done(remindersUi.updateReminderSuccess)
    .fail(remindersUi.updateReminderFailure);
};
//
const onShowReminderCreateForm = function(event) {
  event.preventDefault();
  store.currentCompanyId = $(this).attr("data-current-company-id");
  remindersUi.showReminderCreateForm();
};

const onSelectOptionCompanyVal = function() {

  let obtainVal = $(this).val();

  if (obtainVal === 0) {
    let valueString = '#select-option-job-title option[value=' + obtainVal + ']';

    $(valueString).prop('selected',true);
  }

  let obtainValString = '#select-option-company-name option[value="' + obtainVal + '"]';
  console.log(obtainValString);
  let companyName = $(obtainValString).text();
  console.log(companyName);

  store.selectedCompanyId = obtainVal;
  store.selectedCompanyName = companyName;

  let currentSelectedValue = $("#select-option-company-name").val();

  if( currentSelectedValue === 0 ) {
    console.log('error');
  } else {
    jobsApi.getJobsDropdown(obtainVal)
      .done(remindersUi.displayJobDropdownSuccess)
      .fail(remindersUi.displayJobDropdownFail);
  }
};

const onSelectOptionJobVal = function() {
  let obtainVal = $(this).val();
  let obtainValString = '#select-option-job-title option[value="' + obtainVal + '"]';
  console.log(obtainValString);
  let jobTitle = $(obtainValString).text();
  console.log(jobTitle);

  store.selectedJobId = obtainVal;
  store.selectedJobTitle = jobTitle;

  let currentSelectedValue = $("#select-option-job-title").val();

  if( currentSelectedValue === 0 ) {
    console.log('error');
  } else {
    console.log('done');
  }
};

const onDisplayCompanyDropdown = function() {
  if (this.checked) {
    let currentReminderCompanyId = $("#associate-reminder-with-company").attr("data-current-company-id");

    if ( currentReminderCompanyId === 0 ) {
      $("#company-select-options").remove();
      $("#job-select-options").remove();
      return;
    }

    companiesApi.getCompanies()
      .done(remindersUi.displayCompanyDropdownSuccess)
      .fail(remindersUi.displayCompanyDropdownFail);
  } else {
    $("#company-select-options").remove();
    $("#job-select-options").remove();
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

const searchReminders = function() {
  let input, filter, table, tr, td, i;
  input = document.getElementById("search-reminder-input");
  filter = input.value.toUpperCase();
  table = document.getElementById("reminder-summary-table");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
};

const addHandlers = () => {
  // $('.content').on('submit', '#new-reminder-form', onCreateReminder);
  $('.content').on('submit', '#update-reminder-form', onUpdateReminder);
  $('.content').on('click', '#reminder-record-btn-edit', onEditReminder);
  // $('.content').on('click', '#new-job-new-reminder', onShowReminderCreateForm);
  $('.content').on('click', '.view-reminder-record-btn', onShowReminderRecord);
  // $('.content').on('click', '#dashboard-home-btn', onGetReminders);
  // $('.content').on('click', '#reminder-record-delete', onDeleteReminder);
  // $('.content').on('click', '#job-back-reminder-overview', onShowReminderRecord);
  $('.content').on('click', '#job-reminder-create', onShowReminderCreateForm);
  $('.content').on('submit', '#new-reminder-form', onCreateReminder);
  $('.content').on('change', '#associate-reminder-with-company', onDisplayCompanyDropdown);
  $('.content').on('change', '#select-option-company-name', onSelectOptionCompanyVal);
  $('.content').on('change', '#select-option-job-title', onSelectOptionJobVal);
  $('.content').on('keyup', '#search-reminder-input', searchReminders);
};

module.exports = {
  addHandlers,
};
