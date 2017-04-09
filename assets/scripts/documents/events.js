'use strict';
const documentsApi = require('./api');
const documentsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const dashboardLogic = require('../dashboard/logic');

// Document EVENTS

const onGetDocuments = function(event) {
  event.preventDefault();
  documentsApi.getDocuments()
    .done(documentsUi.getDocumentSuccess)
    .fail(documentsUi.getDocumentFailure);
};

const onShowDocumentRecord = function(event) {
  event.preventDefault();
  store.currentDocumentId = $(this).attr("data-current-document-id");
  documentsApi.showDocument()
    .done(documentsUi.showDocumentRecordSuccess)
    .fail(documentsUi.showDocumentRecordFailure);
};

const onDeleteDocument = function(event) {
  event.preventDefault();
  store.currentDocumentId= $(this).attr("data-current-document-id");
  documentsApi.deleteDocument(store.currentDocumentId)
    .done(documentsUi.deleteDocumentSuccess)
    .fail(documentsUi.deleteDocumentFailure);
};

const onCreateDocument = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createDocumentData = data;
  store.lastShowDocumentData = data;

  let docTypeSelectVal = $("#document-type-select").val();

  if (docTypeSelectVal === "Other") {
    data.document.doctype = $("#doc-type-other-text").val();
  } else {
    data.document.doctype = $("#document-type-select").val();
  }

  console.log(data);
  // documentsApi.createDocument(data)
  //   .done(documentsUi.createDocumentSuccess)
  //   .fail(documentsUi.createDocumentFailure);
};

const onEditDocument = function(event) {
  event.preventDefault();
  store.currentDocumentId = $(this).attr("data-current-document-id");
  documentsUi.updateFormGenerator();

  let category = "company-category";

  dashboardLogic.tagCheckboxUpdate(category);
};

const onUpdateDocument = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);

  documentsApi.updateDocument(data)
    .done(documentsUi.updateDocumentSuccess)
    .fail(documentsUi.updateDocumentFailure);
};

const onShowDocumentCreateForm = function(event) {
  event.preventDefault();
  documentsUi.showDocumentCreateForm();
};

const onSelectDocumentDropdown = function(event) {
  event.preventDefault();
  let tagCategory = $(this).attr("class");
  dashboardLogic.determineApiRequest(tagCategory);
};

const hideShowDoctypeOtherField = function(event) {
  event.preventDefault();
  let documentOtherHtml = $('<div class="doc-type-other-container"><label class="doc-type-other">Document Type Other Description</label><input id="doc-type-other-text" class="form-control required-field doc-type-other" name="document[doctype]" placeholder="Document Type Description" type="text"></div>');
  let selectorValue = $("#document-type-select").val();

  if ( selectorValue === "Other" ) {
    $(".doc-type").append(documentOtherHtml);
  } else {
    $(".doc-type-other-container").remove();
  }
};

const onDisplayDocumentDropdown = function(event) {
  event.preventDefault();

  let thisCheckBoxStatus = $(this).is(':checked');

  if (!thisCheckBoxStatus) {
    $(this).parent().children(".tag-select-container").remove();
  }
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
  $('.content').on('submit', '#new-document-form', onCreateDocument);
  $('.content').on('submit', '#update-document-form', onUpdateDocument);
  $('.content').on('click', '#document-record-btn-edit', onEditDocument);
  $('.content').on('click', '#generate-create-document-btn', onShowDocumentCreateForm);
  $('.content').on('click', '.dashboard-document-record-btn', onShowDocumentRecord);
  $('.content').on('click', '#get-documents-btn', onGetDocuments);
  $('.content').on('click', '#document-record-delete', onDeleteDocument);
  $('.content').on('change', '#tag-company-to-document', onDisplayDocumentDropdown);
  $('.content').on('change', '#select-option-company-category', onSelectDocumentDropdown);
  $('.content').on('click', '#dashboard-new-document-btn', onShowDocumentCreateForm);
  $('.content').on('change', '#document-type-select', hideShowDoctypeOtherField);
};

module.exports = {
  addHandlers,
};
