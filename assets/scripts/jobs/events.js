'use strict';
const jobsApi = require('./api');
const jobsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const dashboardLogic = require('../dashboard/logic');

// Job EVENTS

const onGetJobs = function(event) {
  event.preventDefault();
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

const onDeleteJob = function(event) {
  event.preventDefault();
  store.currentJobId= $(this).attr("data-current-job-id");
  jobsApi.deleteJob(store.currentJobId)
    .done(jobsUi.deleteJobSuccess)
    .fail(jobsUi.deleteJobFailure);
};

const onCreateJob = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createJobData = data;
  store.lastShowJobData = data;

  data.job.note = $("#job-notes-input").val();
  console.log(data.job.note);
  jobsApi.createJob(data)
    .done(jobsUi.createJobSuccess)
    .fail(jobsUi.createJobFailure);
};

const onEditJob = function(event) {
  event.preventDefault();
  store.currentJobId = $(this).attr("data-current-job-id");
  jobsUi.updateFormGenerator();

  let category = "company-category";

  dashboardLogic.tagCheckboxUpdate(category);
};

const onUpdateJob = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);

  jobsApi.updateJob(data)
    .done(jobsUi.updateJobSuccess)
    .fail(jobsUi.updateJobFailure);
};

const onShowJobCreateForm = function(event) {
  event.preventDefault();
  jobsUi.showJobCreateForm();
};

const onSelectJobDropdown = function(event) {
  event.preventDefault();
  let tagCategory = $(this).attr("class");
  dashboardLogic.determineApiRequest(tagCategory);
};

const onDisplayJobDropdown = function(event) {
  event.preventDefault();

  let thisCheckBoxStatus = $(this).is(':checked');

  if (!thisCheckBoxStatus) {
    $(this).parent().children(".tag-select-container").remove();
  }
  let isUpdateForm;
  let checkboxDivId = $(this).attr("id");
  let tagCategory = $(this).attr("class");
  let updateFormStatus = $(".general-form-container").attr("data-update-form");
  updateFormStatus = parseInt(updateFormStatus);
  if (updateFormStatus === 1) {
    isUpdateForm = true;
  } else {
    isUpdateForm = false;
  }
  dashboardLogic.tagCheckboxClicked(tagCategory, checkboxDivId);
};

const addHandlers = () => {
  $('.content').on('submit', '#new-job-form', onCreateJob);
  $('.content').on('submit', '#update-job-form', onUpdateJob);
  $('.content').on('click', '#job-record-btn-edit', onEditJob);
  $('.content').on('click', '#generate-create-job-btn', onShowJobCreateForm);
  $('.content').on('click', '.dashboard-job-record-btn', onShowJobRecord);
  $('.content').on('click', '#get-jobs-btn', onGetJobs);
  $('.content').on('click', '#job-record-delete', onDeleteJob);
  $('.content').on('change', '#tag-company-to-job', onDisplayJobDropdown);
  $('.content').on('change', '#select-option-company-category', onSelectJobDropdown);
  $('.content').on('click', '#dashboard-new-job-btn', onShowJobCreateForm);
};

module.exports = {
  addHandlers,
};
