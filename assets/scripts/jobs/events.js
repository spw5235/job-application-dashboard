'use strict';
const jobsApi = require('./api');
const jobsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
// const logic = require('./logic');

// SETTING EVENTS

// const onGetJobs = function(event) {
//   event.preventDefault();
//   store.currentCompanyId = $(this).attr("data-current-company-id");
//   jobsApi.getJobs()
//     .done(jobsUi.getJobSuccess)
//     .fail(jobsUi.getJobFailure);
// };
//
const onShowJob = function(event) {
  event.preventDefault();
  store.currentCompanyId = $(this).attr("data-current-company-id");
  store.currentJobId = $(this).attr("data-current-job-id");
  // store.currentCompanyFn = $(".company-name-tr").attr("data-current-company-fn");
  // store.currentCompanyLn = $(".company-name-tr").attr("data-current-company-ln");
  jobsApi.showJob()
    .done(jobsUi.showJobSuccess)
    .fail(jobsUi.showJobFailure);
};
//
const onCreateJob = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createJobData = data;
  jobsApi.createJob(data)
    .then((response) => {
      store.currentJobId = response.job.id;
      store.currentNumofIntervals = response.job.int_num;
      // alert(store.currentNumofIntervals);
      // console.log(store.currentNumofIntervals);
      store.currentObsIntervalTime = response.job.obs_time;
      // store.currentObsNum = 1;
      // return store.currentJob;
    })
    .done(jobsUi.createJobSuccess)
    .fail(jobsUi.createJobFailure);
};
//
// const onDeleteJob = function(event) {
//   event.preventDefault();
//   store.currentJobId= $("#job-record-delete").attr("data-current-job-id");
//   store.currentCompanyId =$("#job-record-delete").attr("data-current-company-id");
//   jobsApi.deleteJob()
//     .done(jobsUi.deleteJobSuccess)
//     .fail(jobsUi.deleteJobFailure);
// };
//
// const onUpdateJob = function(event) {
//   event.preventDefault();
//   let data = getFormFields(event.target);
//   jobsApi.updateJob(data)
//     .done(jobsUi.updateJobSuccess)
//     .fail(jobsUi.updateJobFailure);
// };
//
// // Calculates total time of job
//
// const totalTime = function(numberOfIntervalsEntry, intervalLengthEntry) {
//   let totalTimeinSeconds = numberOfIntervalsEntry * intervalLengthEntry;
//   let totalTimeinMins = totalTimeinSeconds / 60;
//
//   if (totalTimeinSeconds % 60 === 0) {
//     $("#total-job-time-m").text(totalTimeinMins);
//     $("#total-job-time-s").text("0");
//   } else {
//     let totalMinsFloor = Math.floor(totalTimeinMins);
//     $("#total-job-time-m").text(totalMinsFloor);
//     let secondsRemainder = totalTimeinSeconds % 60;
//     $("#total-job-time-s").text(secondsRemainder);
//   }
// };
//
// const totalTimeCalculator = function() {
//   let numberOfIntervalsEntry = $("#interval-number-entry").val();
//   let intervalLengthEntry = $("#interval-length-entry").val();
//   // alert(intervalLengthEntry);
//   $(".number-of-intervals-entry").text(numberOfIntervalsEntry);
//   $(".length-of-intervals-entry").text(intervalLengthEntry);
//   totalTime(numberOfIntervalsEntry, intervalLengthEntry);
// };

const onGenerateCreateForm = function(event) {
  event.preventDefault();
  store.currentCompanyId = $(this).attr("data-current-company-id");
  jobsUi.generateCreateForm();
};

// const onEditJob = function(event) {
//   event.preventDefault();
//   store.currentCompanyId = $(this).attr("data-current-company-id");
//   store.currentJobId = $(this).attr("data-current-job-id");
//   jobsApi.showJob()
//     .done(jobsUi.generateUpdateForm)
//     .fail(jobsUi.generateUpdateFormFailure);
// };

const addHandlers = () => {
  $('.content').on('click', '#dashboard-new-job-btn-company', onGenerateCreateForm);
  // $('#delete-job-form').on('submit', onDeleteJob);
  // $('#get-jobs-form').on('submit', onGetJobs);
  // $('#show-job-form').on('submit', onShowJob);
  // $('#new-job-form').on('submit', onCreateJob);
  // $('#update-job-form').on('submit', onUpdateJob);
  // $('.content').on('keyup', '#interval-number-entry', totalTimeCalculator);
  // $('.content').on('keyup', '#interval-length-entry', totalTimeCalculator);
  // $('#interval-number-entry').on('keyup', totalTimeCalculator);
  // $('#interval-length-entry').on('keyup', totalTimeCalculator);
  // $('.content').on('click', '#company-record-create-job', onGenerateCreateForm);
  $('.content').on('submit', '#new-job-form', onCreateJob);
  // $('.content').on('click', '#company-record-view-jobs', onGetJobs);
  $('.content').on('click', '#view-job-details-btn', onShowJob);
  // $('.content').on('click', '#job-record-btn-edit', onEditJob);
  // $('.content').on('submit', '#update-job-form', onUpdateJob);
  // $('.content').on('click', '#job-record-delete', onDeleteJob);
  // $('.content').on('click', '#create-job-company-btn', onGenerateCreateForm);

};

module.exports = {
  addHandlers,
};
