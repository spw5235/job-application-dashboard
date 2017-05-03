'use strict';
const jobsApi = require('./api');
const jobsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const logic = require('../dashboard/logic');

// Job EVENTS

const onGetJobs = function(event) {
  event.preventDefault();
  let screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    $(".nav-mobile-ul").slideUp();
  }
  jobsApi.getJobs()
    .done(jobsUi.getJobSuccess)
    .fail(jobsUi.getJobFailure);
};

const onShowJobRecord = function(event) {
  event.preventDefault();
  store.currentJobId = $(this).attr("data-current-job-id");
  jobsApi.showJob()
    .done(jobsUi.showJobRecordSuccess)
    .fail(jobsUi.showJobRecordFailure);
};

const onEditJob = function(event) {
  event.preventDefault();
  store.currentJobId = $(this).attr("data-current-job-id");
  store.currentJobRefId = $(this).attr("data-current-job-ref-id");
  store.currentJobRefText = $(this).attr("data-current-job-ref-text");

  // Template
  let formCategory = "job";
  let listCategory = "job";
  jobsUi.generateUpdateForm(listCategory, formCategory);
};

const onCreateJob = function(event) {
  event.preventDefault();

  let createDefaultReminder = $("#default-reminder-input").prop("checked");

  if (createDefaultReminder === "true" || createDefaultReminder === true) {
    store.addDefaultReminder = true;
  } else {
    store.addDefaultReminder = false;
  }

  logic.convertPercentage();
  let data = getFormFields(event.target);

  data.job.notes = $("#job-notes-input").val();
  data.job.job_description = $("#job-description-input").val();

  data.job.post_url = logic.convertToUrl(data.job.post_url);

  let isJobAppliedChecked = $('#job-applied-checkbox').prop("checked");

  if (isJobAppliedChecked === "true" || isJobAppliedChecked === true) {
    data.job.applied = true;
  } else {
    data.job.applied = false;
  }

  store.lastShowJobData = data;
  // data.job.posting_date = logic.formatDate(data.job.posting_date);
  // data.job.deadline = logic.formatDate(data.job.deadline);
  store.createJobData = data;

  jobsApi.createJob(data)
    .done(jobsUi.createDefaultReminderSuccess)
    .fail(jobsUi.createJobFailure);
};

const onDeleteJob = function(event) {
  event.preventDefault();
  store.currentJobId = $("#job-record-delete").attr("data-current-job-id");


  jobsApi.deleteJob(store.currentJobId)
    .done(jobsUi.deleteJobSuccess)
    .fail(jobsUi.deleteJobFailure);
};

const onUpdateJob = function(event) {
  event.preventDefault();
  logic.convertPercentage();
  let data = getFormFields(event.target);

  store.createJobData = data;
  store.lastShowJobData = data;

  data.job.notes = $("#job-notes-input").val();

  data.job.job_description = $("#job-description-input").val();

  data.job.post_url = logic.convertToUrl(data.job.post_url);

  data.job.company_name = $(".company-name-update-form").text();

  let isJobAppliedChecked = $('#job-applied-checkbox').prop("checked");

  let isJobRadioAppliedShown = $("#job-radio-applied-no").prop("checked");
  let jobAppliedOriginalVal = $("#job-radio-applied-no").attr("data-original-applied-val");
  // let dataOriginalValAttribute = $("#job-radio-applied-no").attr("data-original-applied-val");
  let dataOriginalDateAttribute = $("#job-radio-applied-no").attr("data-original-date-val");

  if (jobAppliedOriginalVal === "true") {
    jobAppliedOriginalVal = true;
  } else {
    jobAppliedOriginalVal = false;
  }

  // console.log(jobAppliedOriginalVal);

  if (!isJobRadioAppliedShown) {
    if (isJobAppliedChecked) {
      data.job.applied = true;
    } else {
      data.job.applied = false;
    }
  }

  if (isJobRadioAppliedShown) {
    data.job.applied = jobAppliedOriginalVal;
    data.job.date_applied = dataOriginalDateAttribute;
  }

  store.createJobData = data;
  store.lastShowJobData = data;

  jobsApi.updateJob(data)
    .done(jobsUi.updateJobSuccess)
    .fail(jobsUi.updateJobFailure);
};

