'use strict';
const communicationsApi = require('./api');
const communicationsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const dashboardLogic = require('../dashboard/logic');

// Communication EVENTS

const onGetCommunications = function(event) {
  event.preventDefault();
  communicationsApi.getCommunications()
    .done(communicationsUi.getCommunicationSuccess)
    .fail(communicationsUi.getCommunicationFailure);
};

const onShowCommunicationRecord = function(event) {
  event.preventDefault();
  store.currentCommunicationId = $(this).attr("data-current-communication-id");
  communicationsApi.showCommunication()
    .done(communicationsUi.showCommunicationRecordSuccess)
    .fail(communicationsUi.showCommunicationRecordFailure);
};

const onEditCommunication = function(event) {
  event.preventDefault();
  store.currentCommunicationId = $(this).attr("data-current-communication-id");
  communicationsUi.updateFormGenerator();

  let category = "contact-category";

  dashboardLogic.tagCheckboxUpdate(category);

};

const onCreateCommunication = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createCommunicationData = data;
  store.lastShowCommunicationData = data;

  let submittedRefId = $("#select-option-contact-category").val();

  data.communication.contact_ref_id = submittedRefId;

  let communicationTextSelect = $("#select-option-contact-category option[value=" + submittedRefId + "]").text();

  data.communication.contact_ref_name = communicationTextSelect;

  communicationsApi.createCommunication(data)
    .then((response) => {
      store.currentCommunicationId = response.communication.id;
      return store.currentCommunicationId;
    })
    .done(communicationsUi.createCommunicationSuccess)
    .fail(communicationsUi.createCommunicationFailure);
};

const onDeleteCommunication = function(event) {
  event.preventDefault();
  store.currentCommunicationId= $(this).attr("data-current-communication-id");
  communicationsApi.deleteCommunication(store.currentCommunicationId)
    .done(communicationsUi.deleteCommunicationSuccess)
    .fail(communicationsUi.deleteCommunicationFailure);
};

const onUpdateCommunication = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  let category = "contact-category";
  let categoryId = dashboardLogic.determineTagId(category);

  data.communication.contact_ref_id = categoryId;
  data.communication.contact_ref_name = dashboardLogic.determineTagText(category, categoryId);

  communicationsApi.updateCommunication(data)
    .done(communicationsUi.updateCommunicationSuccess)
    .fail(communicationsUi.updateCommunicationFailure);
};

const onShowCommunicationCreateForm = function(event) {
  event.preventDefault();
  communicationsUi.showCommunicationCreateForm();
};

const onSelectCommunicationDropdown = function(event) {
  event.preventDefault();
  let tagCategory = $(this).attr("class");
  dashboardLogic.determineApiRequest(tagCategory);
};

const onDisplayCommunicationDropdown = function(event) {
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
  $('.content').on('submit', '#new-communication-form', onCreateCommunication);
  $('.content').on('submit', '#update-communication-form', onUpdateCommunication);
  $('.content').on('click', '#communication-record-btn-edit', onEditCommunication);
  $('.content').on('click', '#generate-create-communication-btn', onShowCommunicationCreateForm);
  $('.content').on('click', '.dashboard-communication-record-btn', onShowCommunicationRecord);
  $('.content').on('click', '#get-communications-btn', onGetCommunications);
  $('.content').on('click', '#communication-record-delete', onDeleteCommunication);
  $('.content').on('change', '#tag-contact-to-communication', onDisplayCommunicationDropdown);
  $('.content').on('change', '#select-option-contact-category', onSelectCommunicationDropdown);
};

module.exports = {
  addHandlers,
};
