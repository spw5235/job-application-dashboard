'use strict';
const documentsApi = require('./api');
const documentsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const linkLogic = require('../dashboard/link-logic');
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
  store.currentJobRefId = $(this).attr("data-current-job-ref-id");
  store.currentJobRefText = $(this).attr("data-current-job-ref-text");

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

  console.log(data);
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

  // delete data.document["job-category-radio"];
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

  store.createDocumentData = data;
  store.lastShowDocumentData = data;

  let docTypeSelectVal = $("#document-type-select").val();

  if (docTypeSelectVal === "Other") {
    data.document.doctype = $("#doc-type-other-text").val();
  } else {
    data.document.doctype = $("#document-type-select").val();
  }

  let listCategory = "job";

  let refUpdatedDiv = "#" + listCategory + "-update-link";

  let isRefBeingUpdated = $(refUpdatedDiv).prop("checked");

  console.log(isRefBeingUpdated);

  if (isRefBeingUpdated) {
    let submitValue = linkLogic.obtainOptionVal(listCategory);

    data.document.job_ref_id = submitValue;


    let submitText = linkLogic.obtainOptionText(listCategory);
    data.document.job_ref_text = submitText;


    if (submitValue === -1) {
      data.document.job_ref_id = 0;
      data.document.job_ref_text = "";
    }
  } else {
    data.document.job_ref_id = parseInt(store.currentJobRefId);
    data.document.job_ref_text = store.currentJobRefText;
  }

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
  console.log(isUpdateChecked);
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

const addHandlers = () => {
  $('.content').on('submit', '#new-document-form', onCreateDocument);
  $('.content').on('submit', '#update-document-form', onUpdateDocument);
  $('.content').on('click', '#document-record-btn-edit', onEditDocument);
  $('.content').on('click', '#dashboard-new-document-btn', onShowDocumentCreateForm);
  $('.content').on('click', '.dashboard-document-record-btn', onShowDocumentRecord);
  $('#get-documents-btn').on('click', onGetDocuments);
  $('.content').on('click', '#document-record-delete', onDeleteDocument);
  $('.content').on('change', '.job-category', onDisplayJobDropdown);
  $('.content').on('change', "#job-update-link", onHideShowUpdateOptions);
  $('.content').on('change', '.update-job', onDisplayJobDropdown);
};

module.exports = {
  addHandlers,
};



























// 'use strict';
// const documentsApi = require('./api');
// const documentsUi = require('./ui');
// const getFormFields = require('../../../lib/get-form-fields');
// const store = require('../store');
// const dashboardLogic = require('../dashboard/logic');
//
// // Document EVENTS
//
// const onGetDocuments = function(event) {
//   event.preventDefault();
//   documentsApi.getDocuments()
//     .done(documentsUi.getDocumentSuccess)
//     .fail(documentsUi.getDocumentFailure);
// };
//
// const onShowDocumentRecord = function(event) {
//   event.preventDefault();
//   store.currentDocumentId = $(this).attr("data-current-document-id");
//   documentsApi.showDocument()
//     .done(documentsUi.showDocumentRecordSuccess)
//     .fail(documentsUi.showDocumentRecordFailure);
// };
//
// const onDeleteDocument = function(event) {
//   event.preventDefault();
//   store.currentDocumentId= $(this).attr("data-current-document-id");
//   documentsApi.deleteDocument(store.currentDocumentId)
//     .done(documentsUi.deleteDocumentSuccess)
//     .fail(documentsUi.deleteDocumentFailure);
// };
//
// const onCreateDocument = function(event) {
//   event.preventDefault();
//   let data = getFormFields(event.target);
//   store.createDocumentData = data;
//   store.lastShowDocumentData = data;
//
  // let docTypeSelectVal = $("#document-type-select").val();
  //
  // if (docTypeSelectVal === "Other") {
  //   data.document.doctype = $("#doc-type-other-text").val();
  // } else {
  //   data.document.doctype = $("#document-type-select").val();
  // }
