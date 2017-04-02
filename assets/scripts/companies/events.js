'use strict';
const apiCompanies = require('./api');
const uiCompanies = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
// const logic = require('./logic');

// STUDENT EVENTS

const onGetCompanies = function(event) {
  event.preventDefault();
  apiCompanies.getCompanies()
    .done(uiCompanies.getCompanySuccess)
    .fail(uiCompanies.getCompanyFailure);
};
//
// const onShowCompany = function(event) {
//   event.preventDefault();
//   apiCompanies.showCompany()
//     .done(uiCompanies.showCompanySuccess)
//     .fail(uiCompanies.showCompanyFailure);
// };
//
//
const onShowCompanyRecord = function(event) {
  event.preventDefault();
  store.currentCompanyId = $(this).attr("data-current-company-id");
  apiCompanies.showCompany()
    .done(uiCompanies.showCompanyRecordSuccess)
    .fail(uiCompanies.showCompanyRecordFailure);
};
//
const onEditCompany = function(event) {
  event.preventDefault();
  store.currentCompanyId = $(this).attr("data-current-company-id");
  uiCompanies.updateFormGenerator();
};

const onCreateCompany = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createCompanyData = (data);
  apiCompanies.createCompany(data)
    .then((response) => {
      store.currentCompanyId = response.company.id;
      return store.currentCompanyId;
    })
    .done(uiCompanies.createCompanySuccess)
    .fail(uiCompanies.createCompanyFailure);
};

const onDeleteCompany = function(event) {
  event.preventDefault();
  store.currentCompanyId= $("#company-record-delete").attr("data-current-company-id");
  apiCompanies.deleteCompany(store.currentCompanyId)
    .done(uiCompanies.deleteCompanySuccess)
    .fail(uiCompanies.deleteCompanyFailure);
};

const onUpdateCompany = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  apiCompanies.updateCompany(data)
    .done(uiCompanies.updateCompanySuccess)
    .fail(uiCompanies.updateCompanyFailure);
};

const onShowCompanyCreateForm = function(event) {
  event.preventDefault();
  uiCompanies.showCompanyCreateForm();
};

const addHandlers = () => {
  // $('#dashboard-home-btn').on('click', onGetCompanies);
  // $('#show-company-form').on('submit', onShowCompany);
  // // $('#new-company-form').on('submit', onCreateCompany);
  $('.content').on('submit', '#new-company-form', onCreateCompany);
  // $('#delete-company-form').on('submit', onDeleteCompany);
  // $('#update-company-form').on('submit', onUpdateCompany);
  // $('#update-company-btn').on('click', onEditCompany);
  $('.content').on('submit', '#update-company-form', onUpdateCompany);
  $('.content').on('click', '#company-record-btn-edit', onEditCompany);
  $('.content').on('click', '#new-job-new-company', onShowCompanyCreateForm);
  // // $('.company-dashboard-container').on('click', '.dashboard-company-record-btn', onShowCompanyRecord);
  $('.content').on('click', '.dashboard-company-record-btn', onShowCompanyRecord);
  $('.content').on('click', '#dashboard-home-btn', onGetCompanies);
  $('.content').on('click', '#company-record-delete', onDeleteCompany);
};

module.exports = {
  addHandlers,
};
