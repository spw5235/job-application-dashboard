'use strict';
const companiesApi = require('./api');
const companiesUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
// const logic = require('./logic');

// STUDENT EVENTS

const onGetCompanies = function(event) {
  event.preventDefault();
  companiesApi.getCompanies()
    .done(companiesUi.getCompanySuccess)
    .fail(companiesUi.getCompanyFailure);
};

const onShowCompanyRecord = function(event) {
  event.preventDefault();
  store.currentCompanyId = $(this).attr("data-current-company-id");
  companiesApi.showCompany()
    .done(companiesUi.showCompanyRecordSuccess)
    .fail(companiesUi.showCompanyRecordFailure);
};
//
const onEditCompany = function(event) {
  event.preventDefault();
  store.currentCompanyId = $(this).attr("data-current-company-id");
  companiesUi.updateFormGenerator();
};

const onCreateCompany = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  console.log(data.company.location);
  data.company.company_page = true;
  data.company.company_id = store.currentCompanyId;
  store.companyPage = data.company.company_page;
  store.createCompanyData = (data);
  companiesApi.createCompany(data)
    .then((response) => {
      store.currentCompanyId = response.company.id;
      return store.currentCompanyId;
    })
    .done(companiesUi.createCompanySuccess)
    .fail(companiesUi.createCompanyFailure);
};

const onDeleteCompany = function(event) {
  event.preventDefault();
  store.currentCompanyId= $("#company-record-delete").attr("data-current-company-id");
  companiesApi.deleteCompany(store.currentCompanyId)
    .done(companiesUi.deleteCompanySuccess)
    .fail(companiesUi.deleteCompanyFailure);
};

const onUpdateCompany = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  companiesApi.updateCompany(data)
    .done(companiesUi.updateCompanySuccess)
    .fail(companiesUi.updateCompanyFailure);
};

const onShowCompanyCreateForm = function(event) {
  event.preventDefault();
  companiesUi.showCompanyCreateForm();
};

const addHandlers = () => {
  $('.content').on('submit', '#new-company-form', onCreateCompany);
  $('.content').on('submit', '#update-company-form', onUpdateCompany);
  $('.content').on('click', '#company-record-btn-edit', onEditCompany);
  $('.content').on('click', '#new-job-new-company', onShowCompanyCreateForm);
  $('.content').on('click', '.dashboard-company-record-btn', onShowCompanyRecord);
  $('.content').on('click', '#dashboard-home-btn', onGetCompanies);
  $('.content').on('click', '#company-record-delete', onDeleteCompany);
  $('.content').on('click', '#job-back-company-overview', onShowCompanyRecord);
};

module.exports = {
  addHandlers,
};
