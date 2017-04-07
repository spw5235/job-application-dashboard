'use strict';

const store = require('../store');
const displayReminderDetails = require('../templates/reminder/show-reminder-record.handlebars');
const displayReminderCreateForm = require('../templates/reminder/create-reminder.handlebars');
const displayCompanyDashboard = require('../templates/reminder/display-company-create-form.handlebars');
const displayJobDashboard = require('../templates/reminder/display-job-create-form.handlebars');
const displayEditReminder = require('../templates/reminder/update-reminder-form.handlebars');
const companiesApi = require('../companies/api');
const jobsApi = require('../jobs/api');
const remindersApi = require('./api');
const displayReminderDashboard = require('../templates/reminder/get-reminders.handlebars');

// Reminder UI

const displayJobDropdownFailure = () => {
  console.log('failure');
};

const displayJobDropdownSuccess = (data) => {

  $(".notification-container").children().text("");

  let jobOptionDisplay = displayJobDashboard({
    jobs: data.jobs
  });

  $('.display-job-title').append(jobOptionDisplay);

  let currentReminderJobId = $("#associate-reminder-with-company").attr("data-current-job-id");

  $("#associate-reminder-with-company").val(currentReminderJobId);

  let valueString = '#select-option-job-title option[value=' + currentReminderJobId + ']';

  $(valueString).prop('selected',true);

};

const displayJobsDropdownFail = function() {
  console.log("failure");
};

const determineCompany = function() {
  let jobId = $("#associate-reminder-with-company").attr("data-current-job-id");
  jobId = parseInt(jobId);

  if (jobId > 0) {
    $(".display-job-title").append('<div class="form-group"><label>Associate Reminder With Specific Job?</label><div class="form-group associate-reminder-with-job-container"><span>Check Box for Yes</span><input id="associate-reminder-with-job" type="checkbox" value=""></div></div>');
    $("#associate-reminder-with-job").prop("checked", true);
    console.log('in here now');

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
        .done(displayJobDropdownSuccess)
        .fail(displayJobDropdownFail);
    } else {
      $("#job-select-options").remove();
      store.selectedJobId = 0;
      store.selectedJobTitle = "";
      console.log("remove");
    }
  }
};


const displayCompanyDropdownSuccess = function(data) {
  $(".notification-container").children().text("");
  $(".association-job-insert").remove();

  console.log(data.companies);

  let companyOptionDisplay = displayCompanyDashboard({
    companies: data.companies
  });

  let selectedVal = $("#select-option-company-name").val();
  let selectedValInt = parseInt(selectedVal)

  let currentReminderCompanyId = $("#associate-reminder-with-company").attr("data-current-company-id");

  // let currentReminderCompanyIdInt = parseInt(currentReminderCompanyId);


  if (selectedValInt) {
      $(".display-job-title").append('<div class="form-group"><label>Associate Reminder With Specific Job?</label><div class="form-group associate-reminder-with-job-container"><span>Check Box for Yes</span><input id="associate-reminder-with-job" type="checkbox" value=""></div></div>');
  } else {
    $(".association-job-insert").remove();
  }

  // let currentReminderCompanyName = $("#associate-reminder-with-company").attr("data-current-company-name");
  // let currentReminderJobId = $("#associate-reminder-with-company").attr("data-current-job-id");
  // let currentReminderJobTitle = $("#associate-reminder-with-company").attr("data-current-job-title");

  $('.associate-reminder-with-company-container').append(companyOptionDisplay);

  $("#associate-reminder-with-company").val(currentReminderCompanyId);

  let valueString = '#select-option-company-name option[value=' + currentReminderCompanyId + ']';

  $(valueString).prop('selected',true);

  // let currentReminderJobId = $("#associate-reminder-with-company").attr("data-current-job-id");
  //
  // let hasJob;

  // if ( currentReminderJobId > 0 ) {
  //   hasJob = true;
  //   console.log('has - job')
  // } else {
  //   hasJob = false;
  // }
  //
  // if (hasJob) {
  //   jobsApi.getJobs()
  //     .done(displayJobDropdownSuccess)
  //     .fail(displayJobsDropdownFail);
  //
  // }
  let updateForm = $(".reminder-form").attr("data-update-form");
  updateForm = parseInt(updateForm);

  console.log(updateForm);
  if ( updateForm === 1) {
    determineCompany();
  }



};

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


const getReminderSuccess = (data) => {
  $(".notification-container").children().text("");
  store.reminderPage = false;
  store.currentReminderId = 0;
  store.currentJobId = 0;
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

const displayCompanyDropdownFail = function() {
  console.log("displayCompanyDropdownFail");
};

const showReminderCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateForm = displayReminderCreateForm();
  $('.content').append(showCreateForm);
  $(".current").attr("data-current-job-id", store.currentJobId);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
};

const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowReminderData;
  console.log(data.reminder);

  let editReminder = displayEditReminder({
    reminder: data.reminder
  });
  $('.content').append(editReminder);

  // Determine Placeholder

  let currentOptionType = $("#reminder-type-select").attr("data-reminder-type");
  console.log(currentOptionType);

  if ( currentOptionType === "Action" ) {
    $(".option-one").val("Action");
    $(".option-one").text("Action");
    $(".option-two").val("Pending");
    $(".option-two").text("Pending");
  } else if ( currentOptionType === "Pending" ) {
    $(".option-one").val("Pending");
    $(".option-one").text("Pending");
    $(".option-two").val("Action");
    $(".option-two").text("Action");
  }

  $(".current").attr("data-current-job-id", store.currentJobId);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
  $(".current").attr("data-current-reminder-id", store.currentReminderId);

  let currentReminderCompanyId = $("#associate-reminder-with-company").attr("data-current-company-id");
  currentReminderCompanyId = parseInt(currentReminderCompanyId);

  let hasCompany;

  if ( currentReminderCompanyId > 0 ) {
    hasCompany = true;
  } else {
    hasCompany = false;
  }

  if (hasCompany) {
    $("#associate-reminder-with-company").prop('checked', true);
    companiesApi.getCompanies()
      .done(displayCompanyDropdownSuccess)
      .fail(displayCompanyDropdownFail);

  }
};

const getReminderFailure = () => {
  $(".notification-container").children().text("");
  console.log('get reminder failure');
};

const createReminderSuccess = () => {
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Reminder Has Been Successfully Created");
  store.reminderPage = true;
  let data = store.createReminderData;
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
  $(".form-error").text("");
  $(".notification-container").children().text("");
  store.currentReminderId = data.reminder.id;
  $(".content").children().remove();
  $(".success-alert").text("Reminder Has Been Successfully Updated");

  let showReminderDetails = displayReminderDetails({
    reminder: data.reminder
  });
  $(".content").append(showReminderDetails);
  $(".current").attr("data-current-reminder-id", store.currentReminderId);




  // $(".notification-container").children().text("");
  // $(".success-alert").text("Reminder Has Been Successfully Updated");
  // store.currentReminderId = data.reminder.id;
  // $(".content").children().remove();
  // remindersApi.showReminder()
  //   .done(showReminderRecordSuccess)
  //   .fail(showReminderRecordFailure);
};

const updateReminderFailure = () => {
  $(".notification-container").children().text("");
  $("#update-reminder-error").text("Error: Reminder not updated.  Please ensure all required fields have values");
};

const createReminderFailure = function() {
  console.log('failure');
};

const displayCompanyDropdownFailure = function() {
  console.log('fail');
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
  updateFormGenerator,
  updateReminderFailure,
  updateReminderSuccess,
  deleteReminderSuccess,
  deleteReminderFailure,
  displayJobsDropdownFail,
};
