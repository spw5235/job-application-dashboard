'use strict';
const communicationsApi = require('./api');
const communicationsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const linkLogic = require('../dashboard/link-logic');
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
  store.createCommunicationData = data;
  store.lastShowCommunicationData = data;

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

  console.log(prevJobRefId);
  console.log(prevJobRefText);


  let isRefBeingUpdated = $("#job-update-link").prop("checked");
  let isRadioNoChecked = $("#job-radio-no").prop("checked");
  let isRadioYesChecked = $("#job-radio-yes").prop("checked");
  let isEitherRadioChecked = $("#job-radio-no").prop("checked") || $("#job-radio-yes").prop("checked");


  if (isRefBeingUpdated) {

    if (isEitherRadioChecked) {
      if (isRadioNoChecked) {
        data.communication.job_ref_text = $("#alt-input-entry-job").val();
        data.communication.job_ref_id = 0;
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
  console.log(isUpdateChecked);
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
  $('.content').on('click', '#communication-record-delete', onDeleteCommunication);
  $('.content').on('change', "#job-update-link", onHideShowUpdateOptions);
  $('.content').on('change', '.update-job', onDisplayJobDropdown);
};

module.exports = {
  addHandlers,
};
//
//
//
//
//
//
//
//
//
//
//
//
//
// 'use strict';
// const communicationsApi = require('./api');
// const communicationsUi = require('./ui');
// const getFormFields = require('../../../lib/get-form-fields');
// const store = require('../store');
// const dashboardLogic = require('../dashboard/logic');
//
// // Communication EVENTS
//
// const onGetCommunications = function(event) {
//   event.preventDefault();
//   communicationsApi.getCommunications()
//     .done(communicationsUi.getCommunicationSuccess)
//     .fail(communicationsUi.getCommunicationFailure);
// };
//
// const onShowCommunicationRecord = function(event) {
//   event.preventDefault();
//   store.currentCommunicationId = $(this).attr("data-current-communication-id");
//   communicationsApi.showCommunication()
//     .done(communicationsUi.showCommunicationRecordSuccess)
//     .fail(communicationsUi.showCommunicationRecordFailure);
// };
//
// const onDeleteCommunication = function(event) {
//   event.preventDefault();
//   store.currentCommunicationId= $(this).attr("data-current-communication-id");
//   communicationsApi.deleteCommunication(store.currentCommunicationId)
//     .done(communicationsUi.deleteCommunicationSuccess)
//     .fail(communicationsUi.deleteCommunicationFailure);
// };
//
// const onCreateCommunication = function(event) {
//   event.preventDefault();
//   let data = getFormFields(event.target);
//   store.createCommunicationData = data;
//   store.lastShowCommunicationData = data;
//   //
//   // let category = "communication-category";
//   // let categoryId = $(".select-option-value").val();
//   //
//   // if ( categoryId === undefined ) {
//   //   data.communication.communication_ref_id = 0;
//   // } else {
//   //   data.communication.communication_ref_id = parseInt(categoryId);
//   // }
//   //
//   // data.communication.communication_ref_name = dashboardLogic.determineTagText(category, categoryId);
//   //
//
//   let cMethodSelectVal = $("#communication-method-select").val();
//
//   console.log(cMethodSelectVal);
//   if (cMethodSelectVal === "Other") {
//     data.communication.c_method = $("#c-method-other-text").val();
//   } else {
//     data.communication.c_method = $("#communication-method-select").val();
//   }
//
//   communicationsApi.createCommunication(data)
//     .done(communicationsUi.createCommunicationSuccess)
//     .fail(communicationsUi.createCommunicationFailure);
// };
//
// const onEditCommunication = function(event) {
//   event.preventDefault();
//   store.currentCommunicationId = $(this).attr("data-current-communication-id");
//   communicationsUi.updateFormGenerator();
//
//   // let category = "communication-category";
//   //
//   // dashboardLogic.tagCheckboxUpdate(category);
//
// };
//
// const onUpdateCommunication = function(event) {
//   event.preventDefault();
//   let data = getFormFields(event.target);
//   // let category = "communication-category";
//   // let categoryId = $(".select-option-value").val();
//   //
//   // if ( categoryId === undefined ) {
//   //   data.communication.communication_ref_id = 0;
//   // } else {
//   //   data.communication.communication_ref_id = categoryId;
//   // }
//   //
//   // data.communication.communication_ref_name = dashboardLogic.determineTagText(category, categoryId);
//
//   let cMethodSelectVal = $("#communication-method-select").val();
//   console.log(cMethodSelectVal);
//   if (cMethodSelectVal === "Other") {
//     data.communication.c_method = $("#c-method-other-text").val();
//   } else {
//     data.communication.c_method = $("#communication-method-select").val();
//   }
//
//   console.log(data);
//   communicationsApi.updateCommunication(data)
//     .done(communicationsUi.updateCommunicationSuccess)
//     .fail(communicationsUi.updateCommunicationFailure);
// };
//
// const onShowCommunicationCreateForm = function(event) {
//   event.preventDefault();
//   communicationsUi.showCommunicationCreateForm();
// };
//
// const onSelectCommunicationDropdown = function(event) {
//   event.preventDefault();
//   let tagCategory = $(this).attr("class");
//   dashboardLogic.determineApiRequest(tagCategory);
// };
//
// const onDisplayCommunicationDropdown = function(event) {
//   event.preventDefault();
//   let thisCheckBoxStatus = $(this).is(':checked');
//
//   if (!thisCheckBoxStatus) {
//     $(this).parent().children(".tag-select-container").remove();
//   }
//
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
// const hideShowDoctypeOtherField = function(event) {
//   event.preventDefault();
//   let documentOtherHtml = $('<div class="c-method-other-container"><label class="c-method-other">Document Type Other Description</label><input id="c-method-other-text" class="form-control required-field c-method-other" name="document[doctype]" placeholder="Document Type Description" type="text"></div>');
//   let selectorValue = $("#communication-method-select").val();
//
//   if ( selectorValue === "Other" ) {
//     $(".c-method").append(documentOtherHtml);
//   } else {
//     $(".c-method-other-container").remove();
//   }
// };
//
// const addHandlers = () => {
//   $('.content').on('submit', '#new-communication-form', onCreateCommunication);
//   $('.content').on('submit', '#update-communication-form', onUpdateCommunication);
//   $('.content').on('click', '#communication-record-btn-edit', onEditCommunication);
//   $('.content').on('click', '#generate-create-communication-btn', onShowCommunicationCreateForm);
//   $('.content').on('click', '.dashboard-communication-record-btn', onShowCommunicationRecord);
//   // $('.content').on('click', '#get-communications-btn', onGetCommunications);
//   $('#get-communications-btn').on('click', onGetCommunications);
//   $('.content').on('click', '#communication-record-delete', onDeleteCommunication);
//   $('.content').on('change', '#tag-communication-to-communication', onDisplayCommunicationDropdown);
//   $('.content').on('change', '#select-option-communication-category', onSelectCommunicationDropdown);
//   $('.content').on('change', '#communication-method-select', hideShowDoctypeOtherField);
// };
//
// module.exports = {
//   addHandlers,
// };
