'use strict';

const store = require('../store');
const displayEditJob = require('../templates/job/update-job-form.handlebars');
const displayJobDashboard = require('../templates/job/get-jobs.handlebars');
const displayJobDetails = require('../templates/job/show-job-record.handlebars');
const displayJobCreateForm = require('../templates/job/create-job.handlebars');
const jobsApi = require('./api');

const getJobSuccess = (data) => {
  $(".notification-container").children().text("");
  store.jobDataForEdit = data;

  $(".content").children().remove();

  let jobDashboard = displayJobDashboard({
    jobs: data.jobs
  });

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
};

const showJobRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};

const showJobCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateJobForm = displayJobCreateForm();
  $('.content').append(showCreateJobForm);
};

const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowJobData;

  let editJob = displayEditJob({
    job: data.job
  });
  $('.content').append(editJob);

};

const getJobFailure = () => {
  $(".notification-container").children().text("");
  console.log('get job failure');
};

const createJobSuccess = (data) => {
  console.log(data);
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Job Has Been Successfully Created");

  let showJobDetails = displayJobDetails({
    job: data.job
  });
  $(".content").append(showJobDetails);
  $(".current").attr("data-current-job-id", store.currentJobId);
};

const deleteJobSuccess = () => {
  $(".notification-container").children().text("");
  console.log('delete success');
  jobsApi.getJobs()
    .done(getJobSuccess)
    .fail(getJobFailure);
};

const deleteJobFailure = () => {
  $(".notification-container").children().text("");
  console.log('delete fail');
};

const updateJobSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".success-alert").text("Job Has Been Successfully Updated");
  store.currentJobId = data.job.id;
  $(".content").children().remove();
  console.log(data);
  jobsApi.showJob()
    .done(showJobRecordSuccess)
    .fail(showJobRecordFailure);
};

module.exports = {
  getJobSuccess,
  showJobRecordSuccess,
  deleteJobSuccess,
  deleteJobFailure,
  updateFormGenerator,
  showJobCreateForm,
  getJobFailure,
  updateJobSuccess,
  showJobRecordFailure,
  createJobSuccess,
};
