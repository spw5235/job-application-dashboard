'use strict';

const store = require('../store');
const displayEditCommunication = require('../templates/communication/update-communication-form.handlebars');
const displayCommunicationDashboard = require('../templates/communication/get-communications.handlebars');
const displayCommunicationDetails = require('../templates/communication/show-communication-record.handlebars');
const displayCommunicationCreateForm = require('../templates/communication/create-communication.handlebars');
const communicationsApi = require('./api');
const displayRadioButtonsTemplate = require('../templates/form-template/radio-btn-template.handlebars');
const displayCommunicationOptions = require('../templates/job/option-dropdown-jobs.handlebars');
const linkLogic = require('../dashboard/link-logic');
const logic = require('../dashboard/logic');

const getCommunicationSuccess = (data) => {
  $(".notification-container").children().text("");
  store.communicationDataForEdit = data;

  $(".content").children().remove();

  let communicationsArr = data.communications;

  for (let i = 0; i < communicationsArr.length; i++) {
    let unavailable = "N/A";
    let currArrayRefText = (communicationsArr[i].job_ref_text);
    let currArrayDate = (communicationsArr[i].c_date);
    let currArraySubject = (communicationsArr[i].c_subject);

    if (currArrayRefText === "" || currArrayRefText === null) {
      communicationsArr[i].job_ref_text = unavailable;
    }
    if (currArrayDate === "" || currArrayDate === null) {
      communicationsArr[i].c_date = unavailable;
    }
    if (currArraySubject === "" || currArraySubject === null) {
      communicationsArr[i].c_subject = unavailable;
    }
  }

  console.log(data);

  let communicationDashboard = displayCommunicationDashboard({
    communications: data.communications
  });

  $('.content').append(communicationDashboard);

  let allCommunicationsEmptyLength = $(".communication-summary-table tbody").children().length;

  if (allCommunicationsEmptyLength === 0) {
    $(".communication-summary-table").remove();
    $(".all-communications-empty").text('There are no communications associated with your account. Click "Create Communication" to get started.');
  }

};

const showCommunicationRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowCommunicationData = data;
  store.lastShowCommunicationMethod = data.communication.c_method;

  let communicationDetails = displayCommunicationDetails({
    communication: data.communication
  });
  $('.content').append(communicationDetails);

  logic.displayUrl();
};

const showCommunicationRecordFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be displayed.");
};

const showCommunicationCreateForm = () => {
  let listCategory = "job";
  let formCategory = "communication";

  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateCommunicationForm = displayCommunicationCreateForm();
  $('.content').append(showCreateCommunicationForm);

  let radioTemplate = displayRadioButtonsTemplate();
  $("#" + listCategory + "-category-radio-container").append(radioTemplate);

  linkLogic.radioClassIdNameGen(formCategory, listCategory);
  $("#job-category-radio-container").hide();

  let defaultDate = logic.defaultDate();
  $(".default-date").val(defaultDate);

};


const generateUpdateForm = function(listCategory, formCategory) {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  // data-current-c-method
  let data = store.lastShowCommunicationData;

  let editCommunication = displayEditCommunication({
    communication: data.communication
  });
  $('.content').append(editCommunication);

  let listLinkStatusSelector = "." + listCategory + "-tag-status";
  let listRefId = store.currentJobRefId;

  if (listRefId > 0) {
    $(listLinkStatusSelector).text("Linked");
  }

  let updateFormId = "#update-" + formCategory + "-form";
  let updateFormStatus = parseInt($(updateFormId).attr("data-update-form"));

  if (updateFormStatus === 1) {
    let categoryText = "." + listCategory + "-radio-container ";
    $(categoryText).show();
    $(".update-radio-container-btn").hide();
  }

  let currentRefTextValTxt = "." + listCategory + "-update-radio-text";

  if (store.currentJobRefText === "") {
    $(currentRefTextValTxt).text("N/A");
  }

  let defaultval = data.communication.c_method;

  let selectText = $('#communication-method-select option[value="' + defaultval + '"]');

  $(selectText).prop('selected', true);

  let divId = "#communication-notes-input";
  logic.textAreaHeightUpdate(divId);
  let divIdTwo = "#communication-details-input";
  logic.textAreaHeightUpdate(divIdTwo);

};

const getCommunicationFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the records could not be retrieved.");
};

const createCommunicationSuccess = (data) => {
  store.currentCommunicationId = data.communication.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".success-alert").text("The record has been successfully created");
  $(".content").children().remove();

  let showCommunicationDetails = displayCommunicationDetails({
    communication: store.createCommunicationData.communication
  });
  $(".content").append(showCommunicationDetails);
  $(".current").attr("data-current-communication-id", store.currentCommunicationId);
  logic.displayUrl();
};

const deleteCommunicationSuccess = () => {
  $(".notification-container").children().text("");
  $(".success-alert").text("The record has been successfully deleted");
  communicationsApi.getCommunications()
    .done(getCommunicationSuccess)
    .fail(getCommunicationFailure);
};

const deleteCommunicationFailure = () => {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be deleted.");
};

const updateCommunicationSuccess = (data) => {

  store.currentCommunicationId = data.communication.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("The record has been successfully updated");

  let showCommunicationDetails = displayCommunicationDetails({
    communication: data.communication
  });
  $(".content").append(showCommunicationDetails);
  $(".current").attr("data-current-communication-id", store.currentCommunicationId);
  logic.displayUrl();
};

const displayCommunicationDropdownSuccess = function(data) {
  $(".notification-container").children().text("");

  let companyOptionDisplay = displayCommunicationOptions({
    communications: data.communications
  });

  let dataUpdateFormVal = parseInt($("#update-communication-form").attr("data-update-form"));

  $('.associate-reminder-with-communication-container').append(companyOptionDisplay);

  if (dataUpdateFormVal === 1) {
    let currentCommunicationId = store.currentCommunicationId;
    let valueString = '#select-option-communication-name option[value=' + currentCommunicationId + ']';
    $(valueString).prop('selected', true);
  }
};

const createCommunicationFailure = function() {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be created. Please make sure all required fields are filled");
};

const updateCommunicationFailure = function() {
  $(".notification-container").children().text("");
  $(".failure-alert").text("An error has occured and the record could not be updated. Please make sure all required fields are filled");
};

module.exports = {
  getCommunicationSuccess,
  showCommunicationRecordSuccess,
  deleteCommunicationSuccess,
  deleteCommunicationFailure,
  showCommunicationCreateForm,
  getCommunicationFailure,
  updateCommunicationSuccess,
  showCommunicationRecordFailure,
  createCommunicationSuccess,
  displayCommunicationDropdownSuccess,
  displayCommunicationOptions,
  generateUpdateForm,
  createCommunicationFailure,
  updateCommunicationFailure,
};
