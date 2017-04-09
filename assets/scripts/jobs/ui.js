'use strict';

const store = require('../store');
const displayEditJob = require('../templates/job/update-job-form.handlebars');
const displayJobDashboard = require('../templates/job/get-jobs.handlebars');
const displayReminderDashboard = require('../templates/reminder/get-reminders.handlebars');
// const displayReminderDashboardJobPage = require('../templates/reminder/get-reminders-job.handlebars');
const displayJobDetails = require('../templates/job/show-job-record.handlebars');
const displayJobCreateForm = require('../templates/job/create-job.handlebars');
// const displayJobsTable = require('../templates/job/get-jobs.handlebars');
// const displayShowJobTable = require('../templates/job/show-job.handlebars');
const jobsApi = require('./api');
// const jobsApi = require('../jobs/api');
// const remindersApi = require('../reminders/api');
const displayJobOptions = require('../templates/job/display-job-create-form.handlebars');
const dashboardLogic = require('../dashboard/logic');

const getReminderSuccess = (data) => {
  // let insertCompId = store.currentJobId;
  let reminderDashboard = displayReminderDashboard({
    reminders: data.reminders
    // insert: insertCompId
  });

  $('.content').append(reminderDashboard);

};

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
//
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
  // dashboardLogic.tagCheckboxUpdate(category);



  // $(".associate-reminder-with-job-container").attr("current-job-id", store.currentJobId);
  //
  // let contactRefId = parseInt($("#associate-reminder-with-company").attr("data-current-contact-id"));
  //
  //
  // if (companyId > 0) {
  //   console.log("true");
  //   // $("#associate-reminder-with-company").prop("checked", true);
  //   $("#associate-reminder-with-company").click();
  //   // $(".display-job-title").append('<div class="form-group"><label>Associate Reminder With Specific Job?</label><div class="form-group associate-reminder-with-job-container"><span>Check Box for Yes</span><input id="associate-reminder-with-job" type="checkbox" value=""></div></div>');
  // }

};

const getJobFailure = () => {
  $(".notification-container").children().text("");
  console.log('get job failure');
};

const createJobSuccess = () => {
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Job Has Been Successfully Created");

  let showJobDetails = displayJobDetails({
    job: store.createJobData.job
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
  jobsApi.showJob()
    .done(showJobRecordSuccess)
    .fail(showJobRecordFailure);
};

const displayJobDropdownSuccess = function(data) {
  $(".notification-container").children().text("");

  let companyOptionDisplay = displayJobOptions({
    jobs: data.jobs
  });

  let dataUpdateFormVal = parseInt($("#update-reminder-form").attr("data-update-form"));

  $('.associate-reminder-with-job-container').append(companyOptionDisplay);

  if (dataUpdateFormVal === 1) {
    let currentJobId = store.currentJobId;
    let valueString = '#select-option-job-name option[value=' + currentJobId + ']';
    $(valueString).prop('selected', true);
  }
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
  // updateJobFailure,
  showJobRecordFailure,
  createJobSuccess,
  displayJobDropdownSuccess,
  displayJobOptions,
  getReminderSuccess,
  // getReminderSuccess,
};
