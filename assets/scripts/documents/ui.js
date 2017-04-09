'use strict';

const store = require('../store');
const displayEditDocument = require('../templates/document/update-document-form.handlebars');
const displayDocumentDashboard = require('../templates/document/get-documents.handlebars');
const displayDocumentDetails = require('../templates/document/show-document-record.handlebars');
const displayDocumentCreateForm = require('../templates/document/create-document.handlebars');
const documentsApi = require('./api');

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
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateDocumentForm = displayDocumentCreateForm();
  $('.content').append(showCreateDocumentForm);
};

const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowDocumentData;

  let editDocument = displayEditDocument({
    document: data.document
  });
  $('.content').append(editDocument);

};

const getDocumentFailure = () => {
  $(".notification-container").children().text("");
  console.log('get document failure');
};

const createDocumentSuccess = (data) => {
  console.log('document success data');
  console.log(data);
  store.currentDocumentId = data.document.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Document Has Been Successfully Created");

  let showDocumentDetails = displayDocumentDetails({
    document: data.document
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
  $(".notification-container").children().text("");
  $(".success-alert").text("Document Has Been Successfully Updated");
  store.currentDocumentId = data.document.id;
  $(".content").children().remove();
  console.log(data);
  documentsApi.showDocument()
    .done(showDocumentRecordSuccess)
    .fail(showDocumentRecordFailure);
};

module.exports = {
  getDocumentSuccess,
  showDocumentRecordSuccess,
  deleteDocumentSuccess,
  deleteDocumentFailure,
  updateFormGenerator,
  showDocumentCreateForm,
  getDocumentFailure,
  updateDocumentSuccess,
  showDocumentRecordFailure,
  createDocumentSuccess,
};
