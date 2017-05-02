'use strict';

const store = require('../store');
const displayEditJob = require('../templates/job/update-job-form.handlebars');
const displayJobDashboard = require('../templates/job/get-jobs.handlebars');
const displayJobDetails = require('../templates/job/show-job-record.handlebars');
const displayJobCreateForm = require('../templates/job/create-job.handlebars');
const jobsApi = require('./api');
const summaryLogic = require('../summary/summary-logic');
const logic = require('../dashboard/logic');
const remindersApi = require('../reminders/api');

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
  $(".job-applied-date-container").hide();
  $("#default-reminder-input").prop("checked", true);
};


const generateUpdateForm = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowJobData;

  let editJob = displayEditJob({
    job: data.job
  });
  $('.content').append(editJob);

  $(".update-application-status-container").hide();
  $("#job-radio-applied-no").prop("checked", true);

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

const createJobSuccess = function(data) {
// const createJobSuccess = (data) => {
  console.log(data);
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
  store.addDefaultReminder = false;
};

const createdefaultSuccess = (data) => {
  console.log('createdefaultSuccess');
  console.log(data);

  let sendJobData = store.savedJobDataPostCreate;
  store.addDefaultReminder = false;
  createJobSuccess(sendJobData);
};

const createdefaultFailure = function() {
  console.log("createdefaultFailure");
  store.addDefaultReminder = false;
  createJobFailure();
};

const createDefaultReminderSuccess = function(data) {
  console.log(data);
  let returnedJobData = data;
  store.savedJobDataPostCreate = data;

  let companyName = data.job.company_name;
  let jobId = data.job.id;
  let jobNote = data.job.note;
  let defaultReminder = store.addDefaultReminder;

  console.log("defaultReminder");
  console.log(defaultReminder);

  if (defaultReminder) {
    console.log('default reminder true');

    data = {
      reminder: {}
    };

    data.reminder.reminder_date = logic.defaultDate();
    data.reminder.reminder_type = "Action";
    data.reminder.reminder_subject = companyName + ": Default Notification";
    data.reminder.job_ref_text = companyName;
    data.reminder.job_ref_id = jobId;
    data.reminder.reminder_details = jobNote;

    console.log(data);

    remindersApi.createReminder(data)
      .done(createdefaultSuccess)
      .fail(createdefaultFailure);

  }

  store.addDefaultReminder = false;

  createJobSuccess(returnedJobData);

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
  createDefaultReminderSuccess
};
