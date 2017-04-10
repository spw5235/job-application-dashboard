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

const onDeleteCommunication = function(event) {
  event.preventDefault();
  store.currentCommunicationId= $(this).attr("data-current-communication-id");
  communicationsApi.deleteCommunication(store.currentCommunicationId)
    .done(communicationsUi.deleteCommunicationSuccess)
    .fail(communicationsUi.deleteCommunicationFailure);
};

const onCreateCommunication = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createCommunicationData = data;
  store.lastShowCommunicationData = data;
  //
  // let category = "contact-category";
  // let categoryId = $(".select-option-value").val();
  //
  // if ( categoryId === undefined ) {
  //   data.communication.contact_ref_id = 0;
  // } else {
  //   data.communication.contact_ref_id = parseInt(categoryId);
  // }
  //
  // data.communication.contact_ref_name = dashboardLogic.determineTagText(category, categoryId);
  //

  let cMethodSelectVal = $("#communication-method-select").val();

  console.log(cMethodSelectVal);
  if (cMethodSelectVal === "Other") {
    data.communication.c_method = $("#c-method-other-text").val();
  } else {
    data.communication.c_method = $("#communication-method-select").val();
  }

  communicationsApi.createCommunication(data)
    .then((response) => {
      store.currentCommunicationId = response.communication.id;
      return store.currentCommunicationId;
    })
    .done(communicationsUi.createCommunicationSuccess)
    .fail(communicationsUi.createCommunicationFailure);
};

const onEditCommunication = function(event) {
  event.preventDefault();
  store.currentCommunicationId = $(this).attr("data-current-communication-id");
  communicationsUi.updateFormGenerator();

  // let category = "contact-category";
  //
  // dashboardLogic.tagCheckboxUpdate(category);

};

const onUpdateCommunication = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  // let category = "contact-category";
  // let categoryId = $(".select-option-value").val();
  //
  // if ( categoryId === undefined ) {
  //   data.communication.contact_ref_id = 0;
  // } else {
  //   data.communication.contact_ref_id = categoryId;
  // }
  //
  // data.communication.contact_ref_name = dashboardLogic.determineTagText(category, categoryId);

  let cMethodSelectVal = $("#communication-method-select").val();
  console.log(cMethodSelectVal);
  if (cMethodSelectVal === "Other") {
    data.communication.c_method = $("#c-method-other-text").val();
  } else {
    data.communication.c_method = $("#communication-method-select").val();
  }

  console.log(data);
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

const hideShowDoctypeOtherField = function(event) {
  event.preventDefault();
  let documentOtherHtml = $('<div class="c-method-other-container"><label class="c-method-other">Document Type Other Description</label><input id="c-method-other-text" class="form-control required-field c-method-other" name="document[doctype]" placeholder="Document Type Description" type="text"></div>');
  let selectorValue = $("#communication-method-select").val();

  if ( selectorValue === "Other" ) {
    $(".c-method").append(documentOtherHtml);
  } else {
    $(".c-method-other-container").remove();
  }
};

const addHandlers = () => {
  $('.content').on('submit', '#new-communication-form', onCreateCommunication);
  $('.content').on('submit', '#update-communication-form', onUpdateCommunication);
  $('.content').on('click', '#communication-record-btn-edit', onEditCommunication);
  $('.content').on('click', '#generate-create-communication-btn', onShowCommunicationCreateForm);
  $('.content').on('click', '.dashboard-communication-record-btn', onShowCommunicationRecord);
  // $('.content').on('click', '#get-communications-btn', onGetCommunications);
  $('#get-communications-btn').on('click', onGetCommunications);
  $('.content').on('click', '#communication-record-delete', onDeleteCommunication);
  $('.content').on('change', '#tag-contact-to-communication', onDisplayCommunicationDropdown);
  $('.content').on('change', '#select-option-contact-category', onSelectCommunicationDropdown);
  $('.content').on('change', '#communication-method-select', hideShowDoctypeOtherField);
};

module.exports = {
  addHandlers,
};
