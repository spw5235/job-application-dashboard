'use strict';

const store = require('../store');
const displayEditCommunication = require('../templates/communication/update-communication-form.handlebars');
const displayCommunicationDashboard = require('../templates/communication/get-communications.handlebars');
const displayReminderDashboard = require('../templates/reminder/get-reminders.handlebars');
// const displayReminderDashboardCommunicationPage = require('../templates/reminder/get-reminders-communication.handlebars');
const displayCommunicationDetails = require('../templates/communication/show-communication-record.handlebars');
const displayCommunicationCreateForm = require('../templates/communication/create-communication.handlebars');
// const displayJobsTable = require('../templates/job/get-jobs.handlebars');
// const displayShowJobTable = require('../templates/job/show-job.handlebars');
const communicationsApi = require('./api');
// const jobsApi = require('../jobs/api');
// const remindersApi = require('../reminders/api');
const displayCommunicationOptions = require('../templates/communication/display-communication-create-form.handlebars');
const dashboardLogic = require('../dashboard/logic');

const getReminderSuccess = (data) => {
  // let insertCompId = store.currentCommunicationId;
  let reminderDashboard = displayReminderDashboard({
    reminders: data.reminders
    // insert: insertCompId
  });

  $('.content').append(reminderDashboard);

};

const getCommunicationSuccess = (data) => {
  $(".notification-container").children().text("");
  store.communicationDataForEdit = data;

  $(".content").children().remove();

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
//
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
  // dashboardLogic.tagCheckboxUpdate(category);



  // $(".associate-reminder-with-communication-container").attr("current-communication-id", store.currentCommunicationId);
  //
  // let contactRefId = parseInt($("#associate-reminder-with-company").attr("data-current-contact-id"));
  //
  //
  // if (companyId > 0) {
  //   console.log("true");
  //   // $("#associate-reminder-with-company").prop("checked", true);
  //   $("#associate-reminder-with-company").click();
  //   // $(".display-job-title").append('<div class="form-group"><label>Associate Reminder With Specific Job?</label><div class="form-group associate-reminder-with-job-container"><span>Check Box for Yes</span><input id="associate-reminder-with-job" type="checkbox" value=""></div></div>');
  // }

};

const getCommunicationFailure = () => {
  $(".notification-container").children().text("");
  console.log('get communication failure');
};

const createCommunicationSuccess = () => {
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
  $(".notification-container").children().text("");
  $(".success-alert").text("Communication Has Been Successfully Updated");
  store.currentCommunicationId = data.communication.id;
  $(".content").children().remove();
  communicationsApi.showCommunication()
    .done(showCommunicationRecordSuccess)
    .fail(showCommunicationRecordFailure);
};

const displayCommunicationDropdownSuccess = function(data) {
  $(".notification-container").children().text("");

  let companyOptionDisplay = displayCommunicationOptions({
    communications: data.communications
  });

  let dataUpdateFormVal = parseInt($("#update-reminder-form").attr("data-update-form"));

  $('.associate-reminder-with-communication-container').append(companyOptionDisplay);

  if (dataUpdateFormVal === 1) {
    let currentCommunicationId = store.currentCommunicationId;
    let valueString = '#select-option-communication-name option[value=' + currentCommunicationId + ']';
    $(valueString).prop('selected', true);
  }
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
  // updateCommunicationFailure,
  showCommunicationRecordFailure,
  createCommunicationSuccess,
  displayCommunicationDropdownSuccess,
  displayCommunicationOptions,
  getReminderSuccess,
  // getReminderSuccess,
};
