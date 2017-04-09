'use strict';

// const store = require('../store');
const displayNewJobDash = require('../templates/dashboard/new-job-home.handlebars');
const displayDashboardHome = require('../templates/dashboard/dashboard-home.handlebars')
const dashboardUi = require('./ui');
// const displayJobCreateForm = require('../templates/job/new-job-form.handlebars');

const onShowCreateDash = function(event) {
  event.preventDefault();
  $(".content").children().remove();
  let showCreateDashHome = displayNewJobDash();
  $('.content').append(showCreateDashHome);
};
//
// const onExistingCompany = function(event) {
//   event.preventDefault();
//   companiesApi.getCompanies()
//     .done(dashboardUi.getExistingSuccess)
//     .fail(dashboardUi.getExistingFailure);
// };
//
// const onCreateFromExisting = function(event) {
//   event.preventDefault();
//   store.currentCompanyId = $(this).attr("data-current-company-id");
//   $(".content").children().remove();
//   let showCreateForm = displayJobCreateForm();
//   $('.content').append(showCreateForm);
//   $(".current").attr("data-current-job-id", store.currentJobId);
//   $(".current").attr("data-current-company-id", store.currentCompanyId);
// };

const onShowDashboard = function() {
  $('.content').children().remove();
  let showDashboardHome = displayDashboardHome();
  $('.content').append(showDashboardHome);
};

const addHandlers = () => {
  // $('.content').on('click', '#dashboard-new-job-btn', onShowCreateDash)
  $('.content').on('click', '#dashboard-new-job-btn', onShowCreateDash);
  // $('.content').on('click', '#new-job-existing-company', onExistingCompany);
  $('.content').on('click', '#dashboard-home-btn', onShowDashboard);
  // $('.content').on('click', '.dashboard-existing-create-btn', onCreateFromExisting);
};

module.exports = {
  addHandlers,
};
