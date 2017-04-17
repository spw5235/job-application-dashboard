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
const logic = require('../dashboard/logic');

const getDocumentSuccess = (data) => {
  $(".notification-container").children().text("");
  store.documentDataForEdit = data;

  $(".content").children().remove();

  let dataArr = data.documents;

  for (let i = 0; i < dataArr.length; i++ ) {
    let unavailable = "N/A";
    let currArrayOptOne = (dataArr[i].docdate);
    let currArrayOptTwo = (dataArr[i].docsubject);
    let currArrayOptThree = (dataArr[i].docurl);

    if (currArrayOptOne === "" || currArrayOptOne === null) {
      dataArr[i].docdate = unavailable;
    }
    if (currArrayOptTwo === "" || currArrayOptTwo === null) {
      dataArr[i].docsubject = unavailable;
    }
    if (currArrayOptThree === "" || currArrayOptThree === null) {
      dataArr[i].docurl = unavailable;
    }
  }

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
  logic.displayUrl();
};

const showDocumentRecordFailure = () => {
  $(".notification-container").children().text("");
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
  $("#job-category-radio-container").hide();
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
  let listRefId = parseInt(store.currentJobRefId);


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

  let preselectVal = store.currentDocumentType;
  let preselectDiv = "#document-type-select";
  linkLogic.preselectDefault(preselectDiv, preselectVal);

};

const getDocumentFailure = () => {
  $(".notification-container").children().text("");
};

const createDocumentSuccess = (data) => {
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
  logic.displayUrl();
};

const deleteDocumentSuccess = () => {
  $(".notification-container").children().text("");
  documentsApi.getDocuments()
    .done(getDocumentSuccess)
    .fail(getDocumentFailure);
};

const deleteDocumentFailure = () => {
  $(".notification-container").children().text("");
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
  logic.displayUrl();
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

// const dropDownData = function(data) {
//   console.log(data);
// };

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
  generateUpdateForm,
};
