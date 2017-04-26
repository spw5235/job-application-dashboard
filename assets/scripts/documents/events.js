'use strict';
const documentsApi = require('./api');
const documentsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const linkLogic = require('../dashboard/link-logic');
const logic = require('../dashboard/logic');

// Document EVENTS

const onGetDocuments = function(event) {
  event.preventDefault();
  let screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    $(".nav-mobile-ul").slideUp();
  }
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

const onEditDocument = function(event) {
  event.preventDefault();
  store.currentDocumentId = $(this).attr("data-current-document-id");
  store.currentJobRefId = $(this).attr("data-current-job-ref-id");
  store.currentJobRefText = $(this).attr("data-current-job-ref-text");
  store.currentDocumentType = $(this).attr("data-current-doc-type");

  // Template
  let formCategory = "document";
  let listCategory = "job";
  documentsUi.generateUpdateForm(listCategory, formCategory);
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

  let listCategory = "job";

  let submitValue = linkLogic.obtainOptionVal(listCategory);
  data.document.job_ref_id = submitValue;


  let submitText = linkLogic.obtainOptionText(listCategory);
  data.document.job_ref_text = submitText;

  if (submitValue === -1) {
    data.document.job_ref_id = 0;
    data.document.job_ref_text = "";
  }

  data.document.doctype = $("#document-type-select").val();
  data.document.doctext = $("#doctext-field").val();

  data.document.docurl = logic.convertToUrl(data.document.docurl);

  store.createDocumentData = data;
  store.lastShowDocumentData = data;

  documentsApi.createDocument(data)
    .done(documentsUi.createDocumentSuccess)
    .fail(documentsUi.createDocumentFailure);
};

const onDeleteDocument = function(event) {
  event.preventDefault();
  store.currentDocumentId= $("#document-record-delete").attr("data-current-document-id");
  documentsApi.deleteDocument(store.currentDocumentId)
    .done(documentsUi.deleteDocumentSuccess)
    .fail(documentsUi.deleteDocumentFailure);
};

const onUpdateDocument = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);

  let prevJobRefId = store.currentJobRefId;
  let prevJobRefText = store.currentJobRefText;
  let isRefBeingUpdated = $("#job-update-link").prop("checked");
  let isRadioNoChecked = $("#job-radio-no").prop("checked");
  let isRadioYesChecked = $("#job-radio-yes").prop("checked");
  let isEitherRadioChecked = $("#job-radio-no").prop("checked") || $("#job-radio-yes").prop("checked");

  if (isRefBeingUpdated) {

    if (isEitherRadioChecked) {
      if (isRadioNoChecked) {
        if ( $("#alt-input-entry-job").val() === "") {
          data.document.job_ref_text = prevJobRefText;
          data.document.job_ref_id = prevJobRefId;
        } else {
          data.document.job_ref_text = $("#alt-input-entry-job").val();
          data.document.job_ref_id = 0;
        }
      } else if (isRadioYesChecked) {
        let jobRefIdSelected = parseInt($("#select-element-job").val());
        if (jobRefIdSelected === -1) {
          data.document.job_ref_id = prevJobRefId;
          data.document.job_ref_text = prevJobRefText;
        } else {
          let jobRefIdSelected = $("#select-element-job").val();
          let textValueSelectDiv =  "#select-element-job option[value=" + jobRefIdSelected + "]";
          data.document.job_ref_id = jobRefIdSelected;
          data.document.job_ref_text = $(textValueSelectDiv).text();
        }
      }
    } else {
      data.document.job_ref_text = prevJobRefText;
      data.document.job_ref_id = prevJobRefId;
    }
  } else {
    data.document.job_ref_text = prevJobRefText;
    data.document.job_ref_id = prevJobRefId;
  }

  if (data.document.job_ref_text === "Click to Select") {
    data.document.job_ref_text = prevJobRefText;
    data.document.job_ref_id = prevJobRefId;
  }

  data.document.doctype = $("#document-type-select").val();
  data.document.doctext = $("#doctext-field").val();
  data.document.docurl = logic.convertToUrl(data.document.docurl);

  store.createDocumentData = data;
  store.lastShowDocumentData = data;

  documentsApi.updateDocument(data)
    .done(documentsUi.updateDocumentSuccess)
    .fail(documentsUi.updateDocumentFailure);
};

const onShowDocumentCreateForm = function(event) {
  event.preventDefault();
  documentsUi.showDocumentCreateForm();
};

const onDisplayJobDropdown = function(event) {
  event.preventDefault();
  let formCategory = "document";
  let listCategory = "job";

  let linkContainerSelect = ".display-dropdown-" + listCategory;

  let altFormContainer = ".display-alt-" + listCategory;
  let selectVal = parseInt($(this).val());

  if (selectVal === 1) {
    $(altFormContainer).children().remove();
    linkLogic.showDropOptionsCreatePage(formCategory, listCategory);
  } else {
    $(linkContainerSelect).children().remove();
    linkLogic.altOptionAppend(formCategory, listCategory);
  }
};

const onHideShowUpdateOptions = function() {
  let isUpdateChecked = $(this).prop("checked");
  let radioButtonContainer = $(this).parent().parent().parent().children(".update-radio-container-btn");
  if ( isUpdateChecked ) {
    $(".job-radio-container input").prop("checked", false);
    $(radioButtonContainer).show();
  } else {
    $(".job-radio-container input").prop("checked", false);
    $("#document-ref-text-alt-job-container").remove();
    $(".display-dropdown-job").children().remove();
    $(radioButtonContainer).hide();
  }
};

const resizeTextArea = function() {
    let divId = $(this).attr("id");
    logic.onResizeTextarea(divId);
};

const addHandlers = () => {
  $('.content').on('submit', '#new-document-form', onCreateDocument);
  $('.content').on('submit', '#update-document-form', onUpdateDocument);
  $('.content').on('click', '#document-record-btn-edit', onEditDocument);
  $('.content').on('click', '#dashboard-new-document-btn', onShowDocumentCreateForm);
  $('.content').on('click', '.dashboard-document-record-btn', onShowDocumentRecord);
  $('#get-documents-btn').on('click', onGetDocuments);
  $('.content').on('click', '#document-record-delete', onDeleteDocument);
  $('.content').on('change', "#job-update-link", onHideShowUpdateOptions);
  $('.content').on('change', '.update-job', onDisplayJobDropdown);
  $('.content').on('click', '#get-documents-back-btn', onGetDocuments);
  $('.content').on('keyup', '#doctext-field', resizeTextArea);
};

module.exports = {
  addHandlers,
};
