'use strict';
const communicationsApi = require('./api');
const communicationsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const linkLogic = require('../dashboard/link-logic');
const logic = require('../dashboard/logic');
// Communication EVENTS

const onGetCommunications = function(event) {
  event.preventDefault();
  let screenWidth = window.innerWidth;
  if (screenWidth < 768) {
    $(".nav-mobile-ul").slideUp();
  }
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
  store.currentJobRefId = $(this).attr("data-current-job-ref-id");
  store.currentJobRefText = $(this).attr("data-current-job-ref-text");

  // Template
  let formCategory = "communication";
  let listCategory = "job";
  communicationsUi.generateUpdateForm(listCategory, formCategory);
};

const onCreateCommunication = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);

  let listCategory = "job";

  let submitValue = linkLogic.obtainOptionVal(listCategory);

  data.communication.job_ref_id = submitValue;

  let submitText = linkLogic.obtainOptionText(listCategory);
  data.communication.job_ref_text = submitText;

  if (submitValue === -1) {
    data.communication.job_ref_id = 0;
    data.communication.job_ref_text = "";
  }

  data.communication.c_method = $("#communication-method-select").val();
  data.communication.c_notes = $("#communication-notes-input").val();

  data.communication.c_link = logic.convertToUrl(data.communication.c_link);

  store.createCommunicationData = data;
  store.lastShowCommunicationData = data;

  communicationsApi.createCommunication(data)
    .done(communicationsUi.createCommunicationSuccess)
    .fail(communicationsUi.createCommunicationFailure);
};

const onDeleteCommunication = function(event) {
  event.preventDefault();
  store.currentCommunicationId= $("#communication-record-delete").attr("data-current-communication-id");
  communicationsApi.deleteCommunication(store.currentCommunicationId)
    .done(communicationsUi.deleteCommunicationSuccess)
    .fail(communicationsUi.deleteCommunicationFailure);
};

const onUpdateCommunication = function(event) {
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
          data.communication.job_ref_text = prevJobRefText;
          data.communication.job_ref_id = prevJobRefId;
        } else {
          data.communication.job_ref_text = $("#alt-input-entry-job").val();
          data.communication.job_ref_id = 0;
        }
      } else if (isRadioYesChecked) {
        let jobRefIdSelected = parseInt($("#select-element-job").val());
        if (jobRefIdSelected === -1) {
          data.communication.job_ref_id = prevJobRefId;
          data.communication.job_ref_text = prevJobRefText;
        } else {
          let jobRefIdSelected = $("#select-element-job").val();
          let textValueSelectDiv =  "#select-element-job option[value=" + jobRefIdSelected + "]";
          data.communication.job_ref_id = jobRefIdSelected;
          data.communication.job_ref_text = $(textValueSelectDiv).text();
        }
      }
    } else {
      data.communication.job_ref_text = prevJobRefText;
      data.communication.job_ref_id = prevJobRefId;
    }
  } else {
    data.communication.job_ref_text = prevJobRefText;
    data.communication.job_ref_id = prevJobRefId;
  }

  if (data.communication.job_ref_text === "Click to Select") {
    data.communication.job_ref_text = prevJobRefText;
    data.communication.job_ref_id = prevJobRefId;
  }
  data.communication.c_notes = $("#communication-notes-input").val();
  data.communication.c_method = $("#communication-method-select").val();

  data.communication.c_link = logic.convertToUrl(data.communication.c_link);

  store.createCommunicationData = data;
  store.lastShowCommunicationData = data;
  communicationsApi.updateCommunication(data)
    .done(communicationsUi.updateCommunicationSuccess)
    .fail(communicationsUi.updateCommunicationFailure);
};

const onShowCommunicationCreateForm = function(event) {
  event.preventDefault();
  communicationsUi.showCommunicationCreateForm();
};

const onDisplayJobDropdown = function(event) {
  event.preventDefault();
  let formCategory = "communication";
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
    $("#communication-ref-text-alt-job-container").remove();
    $(".display-dropdown-job").children().remove();
    $(radioButtonContainer).hide();
  }
};

const addHandlers = () => {
  $('.content').on('submit', '#new-communication-form', onCreateCommunication);
  $('.content').on('submit', '#update-communication-form', onUpdateCommunication);
  $('.content').on('click', '#communication-record-btn-edit', onEditCommunication);
  $('.content').on('click', '#generate-create-communication-btn', onShowCommunicationCreateForm);
  $('.content').on('click', '.dashboard-communication-record-btn', onShowCommunicationRecord);
  $('#get-communications-btn').on('click', onGetCommunications);
  $('.content').on('click', '.get-communications', onGetCommunications);
  $('.content').on('click', '#communication-record-delete', onDeleteCommunication);
  $('.content').on('change', "#job-update-link", onHideShowUpdateOptions);
  $('.content').on('change', '.update-job', onDisplayJobDropdown);
  $('.content').on('click', '#get-communications-back-btn', onGetCommunications);
};

module.exports = {
  addHandlers,
};
