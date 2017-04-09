'use strict';

const store = require('../store');
const displayEditCompany = require('../templates/company/update-company-form.handlebars');
const displayCompanyDashboard = require('../templates/company/get-companies.handlebars');
const displayCompanyDetails = require('../templates/company/show-company-record.handlebars');
const displayCompanyCreateForm = require('../templates/company/create-company.handlebars');
const companiesApi = require('./api');

const getCompanySuccess = (data) => {
  $(".notification-container").children().text("");
  store.companyDataForEdit = data;

  $(".content").children().remove();

  let companyDashboard = displayCompanyDashboard({
    companies: data.companies
  });

  $('.content').append(companyDashboard);

};

const showCompanyRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowCompanyData = data;

  let companyDetails = displayCompanyDetails({
    company: data.company
  });
  $('.content').append(companyDetails);
};

const showCompanyRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};

const showCompanyCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateCompanyForm = displayCompanyCreateForm();
  $('.content').append(showCreateCompanyForm);
};

const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowCompanyData;

  let editCompany = displayEditCompany({
    company: data.company
  });
  $('.content').append(editCompany);

};

const getCompanyFailure = () => {
  $(".notification-container").children().text("");
  console.log('get company failure');
};

const createCompanySuccess = (data) => {
  console.log('company success data');
  console.log(data);
  store.currentCompanyId = data.company.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Company Has Been Successfully Created");

  let showCompanyDetails = displayCompanyDetails({
    company: data.company
  });
  $(".content").append(showCompanyDetails);
  $(".current").attr("data-current-company-id", store.currentCompanyId);
};

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

const updateCompanySuccess = (data) => {
  $(".notification-container").children().text("");
  $(".success-alert").text("Company Has Been Successfully Updated");
  store.currentCompanyId = data.company.id;
  $(".content").children().remove();
  console.log(data);
  companiesApi.showCompany()
    .done(showCompanyRecordSuccess)
    .fail(showCompanyRecordFailure);
};

module.exports = {
  getCompanySuccess,
  showCompanyRecordSuccess,
  deleteCompanySuccess,
  deleteCompanyFailure,
  updateFormGenerator,
  showCompanyCreateForm,
  getCompanyFailure,
  updateCompanySuccess,
  showCompanyRecordFailure,
  createCompanySuccess,
};