const onShowJobCreateForm = function(event) {
  event.preventDefault();
  jobsUi.showJobCreateForm();
};

const onShowDeleteMenu = function(event) {
  event.preventDefault();
  $('.job-record-btn-options').hide();
  $(".delete-confirmation-contain").show();
};

const resizeTextArea = function() {
    let divId = $(this).attr("id");
    logic.onResizeTextarea(divId);
};

const onAppliedForJob = function(event) {
  event.preventDefault();

  let isCurrentlyChecked = $(this).prop("checked");
  // console.log(isCurrentlyChecked);
  let defaultDate = logic.defaultDate();

  if (isCurrentlyChecked) {
    $(this).prop("checked", true);
    $(".job-applied-date-container").show();
    let isUpdateForm = parseInt($("#job-applied-date-field").attr("data-attr-update-form"));
    let isNewDate = $("#job-applied-date-field").val();
    if (isUpdateForm === 0) {
      $("#job-applied-date-field").val(defaultDate);
    }

    if (isUpdateForm === 1) {
      let alreadyApplied = $("#job-applied-checkbox").attr("data-attr-applied");
      if (isNewDate === "" && alreadyApplied === "false") {
        $("#job-applied-date-field").val(defaultDate);
      }
    }

  } else {
    $(this).prop("checked", false);
    $(".job-applied-date-container").hide();
    $("#job-applied-date-field").val(null);
  }

};

const onShowAppliedUpdate = function(event) {
  event.preventDefault();

  const currentVal = parseInt($(this).val());
  // console.log(currentVal);

  if (currentVal === 1) {
    // $("#job-radio-applied-no").prop("checked", false);
    $("#job-radio-applied-yes").prop("checked", true);
    $(".update-application-status-container").show();

    // let applicationStatus = $("#job-applied-checkbox").attr("data-attr-applied");
    // console.log(applicationStatus);

    // console.log(applicationStatus === "true");
    // if (applicationStatus === "true") {
    //   $("#job-applied-date-update-field").show();
    //   $("#job-applied-checkbox").click();
    // }
    let alreadyApplied = $("#job-applied-checkbox").attr("data-attr-applied");

    if (alreadyApplied === "true") {
      $("#job-applied-checkbox").click();
    }
  }

  if (currentVal === 0) {
    // $("#job-radio-applied-yes").prop("checked", false);
    $("#job-radio-applied-no").prop("checked", true);
    $(".update-application-status-container").hide();
  }

};

const addHandlers = () => {
  $('.content').on('submit', '#new-job-form', onCreateJob);
  $('.content').on('submit', '#update-job-form', onUpdateJob);
  $('.content').on('click', '#job-record-btn-edit', onEditJob);
  $('.content').on('click', '#dashboard-new-job-btn', onShowJobCreateForm);
  $('.content').on('click', '.dashboard-job-record-btn', onShowJobRecord);
  $('#get-jobs-btn').on('click', onGetJobs);
  $('.content').on('click', '#job-record-delete', onDeleteJob);
  $('.content').on('click', '.get-jobs', onGetJobs);
  $('.content').on('click', '#job-record-delete-menu', onShowDeleteMenu);
  $('.content').on('click', '#job-delete-cancel', onShowJobRecord);
  $('.content').on('click', '.get-jobs-back-btn', onGetJobs);
  $('.content').on('keyup', '#job-description-input', resizeTextArea);
  $('.content').on('keyup', '#job-responsibilities-input', resizeTextArea);
  $('.content').on('keyup', '#job-requirement-input', resizeTextArea);
  $('.content').on('keyup', '#job-notes-input', resizeTextArea);
  $('.content').on('click', '#dashboard-recent-job-btn', onGetJobs);
  $('.content').on('change', '#job-applied-checkbox', onAppliedForJob);
  $('.content').on('change', '.job-radio-applied-btn', onShowAppliedUpdate);
  $('.content').on('click', '.get-jobs-back-btn', onGetJobs);
};



module.exports = {
  addHandlers,
};
