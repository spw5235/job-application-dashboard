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

const getCommunicationSuccess = (data) => {
  $(".notification-container").children().text("");
  store.communicationDataForEdit = data;

  $(".content").children().remove();

  console.log(data);

  let communicationsArr = data.communications;

  for (let i = 0; i < communicationsArr.length; i++ ) {
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

  let communicationDashboard = displayCommunicationDashboard({
    communications: data.communications
  });

  $('.content').append(communicationDashboard);

};

const showCommunicationRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowCommunicationData = data;

  let communicationDetails = displayCommunicationDetails({
    communication: data.communication
  });
  $('.content').append(communicationDetails);
};

const showCommunicationRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
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
};


const generateUpdateForm = function(listCategory, formCategory) {
  $(".notification-container").children().text("");
  $(".content").children().remove();

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

const getCommunicationFailure = () => {
  $(".notification-container").children().text("");
  console.log('get communication failure');
};

const createCommunicationSuccess = (data) => {
  console.log("createsucces");
  console.log(data);
  store.currentCommunicationId = data.communication.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Communication Has Been Successfully Created");

  let showCommunicationDetails = displayCommunicationDetails({
    communication: store.createCommunicationData.communication
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

  store.currentCommunicationId = data.communication.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Communication Has Been Successfully Updated");

  let showCommunicationDetails = displayCommunicationDetails({
    communication: data.communication
  });
  $(".content").append(showCommunicationDetails);
  $(".current").attr("data-current-communication-id", store.currentCommunicationId);
  // $("#communication-record-btn-edit").attr("data-current-communication-job_ref_id", data.communication.job_ref_id);
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

const dropDownData = function(data) {
  console.log(data);
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
  dropDownData,
  generateUpdateForm,
};
//
//
//
//
// 'use strict';
//
// const store = require('../store');
// const displayEditCommunication = require('../templates/communication/update-communication-form.handlebars');
// const displayCommunicationDashboard = require('../templates/communication/get-communications.handlebars');
// const displayCommunicationDetails = require('../templates/communication/show-communication-record.handlebars');
// const displayCommunicationCreateForm = require('../templates/communication/create-communication.handlebars');
// const displaySecondaryCommunicationCommunication = require('../templates/communication/secondary-get-communications-communications.handlebars');
// const communicationsApi = require('./api');
// const dashboardLogic = require('../dashboard/logic');
//
// const getCommunicationSuccess = (data) => {
//   $(".notification-container").children().text("");
//   store.communicationDataForEdit = data;
//   console.log(data);
//
//   $(".content").children().remove();
//
//   let communicationDashboard = displayCommunicationDashboard({
//     communications: data.communications
//   });
//
//   $('.content').append(communicationDashboard);
//
//   // let secondaryCommunicationCommunication = displaySecondaryCommunicationCommunication({
//   //   communications: data.communications
//   // });
//   //
//   // $('.content').append(secondaryCommunicationCommunication);
//   //
//   // dashboardLogic.removeDuplicateRows($('.secondary-table'));
//
// };
//
// const showCommunicationRecordSuccess = (data) => {
//   store.currentCommunicationId = data.communication.id;
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//
//   let communicationDetails = displayCommunicationDetails({
//     communication: data.communication
//   });
//   $('.content').append(communicationDetails);
//
//   let urlVal = $("#communication-text-link-url").attr("href");
//   let urlShortenText = dashboardLogic.urlArrIdentifier(urlVal);
//   console.log(urlShortenText);
//   // let urlText = dashboardLogic.shortDisplayedUrl(urlType, urlVal);
//   $("#communication-text-link-url").text(urlShortenText);
// };
//
// const showCommunicationRecordFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('failure');
// };
//
// const showCommunicationCreateForm = () => {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   let showCreateCommunicationForm = displayCommunicationCreateForm();
//   $('.content').append(showCreateCommunicationForm);
// };
//
// const updateFormGenerator = function() {
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//
//   let data = store.lastShowCommunicationData;
//
//   let editCommunication = displayEditCommunication({
//     communication: data.communication
//   });
//   $('.content').append(editCommunication);
//
//   let divId = "#communication-method-select";
//   let currentCMethod = $("#communication-method-select").attr("data-current-c-method");
//   let communicationOtherHtml = $('<div class="c-method-other-container"><label class="c-method-other">Document Type Other Description</label><input id="c-method-other-text" class="form-control required-field c-method-other" name="document[doctype]" placeholder="Document Type Description" type="text"></div>');
//
//   console.log(currentCMethod);
//
//   let isDefaultCMethod = dashboardLogic.isDefaultCMethod(currentCMethod);
//
//   console.log(isDefaultCMethod);
//
//   if (isDefaultCMethod) {
//     $(".c-method-other-container").remove();
//     dashboardLogic.preselectDefault(divId, currentCMethod);
//     // $('#communication-method-select option[value="' + currentCMethod + '"]').prop('selected', true);
//   } else {
//     $(".c-method").append(communicationOtherHtml);
//     $("#communication-method-select option[value=Other]").prop('selected', true);
//     $("#c-method-other-text").val(currentCMethod);
//   }
//
//
// };
//
// const getCommunicationFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('get communication failure');
// };
//
// const createCommunicationSuccess = (data) => {
//   console.log(data);
//   $(".form-error").text("");
//   $(".notification-container").children().text("");
//   $(".content").children().remove();
//   $(".success-alert").text("Communication Has Been Successfully Created");
//
//   let showCommunicationDetails = displayCommunicationDetails({
//     communication: data.communication
//   });
//   $(".content").append(showCommunicationDetails);
//   $(".current").attr("data-current-communication-id", store.currentCommunicationId);
// };
//
// const deleteCommunicationSuccess = () => {
//   $(".notification-container").children().text("");
//   console.log('delete success');
//   communicationsApi.getCommunications()
//     .done(getCommunicationSuccess)
//     .fail(getCommunicationFailure);
// };
//
// const deleteCommunicationFailure = () => {
//   $(".notification-container").children().text("");
//   console.log('delete fail');
// };
//
// const updateCommunicationSuccess = (data) => {
//   $(".notification-container").children().text("");
//   $(".success-alert").text("Communication Has Been Successfully Updated");
//   store.currentCommunicationId = data.communication.id;
//   $(".content").children().remove();
//   console.log(data);
//   communicationsApi.showCommunication()
//     .done(showCommunicationRecordSuccess)
//     .fail(showCommunicationRecordFailure);
// };
//
// module.exports = {
//   getCommunicationSuccess,
//   showCommunicationRecordSuccess,
//   deleteCommunicationSuccess,
//   deleteCommunicationFailure,
//   updateFormGenerator,
//   showCommunicationCreateForm,
//   getCommunicationFailure,
//   updateCommunicationSuccess,
//   showCommunicationRecordFailure,
//   createCommunicationSuccess,
// };
