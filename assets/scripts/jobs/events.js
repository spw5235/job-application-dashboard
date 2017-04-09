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

const onEditJob = function(event) {
  event.preventDefault();
  store.currentJobId = $(this).attr("data-current-job-id");
  jobsUi.updateFormGenerator();

  let category = "contact-category";

  dashboardLogic.tagCheckboxUpdate(category);

};

const onCreateJob = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createJobData = data;
  store.lastShowJobData = data;

  let submittedRefId = $("#select-option-contact-category").val();

  data.job.contact_ref_id = submittedRefId;

  let jobTextSelect = $("#select-option-contact-category option[value=" + submittedRefId + "]").text();

  data.job.contact_ref_name = jobTextSelect;

  jobsApi.createJob(data)
    .then((response) => {
      store.currentJobId = response.job.id;
      return store.currentJobId;
    })
    .done(jobsUi.createJobSuccess)
    .fail(jobsUi.createJobFailure);
};

const onDeleteJob = function(event) {
  event.preventDefault();
  store.currentJobId= $(this).attr("data-current-job-id");
  jobsApi.deleteJob(store.currentJobId)
    .done(jobsUi.deleteJobSuccess)
    .fail(jobsUi.deleteJobFailure);
};

const onUpdateJob = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  let category = "company-category";
  let categoryId = $(".select-option-value").val();

  data.job.company_name = dashboardLogic.determineTagText(category, categoryId);
  data.job.company_ref_id = categoryId;

  jobsApi.updateCommunication(data)
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
  $('.content').on('change', '#tag-contact-to-job', onDisplayJobDropdown);
  $('.content').on('change', '#select-option-contact-category', onSelectJobDropdown);
};

module.exports = {
  addHandlers,
};
