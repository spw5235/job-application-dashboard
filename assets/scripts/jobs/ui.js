'use strict';

const store = require('../store');
const displayEditJob = require('../templates/job/update-job-form.handlebars');
const displayJobDashboard = require('../templates/job/get-jobs.handlebars');
const displayJobDetails = require('../templates/job/show-job-record.handlebars');
const displayJobCreateForm = require('../templates/job/create-job.handlebars');
const jobsApi = require('./api');
const summaryLogic = require('../summary/summary-logic');
const logic = require('../dashboard/logic');

const getJobSuccess = (data) => {

  $(".notification-container").children().text("");

  $(".content").children().remove();

  let dataArr = data.jobs;

  for (let i = 0; i < dataArr.length; i++ ) {
    let unavailable = "N/A";
    let currArrayOptOne = (dataArr[i].title);
    let currArrayOptTwo = (dataArr[i].posting_date);

    if (currArrayOptOne === "" || currArrayOptOne === null) {
      dataArr[i].title = unavailable;
    }
    if (currArrayOptTwo === "" || currArrayOptTwo === null) {
      dataArr[i].posting_date = unavailable;
    }

  }

  let jobDashboard = displayJobDashboard({
    jobs: data.jobs
  });

  store.jobDataForEdit = data;

  $('.content').append(jobDashboard);
};

const showJobRecordSuccess = (data) => {

  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowJobData = data;

  let jobDetails = displayJobDetails({
    job: data.job
  });
  $('.content').append(jobDetails);
  $(".delete-confirmation-contain").hide();
  $("#job-record-delete-menu").show();

  logic.displayUrl();

  // Summary Table reminders
  summaryLogic.initiateJobSummaryTables(data.job.id);
};

const showJobRecordFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured displaying the job record");
};

const showJobCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateJobForm = displayJobCreateForm();
  $('.content').append(showCreateJobForm);
};


const generateUpdateForm = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowJobData;

  let editJob = displayEditJob({
    job: data.job
  });
  $('.content').append(editJob);

  let jobDescriptionId = "#job-description-input";
  let jobResponsibilitiesId = "#job-responsibilities-input";
  let jobRequirementId = "#job-requirement-input";
  let jobNotesId = "#job-notes-input";
  logic.textAreaHeightUpdate(jobDescriptionId);
  logic.textAreaHeightUpdate(jobResponsibilitiesId);
  logic.textAreaHeightUpdate(jobRequirementId);
  logic.textAreaHeightUpdate(jobNotesId);
};

const getJobFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured when retrieving the job record");
};

const createJobSuccess = (data) => {
  store.currentJobId = data.job.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("The record has been successfully created.");

  let showJobDetails = displayJobDetails({
    job: store.createJobData.job
  });
  $(".content").append(showJobDetails);
  $(".current").attr("data-current-job-id", store.currentJobId);
  logic.displayUrl();
};

const deleteJobSuccess = () => {
  $(".notification-container").children().text("");
  $(".success-alert").text("The record has been successfully deleted");
  jobsApi.getJobs()
    .done(getJobSuccess)
    .fail(getJobFailure);
};

const deleteJobFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured when deleting the job record");
};

const updateJobSuccess = (data) => {
  store.currentJobId = data.job.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("The record has been successfully updated");

  let showJobDetails = displayJobDetails({
    job: data.job
  });
  $(".content").append(showJobDetails);
  $(".current").attr("data-current-job-id", store.currentJobId);
  logic.displayUrl();
};

const createJobFailure = function() {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured. Please make sure all required fields are complete");
};

const updateJobFailure = function() {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record has not been updated. Please make sure all required fields are complete");
};

module.exports = {
  getJobSuccess,
  showJobRecordSuccess,
  deleteJobSuccess,
  deleteJobFailure,
  showJobCreateForm,
  getJobFailure,
  updateJobSuccess,
  showJobRecordFailure,
  createJobSuccess,
  generateUpdateForm,
  createJobFailure,
  updateJobFailure,
};
