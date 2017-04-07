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

  // let isCheckedCompany = $("#associate-reminder-with-company").prop("checked");
  // let isCheckedJob = $("#associate-reminder-with-Job").prop("checked");


  let selectedComp = $("#select-option-company-name").val();
  console.log(selectedComp);

  data.reminder.company_name = store.selectedCompanyName;
  data.reminder.company_ref_id = store.selectedCompanyId;

  // if (!isCheckedCompany) {
  //   data.reminder.company_name = 0;
  //   data.reminder.company_ref_id = 0;
  //   data.reminder.job_ref_id = 0;
  //   data.reminder.job_title = 0;
  // } else if ( isCheckedCompany && !isCheckedJob) {
  //   data.reminder.job_ref_id = 0;
  //   data.reminder.job_title = 0;
  //   console.log('in here');
  //   console.log(data.reminder.company_name);
  //   if (data.reminder.company_name === undefined) {
  //     data.reminder.company_name = 0;
  //     data.reminder.company_ref_id = 0;
  //   } else {
  //     data.reminder.company_name = store.selectedCompanyName;
  //     data.reminder.company_ref_id = store.selectedCompanyId;
  //   }
  // } else {
  //   data.reminder.company_name = store.selectedCompanyName;
  //   data.reminder.company_ref_id = store.selectedCompanyId;
  //   if (data.reminder.job_title === undefined) {
  //     data.reminder.job_title = 0;
  //     data.reminder.job_ref_id = 0;
  //   } else {
  //     data.reminder.job_ref_id = store.selectedJobId;
  //     data.reminder.job_title = store.selectedJobTitle;
  //   }
  // }

  console.log('values of create');
  console.log(data.reminder.company_name);
  console.log(data.reminder.company_ref_id);
  // console.log(data.reminder.job_ref_id);
  // console.log(data.reminder.job_title);

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

  if (obtainVal === 0 || obtainVal === "0") {
    let valueString = '#select-option-job-title option[value=0]';
    $(valueString).prop('selected',true);
    store.selectedCompanyId = 0;
    store.selectedCompanyName = 0;
    // $("#job-select-options").remove();
    store.selectedJobId = 0;
    store.selectedJobTitle = 0;
    $("#associate-reminder-with-job").prop("checked", false);
    $(".association-job-insert").remove();
  }

  let obtainValString = '#select-option-company-name option[value="' + obtainVal + '"]';
  let companyName = $(obtainValString).text();

  store.selectedCompanyId = obtainVal;
  store.selectedCompanyName = companyName;

  if (obtainVal > 0) {
    $("#company-select-options").append('<div class="form-group association-job-insert"><label>Associate Reminder With Specific Job?</label><div class="form-group associate-reminder-with-job-container"><span>Check Box for Yes</span><input id="associate-reminder-with-job" type="checkbox" value=""></div></div>');
  }


  // let currentSelectedValue = $("#select-option-company-name").val();

  // if( currentSelectedValue === 0 ) {
  //   console.log('error');
  // } else {
  //   jobsApi.getJobsDropdown(obtainVal)
  //     .done(remindersUi.displayJobDropdownSuccess)
  //     .fail(remindersUi.displayJobDropdownFail);
  // }
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

  let isUpdateForm = $(".reminder-form").attr("data-update-form");

  console.log(isUpdateForm === "true");

  if (this.checked) {
    let currentReminderCompanyId = $("#associate-reminder-with-company").attr("data-current-company-id");

    if ( currentReminderCompanyId === 0 ) {
      $("#company-select-options").remove();
      $("#job-select-options").remove();
      $(".display-job-title").children().remove();
      return;
    }

    companiesApi.getCompanies()
      .done(remindersUi.displayCompanyDropdownSuccess)
      .fail(remindersUi.displayCompanyDropdownFail);
  } else {
    $("associate-reminder-with-company").val(0);
    $("#company-select-options").remove();
    $("#job-select-options").remove();
    $(".display-job-title").children().remove();
    $(".association-job-insert").remove();
    console.log("remove");
  }

  let selectedVal = $("#select-option-company-name").val();
  let selectedValInt = parseInt(selectedVal);

  // let currentReminderCompanyIdInt = parseInt(currentReminderCompanyId);


  if (selectedValInt > 0) {
      $("#company-select-options").append('<div class="form-group"><label>Associate Reminder With Specific Job?</label><div class="form-group associate-reminder-with-job-container"><span>Check Box for Yes</span><input id="associate-reminder-with-job" type="checkbox" value=""></div></div>');
  }

};



const onDisplayJobDropdown = function() {

  let isUpdateForm = $(".reminder-form").attr("data-update-form");

  console.log(isUpdateForm === "true");

  let isJobChecked = $("#associate-reminder-with-job").prop("checked");

  if (isJobChecked) {
    let currentReminderCompanyId = $("#select-option-company-name").val();

    // if ( currentReminderJobId === 0 ) {
    //   $("#job-select-options").remove();
    //   store.selectedJobId = 0;
    //   store.selectedJobTitle = 0;
    //   return;
    // }

    jobsApi.getJobsById(currentReminderCompanyId)
      .done(remindersUi.displayJobDropdownSuccess)
      .fail(remindersUi.displayJobDropdownFail);
  } else {
    $("#job-select-options").remove();
    store.selectedJobId = 0;
    store.selectedJobTitle = 0;
    console.log("remove");
  }
};




//
// const onDisplayJobDropdown = function() {
//
//   let isUpdateForm = $(".reminder-form").attr("data-update-form");
//
//   console.log(isUpdateForm === "true");
//
//   if (this.checked) {
//     let currentReminderJobId = $("#associate-reminder-with-job").attr("data-current-job-id");
//
//     if ( currentReminderJobId === 0 ) {
//       $("#company-select-options").remove();
//       $("#job-select-options").remove();
//       return;
//     } else {
      // jobsApi.getJobs()
      //   .done(remindersUi.displayJobDropdownSuccess)
      //   .fail(remindersUi.displayJobDropdownFail);
//     }
//   } else {
//     $("associate-reminder-with-job").val(0);
//     $("#job-select-options").remove();
//   }
// };

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
  $('.content').on('change', '#associate-reminder-with-job', onDisplayJobDropdown);
  $('.content').on('change', '#select-option-company-name', onSelectOptionCompanyVal);
  $('.content').on('change', '#select-option-job-title', onSelectOptionJobVal);
  $('.content').on('keyup', '#search-reminder-input', searchReminders);
};

module.exports = {
  addHandlers,
};
