'use strict';
const jobsApi = require('./api');
const jobsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const logic = require('../dashboard/logic');
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
  let data = getFormFields(event.target);

  data.job.notes = $("#job-notes-input").val();

  data.job.post_url = logic.convertToUrl(data.job.post_url);

  store.createJobData = data;
  store.lastShowJobData = data;

  jobsApi.createJob(data)
    .done(jobsUi.createJobSuccess)
    .fail(jobsUi.createJobFailure);
};

const onDeleteJob = function(event) {
  event.preventDefault();
  store.currentJobId= $("#job-record-delete").attr("data-current-job-id");


  jobsApi.deleteJob(store.currentJobId)
    .done(jobsUi.deleteJobSuccess)
    .fail(jobsUi.deleteJobFailure);
};

const onUpdateJob = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);

  store.createJobData = data;
  store.lastShowJobData = data;

  data.job.notes = $("#job-notes-input").val();

  data.job.post_url = logic.convertToUrl(data.job.post_url);

  data.job.company_name = $(".company-name-update-form").text();

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
  $(this).hide();
  $(".delete-confirmation-contain").show();
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
};

module.exports = {
  addHandlers,
};
