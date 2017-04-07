'use strict';
const documentsApi = require('./api');
const documentsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');

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

const onEditDocument = function(event) {
  event.preventDefault();
  store.currentDocumentId = $(this).attr("data-current-document-id");
  documentsUi.updateFormGenerator();
};

const onCreateDocument = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createDocumentData = data;
  store.lastShowDocumentData = data;

  data.document.company_ref_id = $("#select-option-company-name").val();
  data.document.job_ref_id= $("#select-option-job-title").val();

  documentsApi.createDocument(data)
    .then((response) => {
      store.currentDocumentId = response.document.id;
      return store.currentDocumentId;
    })
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
  data.document.company_ref_id = parseInt($("#select-option-company-name").val());
  data.document.job_ref_id = parseInt($("#select-option-job-title").val());
  documentsApi.updateDocument(data)
    .done(documentsUi.updateDocumentSuccess)
    .fail(documentsUi.updateDocumentFailure);
};

const onShowDocumentCreateForm = function(event) {
  event.preventDefault();
  documentsUi.showDocumentCreateForm();
};


//
//
// const onDisplayCompanyDropdown = function() {
//
//   // let isUpdateForm = $(".reminder-form").attr("data-update-form");
//
//   let isCompanyChecked = $("#associate-document-with-company").prop("checked");
//
//   if (!isCompanyChecked) {
//     store.selectedCompanyId = 0;
//     store.selectedCompanyName = "";
//   }
//
//   if (this.checked) {
//     let currentReminderCompanyId = $("#associate-document-with-company").attr("data-current-company-id");
//
//     if ( currentReminderCompanyId === 0 ) {
//       $("#company-select-options").remove();
//       $("#job-select-options").remove();
//       $(".display-job-title").children().remove();
//       return;
//     }
//
//     companiesApi.getCompanies()
//       .done(remindersUi.displayCompanyDropdownSuccess)
//       .fail(remindersUi.displayCompanyDropdownFail);
//   } else {
//     $("associate-reminder-with-company").val(0);
//     $("#company-select-options").remove();
//     $("#job-select-options").remove();
//     $(".display-job-title").children().remove();
//     $(".association-job-insert").remove();
//   }
//
//   let selectedVal = $("#select-option-company-name").val();
//   let selectedValInt = parseInt(selectedVal);
//
//   if (selectedValInt > 0) {
//       $("#company-select-options").append('<div class="form-group"><label>Associate Reminder With Specific Job?</label><div class="form-group associate-reminder-with-job-container"><span>Check Box for Yes</span><input id="associate-reminder-with-job" type="checkbox" value=""></div></div>');
//   }
// };
//
// const onSelectOptionCompanyVal = function() {
//   let obtainVal = $(this).val();
//
//   if (obtainVal === 0 || obtainVal === "0") {
//     let valueString = '#select-option-job-title option[value=0]';
//     $(valueString).prop('selected',true);
//     store.selectedCompanyId = 0;
//     store.selectedCompanyName = "";
//     // $("#job-select-options").remove();
//     // store.selectedJobId = 0;
//     // store.selectedJobTitle = 0;
//     $("#associate-reminder-with-job").prop("checked", false);
//     $(".association-job-insert").remove();
//   }
//
//   let obtainValString = '#select-option-company-name option[value="' + obtainVal + '"]';
//   let companyName = $(obtainValString).text();
//
//   store.selectedCompanyId = obtainVal;
//   store.selectedCompanyName = companyName;
//
//   if (obtainVal > 0) {
//     $("#company-select-options").append('<div class="form-group association-job-insert"><label>Associate Reminder With Specific Job?</label><div class="form-group associate-reminder-with-job-container"><span>Check Box for Yes</span><input id="associate-reminder-with-job" type="checkbox" value=""></div></div>');
//   }
// };


const addHandlers = () => {
  $('.content').on('submit', '#new-document-form', onCreateDocument);
  $('.content').on('submit', '#update-document-form', onUpdateDocument);
  $('.content').on('click', '#document-record-btn-edit', onEditDocument);
  $('.content').on('click', '#generate-create-document-btn', onShowDocumentCreateForm);
  $('.content').on('click', '.dashboard-document-record-btn', onShowDocumentRecord);
  $('.content').on('click', '#get-documents-btn', onGetDocuments);
  $('.content').on('click', '#document-record-delete', onDeleteDocument);

  // $('.content').on('change', '#associate-document-with-company', onDisplayCompanyDropdown);
  // $('.content').on('change', '#select-option-company-name', onSelectOptionCompanyVal);
  // $('.content').on('click', '#job-back-document-overview', onShowDocumentRecord);
};

module.exports = {
  addHandlers,
};
