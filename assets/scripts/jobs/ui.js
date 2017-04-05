'use strict';

const store = require('../store');
const displayJobCreateForm = require('../templates/job/new-job-form.handlebars');
const displayJobsTable = require('../templates/job/get-jobs.handlebars');
const displayJobDetails = require('../templates/job/show-job.handlebars');
const displayJobUpdateForm = require('../templates/job/update-job-form.handlebars');
const companiesUi = require('../companies/ui');
const companiesApi = require('../companies/api');
const displayCompanyDetails = require('../templates/company/show-company-record.handlebars');

// Job UI

const getJobSuccess = (data) => {
  $(".notification-container").children().text("");

  $(".content").children().remove();
  let jobDashboard = displayJobsTable({
    jobs: data.jobs
  });
  // $('.company-dashboard-container').append(companyDashboard);
  $('.content').append(jobDashboard);
  store.currentJobId = $('.current').attr("data-current-job-id");
  console.log(store.currentJobId);
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
  $('.content').append(jobDetails);

  $(".current").attr("data-current-company-id", store.currentCompanyId);
  $('.current').attr("data-current-job-id", store.currentJobId);

};

const showJobFailure = () => {
  $(".notification-container").children().text("");
};

const generateCreateForm = () => {
  $(".content").children().remove();
  let showCreateForm = displayJobCreateForm();
  $('.content').append(showCreateForm);
  $(".current").attr("data-current-job-id", store.currentJobId);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
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
  $(".current").attr("data-current-job-id",store.currentJobId);
};

const generateUpdateFormFailure = () => {
  $(".notification-container").children().text("");
};

const showCompanyRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowCompanyData = data;
  data.company.company_page = true;
  store.companyPage = data.company.company_page;
  let companyDetails = displayCompanyDetails({
    company: data.company
  });
  let jobDetails = displayJobDetails({
    job: store.createJobData.job
  });
  $(".content").append(companyDetails);
  $(".content").append(jobDetails);
  $(".dashboard-home-btn-company-page").remove();
  $(".current").attr("data-current-company-id",store.currentCompanyId);
  $(".current").attr("data-current-job-id",store.currentJobId);
};

const showCompanyRecordFailure = () => {
  console.log('showCompanyRecordFailure failure');
};

const createJobSuccess = () => {
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".success-alert").text("Job Successfully Created");
  $(".content").children().remove();

  companiesApi.showCompany()
    .done(showCompanyRecordSuccess)
    .fail(showCompanyRecordFailure);
};

const createJobFailure = () => {
  $(".notification-container").children().text("");
  $("#create-job-error").text("Error creating job. Please check if all required fields are entered and number values fall within the listed range.");
};

const deleteJobSuccess = () => {
  $(".notification-container").children().text("");
  companiesApi.showCompany()
    .done(companiesUi.showCompanyRecordSuccess)
    .fail(companiesUi.showCompanyRecordSuccess);
};

const deleteJobFailure = () => {
  $(".notification-container").children().text("");
};

const updateJobSuccess = (data) => {
  $(".notification-container").children().text("");
  console.log("update success");
  store.currentJobId = data.job.id;
  $(".content").children().remove();
  let jobDetails = displayJobDetails({
    job: data.job
  });
  $('.content').append(jobDetails);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
  $(".current").attr("data-current-job-id",store.currentJobId);

};

const updateJobFailure = () => {
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
