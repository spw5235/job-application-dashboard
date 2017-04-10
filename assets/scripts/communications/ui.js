'use strict';

const store = require('../store');
const displayEditCommunication = require('../templates/communication/update-communication-form.handlebars');
const displayCommunicationDashboard = require('../templates/communication/get-communications.handlebars');
const displayCommunicationDetails = require('../templates/communication/show-communication-record.handlebars');
const displayCommunicationCreateForm = require('../templates/communication/create-communication.handlebars');
const displaySecondaryCommunicationContact = require('../templates/communication/secondary-get-communications-contacts.handlebars');
const communicationsApi = require('./api');
const dashboardLogic = require('../dashboard/logic');

const getCommunicationSuccess = (data) => {
  $(".notification-container").children().text("");
  store.communicationDataForEdit = data;
  console.log(data);

  $(".content").children().remove();

  let communicationDashboard = displayCommunicationDashboard({
    communications: data.communications
  });

  $('.content').append(communicationDashboard);

  // let secondaryCommunicationContact = displaySecondaryCommunicationContact({
  //   communications: data.communications
  // });
  //
  // $('.content').append(secondaryCommunicationContact);
  //
  // dashboardLogic.removeDuplicateRows($('.secondary-table'));

};

const showCommunicationRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowCommunicationData = data;

  let communicationDetails = displayCommunicationDetails({
    communication: data.communication
  });
  $('.content').append(communicationDetails);

  let urlVal = $("#communication-text-link-url").attr("href");
  let urlShortenText = dashboardLogic.urlArrIdentifier(urlVal);
  console.log(urlShortenText);
  // let urlText = dashboardLogic.shortDisplayedUrl(urlType, urlVal);
  $("#communication-text-link-url").text(urlShortenText);
};

const showCommunicationRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};

const showCommunicationCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateCommunicationForm = displayCommunicationCreateForm();
  $('.content').append(showCreateCommunicationForm);
};

const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowCommunicationData;

  let editCommunication = displayEditCommunication({
    communication: data.communication
  });
  $('.content').append(editCommunication);

  let divId = "#communication-method-select";
  let currentCMethod = $("#communication-method-select").attr("data-current-c-method");
  let communicationOtherHtml = $('<div class="c-method-other-container"><label class="c-method-other">Document Type Other Description</label><input id="c-method-other-text" class="form-control required-field c-method-other" name="document[doctype]" placeholder="Document Type Description" type="text"></div>');

  console.log(currentCMethod);

  let isDefaultCMethod = dashboardLogic.isDefaultCMethod(currentCMethod);

  console.log(isDefaultCMethod);

  if (isDefaultCMethod) {
    $(".c-method-other-container").remove();
    dashboardLogic.preselectDefault(divId, currentCMethod);
    // $('#communication-method-select option[value="' + currentCMethod + '"]').prop('selected', true);
  } else {
    $(".c-method").append(communicationOtherHtml);
    $("#communication-method-select option[value=Other]").prop('selected', true);
    $("#c-method-other-text").val(currentCMethod);
  }


};

const getCommunicationFailure = () => {
  $(".notification-container").children().text("");
  console.log('get communication failure');
};

const createCommunicationSuccess = (data) => {
  console.log(data);
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Communication Has Been Successfully Created");

  let showCommunicationDetails = displayCommunicationDetails({
    communication: data.communication
  });
  $(".content").append(showCommunicationDetails);
  $(".current").attr("data-current-communication-id", store.currentCommunicationId);
};

const deleteCommunicationSuccess = () => {
  $(".notification-container").children().text("");
  console.log('delete success');
  communicationsApi.getCommunications()
    .done(getCommunicationSuccess)
    .fail(getCommunicationFailure);
};

const deleteCommunicationFailure = () => {
  $(".notification-container").children().text("");
  console.log('delete fail');
};

const updateCommunicationSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".success-alert").text("Communication Has Been Successfully Updated");
  store.currentCommunicationId = data.communication.id;
  $(".content").children().remove();
  console.log(data);
  communicationsApi.showCommunication()
    .done(showCommunicationRecordSuccess)
    .fail(showCommunicationRecordFailure);
};

module.exports = {
  getCommunicationSuccess,
  showCommunicationRecordSuccess,
  deleteCommunicationSuccess,
  deleteCommunicationFailure,
  updateFormGenerator,
  showCommunicationCreateForm,
  getCommunicationFailure,
  updateCommunicationSuccess,
  showCommunicationRecordFailure,
  createCommunicationSuccess,
};
