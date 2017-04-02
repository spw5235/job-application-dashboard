'use strict';

const store = require('../store');
const displayEditCompany = require('../templates/company/update-company-form.handlebars');
const displayCompanyDashboard = require('../templates/company/get-companies.handlebars');
const displayCompanyDetails = require('../templates/company/show-company-record.handlebars');
const displayCompanyCreateForm = require('../templates/company/create-company.handlebars');
// const displaySessionsTable = require('../templates/job/get-jobs.handlebars');
// // const displayDashboard = require('../templates/dashboard/dashboard-btn.handlebars');
const apiCompanies = require('./api');
// const jobsApi = require('../jobs/api');

// Company UI

// const getSessionSuccess = (data) => {
//   $(".notification-container").children().text("");
//   let jobDashboard = displaySessionsTable({
//     jobs: data.jobs
//   });
//   // $('.company-dashboard-container').append(companyDashboard);
//   $('.content').append(jobDashboard);
//   $(".current-company-fn").text(store.currentCompanyFn);
//   $(".current-company-ln").text(store.currentCompanyLn);
//   $("#create-job-company-btn").attr("data-current-company-id", store.currentCompanyId);
// };
//
// const getSessionFailure = () => {
//   $(".notification-container").children().text("");
// };
//

const getCompanySuccess = (data) => {
  $(".notification-container").children().text("");
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
  let companyDetails = displayCompanyDetails({
    company: data.company
  });
  // $('.company-details-container').append(companyDetails);
  $('.content').append(companyDetails);
  // store.currentCompanyFn = $(".company-name-header").attr("data-current-company-fn");
  // store.currentCompanyLn = $(".company-name-header").attr("data-current-company-ln");
  // jobsApi.getSessions()
  //   .done(getSessionSuccess)
  //   .fail(getSessionFailure);
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
  let showCompanyDetails = displayCompanyDetails({
    company: store.createCompanyData.company
  });
  $(".content").append(showCompanyDetails);
  // apiCompanies.showCompany()
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
  apiCompanies.getCompanies()
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
  apiCompanies.showCompany()
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
