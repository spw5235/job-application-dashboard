'use strict';

const store = require('../store');
const jobsApi = require('./api');
const displayJobCreateForm = require('../templates/job/new-job-form.handlebars');
// const displayObservationLandingPage = require('../templates/observation/obs-landing.handlebars');
const displayJobsTable = require('../templates/job/get-jobs.handlebars');
const displayJobDetails = require('../templates/job/show-job.handlebars');
const displayJobUpdateForm = require('../templates/job/update-job-form.handlebars');
const uiCompanies = require('../companies/ui');
const apiCompanies = require('../companies/api');

// Job UI

const getJobSuccess = (data) => {
  $(".notification-container").children().text("");

  $(".content").children().remove();
  let jobDashboard = displayJobsTable({
    jobs: data.jobs
  });
  // $('.company-dashboard-container').append(companyDashboard);
  $('.content').append(jobDashboard);
  // $("#current-company-fn").text(store.currentCompanyFn);
  // $("#current-company-ln").text(store.currentCompanyLn);
};

const getJobFailure = () => {
  $(".notification-container").children().text("");
};

const showJobSuccess = (data) => {
  $(".notification-container").children().text("");

  $(".content").children().remove();
  let jobDetails = displayJobDetails({
    job: data.job
  });
  // $('.company-dashboard-container').append(companyDashboard);
  $('.content').append(jobDetails);

  $(".current").attr("data-current-company-id", store.currentCompanyId);
};

const showJobFailure = () => {
  $(".notification-container").children().text("");
};

// const generateTodaysDate = function() {
//   let today = new Date();
//   let dd = today.getDate();
//   let mm = today.getMonth()+1;
//   let yyyy = today.getFullYear();
//
//   if (dd < 10) {
//       dd='0'+dd;
//     }
//
//   if(mm<10) {
//       mm='0'+mm;
//   }
//
//   today = yyyy+'/'+mm+'/'+dd;
//   return today;
// };

const generateCreateForm = () => {
  $(".content").children().remove();
  let showCreateForm = displayJobCreateForm();
  $('.content').append(showCreateForm);
  $(".current").attr("data-current-job-id", store.currentJobId);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
  // let today = generateTodaysDate();

  // let today = moment().format('YYYY-MM-DD');
  // document.getElementById("job-date-create-field").value = today;
};

const generateUpdateForm = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  data.job.company_id = store.currentCompanyId;
  let generatedUpdateForm = displayJobUpdateForm({
    job: data.job
  });
  $('.content').append(generatedUpdateForm);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
  // let today = generateTodaysDate();
  // $("#job-date-create-field").val(today);
};

const generateUpdateFormFailure = () => {
  $(".notification-container").children().text("");

};

const createLandingPage = function() {
  $(".content").children().remove();
  let landingPage = displayObservationLandingPage();
  $('.content').append(landingPage);
  $(".current").attr("data-current-job-id", store.currentJobId);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
};

// const beginObservations = (data) => {
//   console.log(data);
//   store.observationIdNum = 0;
//   $("#new-observation-form").show();
//   $("#interval-total").text(store.currentNumofIntervals);
//   $("#company-observed").html('<span id="target-company">Target Company</span>');
//   $(".current").attr("data-current-job-id", store.currentJobId);
//   $(".current").attr("data-current-company-id", store.currentCompanyId);
// }

const createJobSuccess = () => {
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".success-alert").text("Job Successfully Created");
  let data = store.createJobData;
  $(".content").children().remove();
  let jobDetails = displayJobDetails({
    job: data.job
  });
  $(".content").append(jobDetails);
  // store.observationIdNum = 0;
  // $("#new-job-form").hide();
  // $("#new-observation-form").show();
  // $("#interval-total").text(store.currentNumofIntervals);
  // // $(".interval-count").text(store.currentObsNum);
  // $("#company-observed").html('<span id="target-company">Target Company</span>');
  //
  // $(".current").attr("data-current-job-id", store.currentJobId);
  // $(".current").attr("data-current-company-id", store.currentCompanyId);
};

const createJobFailure = () => {
  $(".notification-container").children().text("");
  $("#create-job-error").text("Error creating job. Please check if all required fields are entered and number values fall within the listed range.");
};

const deleteJobSuccess = () => {
  $(".notification-container").children().text("");
  // jobsApi.getJobs()
  //   .done(getJobSuccess)
  //   .fail(getJobFailure);
  apiCompanies.showCompany()
    .done(uiCompanies.viewCompanyRecordSuccess)
    .fail(uiCompanies.viewCompanyRecordFailure);
};

const deleteJobFailure = (data) => {
  $(".notification-container").children().text("");
};

const updateJobSuccess = (data) => {
  $(".notification-container").children().text("");
  store.currentCompanyId = data.job.id;
  $(".content").children().remove();
  let jobDetails = displayJobDetails({
    job: data.job
  });
  // $('.company-details-container').append(companyDetails);
  $('.content').append(jobDetails);

};

const updateJobFailure = (data) => {
  $(".notification-container").children().text("");
  $("#update-job-error").text("Error updating job. Please check if all required fields are entered and number values fall within the listed range.");
};

module.exports = {
  getJobSuccess,
  getJobFailure,
  showJobSuccess,
  showJobFailure,
  createJobSuccess,
  createJobFailure,
  updateJobSuccess,
  updateJobFailure,
  deleteJobSuccess,
  deleteJobFailure,
  generateCreateForm,
  generateUpdateForm,
  generateUpdateFormFailure
};
