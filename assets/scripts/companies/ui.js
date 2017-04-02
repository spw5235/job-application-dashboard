'use strict';

const store = require('../store');
// const displayEditCompany = require('../templates/company/edit-company.handlebars');
const displayCompanyDashboard = require('../templates/company/get-companies.handlebars');
// const displayCompanyDetails = require('../templates/company/show-company-record.handlebars');
// const displayCompanyCreateForm = require('../templates/company/create-company.handlebars');
// const displaySessionsTable = require('../templates/session/get-sessions.handlebars');
// // const displayDashboard = require('../templates/dashboard/dashboard-btn.handlebars');
// const apiCompanies = require('./api');
// const sessionsApi = require('../sessions/api');

// Company UI

// const getSessionSuccess = (data) => {
//   $(".notification-container").children().text("");
//   let sessionDashboard = displaySessionsTable({
//     sessions: data.sessions
//   });
//   // $('.company-dashboard-container').append(companyDashboard);
//   $('.content').append(sessionDashboard);
//   $(".current-company-fn").text(store.currentCompanyFn);
//   $(".current-company-ln").text(store.currentCompanyLn);
//   $("#create-session-company-btn").attr("data-current-company-id", store.currentCompanyId);
// };
//
// const getSessionFailure = () => {
//   $(".notification-container").children().text("");
// };
//
// const viewCompanyRecordSuccess = (data) => {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   // $(".company-record-table").remove();
//   let companyDetails = displayCompanyDetails({
//     company: data.company
//   });
//   // $('.company-details-container').append(companyDetails);
//   $('.content').append(companyDetails);
//   store.currentCompanyFn = $(".company-name-header").attr("data-current-company-fn");
//   store.currentCompanyLn = $(".company-name-header").attr("data-current-company-ln");
//   sessionsApi.getSessions()
//     .done(getSessionSuccess)
//     .fail(getSessionFailure);
// };
//
// const viewCompanyRecordFailure = () => {
//   $(".notification-container").children().text("");
// };
//
// const showCompanyCreateForm = () => {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   let showCreateForm = displayCompanyCreateForm();
//   $('.content').append(showCreateForm);
// };

const getCompanySuccess = (data) => {
  $(".notification-container").children().text("");
  store.currentCompanyId = 0;
  store.currentJobId = 0;

  $(".content").children().remove();
  let companyDashboard = displayCompanyDashboard({
    companies: data.companies
  });
  // $('.company-dashboard-container').append(companyDashboard);
  $('.content').append(companyDashboard);
  // $('.content').append(dashboardHomeBtn);
};
//
// const editCompanySuccess = (data) => {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//
//   let editCompany = displayEditCompany({
//     company: data.company
//   });
//   $('.content').append(editCompany);
// };
//
// const editCompanyFailure = () => {
//   $(".notification-container").children().text("");
// };
//
// const getCompanyFailure = () => {
//   $(".notification-container").children().text("");
// };
//
// const showCompanySuccess = () => {
//   $(".notification-container").children().text("");
// };
//
// const showCompanyFailure = () => {
//   $(".notification-container").children().text("");
// };
//
// const createCompanySuccess = () => {
//   $(".form-error").text("");
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   $(".success-alert").text("Company Has Been Successfully Created");
//   // let companyDetails = displayCompanyDetails({
//   //   company: data.company
//   // });
//   //
//   // $(".content").append(companyDetails);
//   apiCompanies.showCompany()
//     .done(viewCompanyRecordSuccess)
//     .fail(viewCompanyRecordFailure);
//   // $("#create-session-stud-id").attr("value", store.currentCompanyId);
//   // $(".current").attr("data-current-company-id", store.currentCompanyId);
//   // let dashboardHomeBtn = displayDashboard();
//   // $('.content').append(dashboardHomeBtn);
// };
//
// const createCompanyFailure = () => {
//   $(".notification-container").children().text("");
//   $(".form-error").text("");
//   $("#create-company-error").text("Error: Company not created.  Please ensure all required fields have values");
// };
//
// const deleteCompanySuccess = () => {
//   $(".notification-container").children().text("");
//   apiCompanies.getCompanies()
//     .done(getCompanySuccess)
//     .fail(getCompanyFailure);
// };
//
// const deleteCompanyFailure = () => {
//   $(".notification-container").children().text("");
// };
//
// const updateCompanySuccess = (data) => {
//   $(".notification-container").children().text("");
//   $(".success-alert").text("Company Has Been Successfully Updated");
//   store.currentCompanyId = data.company.id;
//   $(".content").children().remove();
//   // let companyDetails = displayCompanyDetails({
//   //   company: data.company
//   // });
//   // $('.company-details-container').append(companyDetails);
//   // $('.content').append(companyDetails);
//   apiCompanies.showCompany()
//     .done(viewCompanyRecordSuccess)
//     .fail(viewCompanyRecordFailure);
//
// };
//
// const updateCompanyFailure = (data) => {
//   $(".notification-container").children().text("");
//   $("#update-company-error").text("Error: Company not updated.  Please ensure all required fields have values");
// };

module.exports = {
  // createCompanySuccess,
  // createCompanyFailure,
  getCompanySuccess,
  // getCompanyFailure,
  // showCompanySuccess,
  // showCompanyFailure,
  // updateCompanySuccess,
  // updateCompanyFailure,
  // deleteCompanySuccess,
  // deleteCompanyFailure,
  // editCompanySuccess,
  // editCompanyFailure,
  // viewCompanyRecordSuccess,
  // viewCompanyRecordFailure,
  // showCompanyCreateForm,
};
