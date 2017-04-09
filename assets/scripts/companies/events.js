'use strict';
const companiesApi = require('./api');
const companiesUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const dashboardLogic = require('../dashboard/logic');

// Company EVENTS

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

const onDeleteCompany = function(event) {
  event.preventDefault();
  store.currentCompanyId= $(this).attr("data-current-company-id");
  companiesApi.deleteCompany(store.currentCompanyId)
    .done(companiesUi.deleteCompanySuccess)
    .fail(companiesUi.deleteCompanyFailure);
};

const onCreateCompany = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createCompanyData = data;
  store.lastShowCompanyData = data;

  let category = "company-category";
  let categoryId = $(".select-option-value").val();

  if ( categoryId === undefined ) {
    data.company.company_ref_id = 0;
  } else {
    data.company.company_ref_id = parseInt(categoryId);
  }

  data.company.company_ref_name = dashboardLogic.determineTagText(category, categoryId);

  console.log('createcompanyapi data');
  console.log(data);
  companiesApi.createCompany(data)
    // .then((response) => {
    //   store.currentCompanyId = response.company.id;
    //   return store.currentCompanyId;
    // })
    .done(companiesUi.createCompanySuccess)
    .fail(companiesUi.createCompanyFailure);
};

const onEditCompany = function(event) {
  event.preventDefault();
  store.currentCompanyId = $(this).attr("data-current-company-id");
  companiesUi.updateFormGenerator();

  let category = "company-category";

  dashboardLogic.tagCheckboxUpdate(category);
};

const onUpdateCompany = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  let category = "company-category";
  let categoryId = $(".select-option-value").val();

  if ( categoryId === undefined ) {
    data.company.company_ref_id = 0;
  } else {
    data.company.company_ref_id = parseInt(categoryId);
  }

  data.company.company_name = dashboardLogic.determineTagText(category, categoryId);

  companiesApi.updateCompany(data)
    .done(companiesUi.updateCompanySuccess)
    .fail(companiesUi.updateCompanyFailure);
};

const onShowCompanyCreateForm = function(event) {
  event.preventDefault();
  companiesUi.showCompanyCreateForm();
};

const onSelectCompanyDropdown = function(event) {
  event.preventDefault();
  let tagCategory = $(this).attr("class");
  dashboardLogic.determineApiRequest(tagCategory);
};

const onDisplayCompanyDropdown = function(event) {
  event.preventDefault();
  let isUpdateForm;
  let checkboxDivId = $(this).attr("id");
  let tagCategory = $(this).attr("class");
  let updateFormStatus = $(".general-form-container").attr("data-update-form");
  updateFormStatus = parseInt(updateFormStatus);
  if (updateFormStatus === 1) {
    isUpdateForm = true;
  } else {
    isUpdateForm = false;
  }
  dashboardLogic.tagCheckboxClicked(tagCategory, checkboxDivId);
};

const addHandlers = () => {
  $('.content').on('submit', '#new-company-form', onCreateCompany);
  $('.content').on('submit', '#update-company-form', onUpdateCompany);
  $('.content').on('click', '#company-record-btn-edit', onEditCompany);
  $('.content').on('click', '#generate-create-company-btn', onShowCompanyCreateForm);
  $('.content').on('click', '.dashboard-company-record-btn', onShowCompanyRecord);
  $('.content').on('click', '#get-companies-btn', onGetCompanies);
  $('.content').on('click', '#company-record-delete', onDeleteCompany);
  $('.content').on('change', '#tag-company-to-company', onDisplayCompanyDropdown);
  $('.content').on('change', '#select-option-company-category', onSelectCompanyDropdown);
};

module.exports = {
  addHandlers,
};
