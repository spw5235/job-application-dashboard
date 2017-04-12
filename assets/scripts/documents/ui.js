'use strict';

const store = require('../store');
const displayEditDocument = require('../templates/document/update-document-form.handlebars');
const displayDocumentDashboard = require('../templates/document/get-documents.handlebars');
const displayDocumentDetails = require('../templates/document/show-document-record.handlebars');
const displayDocumentCreateForm = require('../templates/document/create-document.handlebars');
const documentsApi = require('./api');
const displayRadioButtonsTemplate = require('../templates/form-template/radio-btn-template.handlebars');
const displayDocumentOptions = require('../templates/document/option-dropdown-documents.handlebars');
const linkLogic = require('../dashboard/link-logic');

const getDocumentSuccess = (data) => {
  $(".notification-container").children().text("");
  store.documentDataForEdit = data;

  $(".content").children().remove();

  let documentDashboard = displayDocumentDashboard({
    documents: data.documents
  });

  $('.content').append(documentDashboard);

};

const showDocumentRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowDocumentData = data;

  let documentDetails = displayDocumentDetails({
    document: data.document
  });
  $('.content').append(documentDetails);
};

const showDocumentRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};

const showDocumentCreateForm = () => {
  let listCategory = "job";
  let formCategory = "document";


  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateDocumentForm = displayDocumentCreateForm();
  $('.content').append(showCreateDocumentForm);

  let radioTemplate = displayRadioButtonsTemplate();
  $("#" + listCategory + "-category-radio-container").append(radioTemplate);

  linkLogic.radioClassIdNameGen(formCategory, listCategory);
};


const generateUpdateForm = function(listCategory, formCategory) {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowDocumentData;

  let editDocument = displayEditDocument({
    document: data.document
  });
  $('.content').append(editDocument);

  let listLinkStatusSelector = "." + listCategory + "-tag-status";
  let statusDataAttr = "data-current-" + listCategory + "-ref-id";
  let listRefId = parseInt(store.currentJobRefId);

  console.log(listRefId);
  if (listRefId > 0) {
    $(listLinkStatusSelector).text("Linked");
  }

  let updateFormId = "#update-" + formCategory + "-form";
  let updateFormStatus = parseInt($(updateFormId).attr("data-update-form"));

  if ( updateFormStatus === 1) {
    let categoryText = "." + listCategory + "-radio-container ";
    $(categoryText).show();
    $(".update-radio-container-btn").hide();
  }

  let currentRefTextValTxt = "." + listCategory + "-update-radio-text";

  if (store.currentJobRefText === "") {
    $(currentRefTextValTxt).text("N/A");
  }

};

const getDocumentFailure = () => {
  $(".notification-container").children().text("");
  console.log('get document failure');
};

const createDocumentSuccess = (data) => {
  console.log("createsucces");
  console.log(data);
  store.currentDocumentId = data.document.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Document Has Been Successfully Created");

  let showDocumentDetails = displayDocumentDetails({
    document: store.createDocumentData.document
  });
  $(".content").append(showDocumentDetails);
  $(".current").attr("data-current-document-id", store.currentDocumentId);
};

const deleteDocumentSuccess = () => {
  $(".notification-container").children().text("");
  console.log('delete success');
  documentsApi.getDocuments()
    .done(getDocumentSuccess)
    .fail(getDocumentFailure);
};

const deleteDocumentFailure = () => {
  $(".notification-container").children().text("");
  console.log('delete fail');
};

const updateDocumentSuccess = (data) => {

  store.currentDocumentId = data.document.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Document Has Been Successfully Updated");

  let showDocumentDetails = displayDocumentDetails({
    document: data.document
  });
  $(".content").append(showDocumentDetails);
  $(".current").attr("data-current-document-id", store.currentDocumentId);
};

const displayDocumentDropdownSuccess = function(data) {
  $(".notification-container").children().text("");

  let companyOptionDisplay = displayDocumentOptions({
    documents: data.documents
  });

  let dataUpdateFormVal = parseInt($("#update-document-form").attr("data-update-form"));

  $('.associate-reminder-with-document-container').append(companyOptionDisplay);

  if (dataUpdateFormVal === 1) {
    let currentDocumentId = store.currentDocumentId;
    let valueString = '#select-option-document-name option[value=' + currentDocumentId + ']';
    $(valueString).prop('selected', true);
  }
};

const dropDownData = function(data) {
  console.log(data);
};

