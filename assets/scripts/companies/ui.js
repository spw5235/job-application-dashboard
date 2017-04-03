'use strict';

const store = require('../store');
const displayEditCompany = require('../templates/company/update-company-form.handlebars');
const displayCompanyDashboard = require('../templates/company/get-companies.handlebars');
const displayCompanyDetails = require('../templates/company/show-company-record.handlebars');
const displayCompanyCreateForm = require('../templates/company/create-company.handlebars');
const displayJobsTable = require('../templates/job/get-jobs.handlebars');
const displayShowJobTable = require('../templates/job/show-job.handlebars');
// // const displayDashboard = require('../templates/dashboard/dashboard-btn.handlebars');
const companiesApi = require('./api');
const jobsApi = require('../jobs/api');
// const jobsUi = require('../jobs/ui');

// Company UI

const getJobSuccess = (data) => {
  $(".notification-container").children().text("");
  const numberOfJobs = data.jobs.length;
  let singleJobData = data.jobs[0];

  let singleJobDetails = displayShowJobTable({
    job: singleJobData
  });

  let jobDashboard = displayJobsTable({
    jobs: data.jobs
  });

  if (numberOfJobs === 1) {
    $(".content").append(singleJobDetails);
  } else if (numberOfJobs > 1) {
    $(".content").append(jobDashboard);
  }
  // $('.company-dashboard-container').append(companyDashboard);
  const currentCompanyName = store.companyName;
  $("#job-record-btn-edit").attr("data-current-company-id", store.currentCompanyId);
  $("#job-record-delete").attr("data-current-company-id", store.currentCompanyId);
  $("#create-job-company-btn").attr("data-current-company-id", store.currentCompanyId);
  $(".current-company-name").text(currentCompanyName);
};

const getJobFailure = () => {
  $(".notification-container").children().text("");
};


const getCompanySuccess = (data) => {
  $(".notification-container").children().text("");
  store.companyPage = false;
  store.currentCompanyId = 0;
  store.currentJobId = 0;
  store.companyDataForEdit = data;

  $(".content").children().remove();
  let companyDashboard = displayCompanyDashboard({
    companies: data.companies
  });
  // $('.company-dashboard-container').append(companyDashboard);
  $('.content').append(companyDashboard);
  // $('.content').append(dashboardHomeBtn);
};

const showCompanyRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowCompanyData = data;
  store.companyName = data.company.name;
  data.company.company_page = true;
  store.companyPage = data.company.company_page;
  let companyDetails = displayCompanyDetails({
    company: data.company
  });
  // $('.company-details-container').append(companyDetails);
  $('.content').append(companyDetails);
  // store.currentCompanyFn = $(".company-name-header").attr("data-current-company-fn");
  // store.currentCompanyLn = $(".company-name-header").attr("data-current-company-ln");
  jobsApi.getJobs()
    .done(getJobSuccess)
    .fail(getJobFailure);
};
//
const showCompanyRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};
//
const showCompanyCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateForm = displayCompanyCreateForm();
  $('.content').append(showCreateForm);
};

//
const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let editCompany = displayEditCompany({
    company: store.lastShowCompanyData.company
  });
  $('.content').append(editCompany);
};
//
// const editCompanyFailure = () => {
//   $(".notification-container").children().text("");
// };
//
const getCompanyFailure = () => {
  $(".notification-container").children().text("");
  console.log('get company failure');
};
//
// const showCompanySuccess = () => {
//   $(".notification-container").children().text("");
// };
//
// const showCompanyFailure = () => {
//   $(".notification-container").children().text("");
// };
//
const createCompanySuccess = () => {
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Company Has Been Successfully Created");
  store.companyPage = true;
  let showCompanyDetails = displayCompanyDetails({
    company: store.createCompanyData.company
  });
  $(".content").append(showCompanyDetails);
  // companiesApi.showCompany()
  //   .done(showCompanyRecordSuccess)
  //   .fail(showCompanyRecordFailure);
  // $("#create-job-stud-id").attr("value", store.currentCompanyId);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
  // let dashboardHomeBtn = displayDashboard();
  // $('.content').append(dashboardHomeBtn);
};
//
// const createCompanyFailure = () => {
//   $(".notification-container").children().text("");
//   $(".form-error").text("");
//   $("#create-company-error").text("Error: Company not created.  Please ensure all required fields have values");
// };
//
const deleteCompanySuccess = () => {
  $(".notification-container").children().text("");
  console.log('delete success');
  companiesApi.getCompanies()
    .done(getCompanySuccess)
    .fail(getCompanyFailure);
};

const deleteCompanyFailure = () => {
  $(".notification-container").children().text("");
  console.log('delete fail');
};
//
const updateCompanySuccess = (data) => {
  $(".notification-container").children().text("");
  $(".success-alert").text("Company Has Been Successfully Updated");
  store.currentCompanyId = data.company.id;
  $(".content").children().remove();
  companiesApi.showCompany()
    .done(showCompanyRecordSuccess)
    .fail(showCompanyRecordFailure);
};

const updateCompanyFailure = (data) => {
  $(".notification-container").children().text("");
  $("#update-company-error").text("Error: Company not updated.  Please ensure all required fields have values");
};

module.exports = {
  getCompanySuccess,
  showCompanyRecordSuccess,
  deleteCompanySuccess,
  deleteCompanyFailure,
  updateFormGenerator,
  showCompanyCreateForm,
  // createCompanySuccess,
  // createCompanyFailure,
  getCompanyFailure,
  // showCompanySuccess,
  // showCompanyFailure,
  updateCompanySuccess,
  updateCompanyFailure,
  showCompanyRecordFailure,
  createCompanySuccess,
};