//
//   documentsApi.createDocument(data)
//     .done(documentsUi.createDocumentSuccess)
//     .fail(documentsUi.createDocumentFailure);
// };
//
// const onEditDocument = function(event) {
//   event.preventDefault();
//   store.currentDocType = $("#document-record-btn-edit").attr("data-current-doc-type");
//   store.currentDocumentId = $(this).attr("data-current-document-id");
//   documentsUi.updateFormGenerator();
//
//   let category = "company-category";
//
//   dashboardLogic.tagCheckboxUpdate(category);
// };
//
// const onUpdateDocument = function(event) {
//   event.preventDefault();
//   let data = getFormFields(event.target);
//
  // let docTypeSelectVal = $("#document-type-select").val();
  //
  // if (docTypeSelectVal === "Other") {
  //   data.document.doctype = $("#doc-type-other-text").val();
  // } else {
  //   data.document.doctype = $("#document-type-select").val();
  // }
//
//   documentsApi.updateDocument(data)
//     .done(documentsUi.updateDocumentSuccess)
//     .fail(documentsUi.updateDocumentFailure);
// };
//
// const onShowDocumentCreateForm = function(event) {
//   event.preventDefault();
//   documentsUi.showDocumentCreateForm();
// };
//
// const onSelectDocumentDropdown = function(event) {
//   event.preventDefault();
//   let tagCategory = $(this).attr("class");
//   dashboardLogic.determineApiRequest(tagCategory);
// };
//
// const hideShowDoctypeOtherField = function(event) {
//   event.preventDefault();
//   let documentOtherHtml = $('<div class="doc-type-other-container"><label class="doc-type-other">Document Type Other Description</label><input id="doc-type-other-text" class="form-control required-field doc-type-other" name="document[doctype]" placeholder="Document Type Description" type="text"></div>');
//   let selectorValue = $("#document-type-select").val();
//
//   if ( selectorValue === "Other" ) {
//     $(".doc-type").append(documentOtherHtml);
//   } else {
//     $(".doc-type-other-container").remove();
//   }
// };
//
// const onDisplayDocumentDropdown = function(event) {
//   event.preventDefault();
//
//   let thisCheckBoxStatus = $(this).is(':checked');
//
//   if (!thisCheckBoxStatus) {
//     $(this).parent().children(".tag-select-container").remove();
//   }
//   let isUpdateForm;
//   let checkboxDivId = $(this).attr("id");
//   let tagCategory = $(this).attr("class");
//   let updateFormStatus = $(".general-form-container").attr("data-update-form");
//   updateFormStatus = parseInt(updateFormStatus);
//   if (updateFormStatus === 1) {
//     isUpdateForm = true;
//   } else {
//     isUpdateForm = false;
//   }
//   dashboardLogic.tagCheckboxClicked(tagCategory, checkboxDivId);
// };
//
// const addHandlers = () => {
//   $('.content').on('submit', '#new-document-form', onCreateDocument);
//   $('.content').on('submit', '#update-document-form', onUpdateDocument);
//   $('.content').on('click', '#document-record-btn-edit', onEditDocument);
//   $('.content').on('click', '#generate-create-document-btn', onShowDocumentCreateForm);
//   $('.content').on('click', '.dashboard-document-record-btn', onShowDocumentRecord);
//   $('.content').on('click', '#get-documents-btn', onGetDocuments);
//   $('#get-documents-btn').on('click', onGetDocuments);
//   $('.content').on('click', '#document-record-delete', onDeleteDocument);
//   $('.content').on('change', '#tag-company-to-document', onDisplayDocumentDropdown);
//   $('.content').on('change', '#select-option-company-category', onSelectDocumentDropdown);
//   $('.content').on('click', '#dashboard-new-document-btn', onShowDocumentCreateForm);
//   $('.content').on('change', '#document-type-select', hideShowDoctypeOtherField);
// };
//
// module.exports = {
//   addHandlers,
// };