module.exports = {
  getDocumentSuccess,
  showDocumentRecordSuccess,
  deleteDocumentSuccess,
  deleteDocumentFailure,
  showDocumentCreateForm,
  getDocumentFailure,
  updateDocumentSuccess,
  showDocumentRecordFailure,
  createDocumentSuccess,
  displayDocumentDropdownSuccess,
  displayDocumentOptions,
  dropDownData,
  generateUpdateForm,
};





































// 'use strict';
//
// const store = require('../store');
// const displayEditDocument = require('../templates/document/update-document-form.handlebars');
// const displayDocumentDashboard = require('../templates/document/get-documents.handlebars');
// const displayDocumentDetails = require('../templates/document/show-document-record.handlebars');
// const displayDocumentCreateForm = require('../templates/document/create-document.handlebars');
// const documentsApi = require('./api');
// const dashboardLogic = require('../dashboard/logic');
//
// const getDocumentSuccess = (data) => {
//   $(".notification-container").children().text("");
//   store.documentDataForEdit = data;
//
//   $(".content").children().remove();
//
//   let documentDashboard = displayDocumentDashboard({
//     documents: data.documents
//   });
//
//   $('.content').append(documentDashboard);
//
// };
//
// const showDocumentRecordSuccess = (data) => {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   store.lastShowDocumentData = data;
//
//   let documentDetails = displayDocumentDetails({
//     document: data.document
//   });
//   $('.content').append(documentDetails);
// };
//
// const showDocumentRecordFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('failure');
// };
//
// const showDocumentCreateForm = () => {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   let showCreateDocumentForm = displayDocumentCreateForm();
//   $('.content').append(showCreateDocumentForm);
// };
//
// const updateFormGenerator = function() {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//
//   let data = store.lastShowDocumentData;
//
//   let editDocument = displayEditDocument({
//     document: data.document
//   });
//   $('.content').append(editDocument);
//
//   let divId = "#document-type-select";
//   let currentDocType = $("#document-type-select").attr("data-current-doc-type");
//   let documentOtherHtml = $('<div class="doc-type-other-container"><label class="doc-type-other">Document Type Other Description</label><input id="doc-type-other-text" class="form-control required-field doc-type-other" name="document[doctype]" placeholder="Document Type Description" type="text"></div>');
//
//   console.log(currentDocType);
//
//   let isDefaultDocType = dashboardLogic.isDefaultDocType(currentDocType);
//
//
//   console.log(isDefaultDocType);
//
//   if (isDefaultDocType) {
//     $(".doc-type-other-container").remove();
//     dashboardLogic.preselectDefault(divId, currentDocType);
//     // $('#document-type-select option[value="' + currentDocType + '"]').prop('selected', true);
//   } else {
//     $(".doc-type").append(documentOtherHtml);
//     $("#document-type-select option[value=Other]").prop('selected', true);
//     $("#doc-type-other-text").val(currentDocType);
//   }
// };
//
// const getDocumentFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('get document failure');
// };
//
// const createDocumentSuccess = (data) => {
//   console.log('document success data');
//   console.log(data);
//   store.currentDocumentId = data.document.id;
//   $(".form-error").text("");
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   $(".success-alert").text("Document Has Been Successfully Created");
//
//   let showDocumentDetails = displayDocumentDetails({
//     document: data.document
//   });
//   $(".content").append(showDocumentDetails);
//   $(".current").attr("data-current-document-id", store.currentDocumentId);
// };
//
// const deleteDocumentSuccess = () => {
//   $(".notification-container").children().text("");
//   console.log('delete success');
//   documentsApi.getDocuments()
//     .done(getDocumentSuccess)
//     .fail(getDocumentFailure);
// };
//
// const deleteDocumentFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('delete fail');
// };
//
// const updateDocumentSuccess = (data) => {
//   $(".notification-container").children().text("");
//   $(".success-alert").text("Document Has Been Successfully Updated");
//   store.currentDocumentId = data.document.id;
//   $(".content").children().remove();
//   console.log(data);
//   documentsApi.showDocument()
//     .done(showDocumentRecordSuccess)
//     .fail(showDocumentRecordFailure);
// };
//
// module.exports = {
//   getDocumentSuccess,
//   showDocumentRecordSuccess,
//   deleteDocumentSuccess,
//   deleteDocumentFailure,
//   updateFormGenerator,
//   showDocumentCreateForm,
//   getDocumentFailure,
//   updateDocumentSuccess,
//   showDocumentRecordFailure,
//   createDocumentSuccess,
// };
