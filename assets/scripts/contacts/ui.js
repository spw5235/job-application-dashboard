'use strict';

const store = require('../store');
const displayEditContact = require('../templates/contact/update-contact-form.handlebars');
const displayContactDashboard = require('../templates/contact/get-contacts.handlebars');
const displayReminderDashboard = require('../templates/reminder/get-reminders.handlebars');
// const displayReminderDashboardContactPage = require('../templates/reminder/get-reminders-contact.handlebars');
const displayContactDetails = require('../templates/contact/show-contact-record.handlebars');
const displayContactCreateForm = require('../templates/contact/create-contact.handlebars');
// const displayJobsTable = require('../templates/job/get-jobs.handlebars');
// const displayShowJobTable = require('../templates/job/show-job.handlebars');
const contactsApi = require('./api');
// const jobsApi = require('../jobs/api');
// const remindersApi = require('../reminders/api');
const displayContactOptions = require('../templates/contact/display-contact-create-form.handlebars');

const getReminderSuccess = (data) => {
  // let insertCompId = store.currentContactId;
  let reminderDashboard = displayReminderDashboard({
    reminders: data.reminders
    // insert: insertCompId
  });

  $('.content').append(reminderDashboard);

};

const getContactSuccess = (data) => {
  $(".notification-container").children().text("");
  store.contactDataForEdit = data;

  $(".content").children().remove();

  let contactDashboard = displayContactDashboard({
    contacts: data.contacts
  });

  $('.content').append(contactDashboard);

};

const showContactRecordSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  store.lastShowContactData = data;

  let contactDetails = displayContactDetails({
    contact: data.contact
  });
  $('.content').append(contactDetails);
};

const showContactRecordFailure = () => {
  $(".notification-container").children().text("");
  console.log('failure');
};
//
const showContactCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateContactForm = displayContactCreateForm();
  $('.content').append(showCreateContactForm);
};

const updateFormGenerator = function() {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowContactData;

  let editContact = displayEditContact({
    contact: data.contact
  });
  $('.content').append(editContact);

  $(".associate-reminder-with-contact-container").attr("current-contact-id", store.currentContactId);
  $(".associate-reminder-with-contact-container").attr("current-job", store.currentJobId);

  let companyId = parseInt($("#associate-reminder-with-company").attr("data-current-company-id"));


  if (companyId > 0) {
    console.log("true");
    // $("#associate-reminder-with-company").prop("checked", true);
    $("#associate-reminder-with-company").click();
    // $(".display-job-title").append('<div class="form-group"><label>Associate Reminder With Specific Job?</label><div class="form-group associate-reminder-with-job-container"><span>Check Box for Yes</span><input id="associate-reminder-with-job" type="checkbox" value=""></div></div>');
  }

};

const getContactFailure = () => {
  $(".notification-container").children().text("");
  console.log('get contact failure');
};

const createContactSuccess = () => {
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Contact Has Been Successfully Created");

  let showContactDetails = displayContactDetails({
    contact: store.createContactData.contact
  });
  $(".content").append(showContactDetails);
  $(".current").attr("data-current-contact-id", store.currentContactId);
};

const deleteContactSuccess = () => {
  $(".notification-container").children().text("");
  console.log('delete success');
  contactsApi.getContacts()
    .done(getContactSuccess)
    .fail(getContactFailure);
};

const deleteContactFailure = () => {
  $(".notification-container").children().text("");
  console.log('delete fail');
};

const updateContactSuccess = (data) => {
  $(".notification-container").children().text("");
  $(".success-alert").text("Contact Has Been Successfully Updated");
  store.currentContactId = data.contact.id;
  $(".content").children().remove();
  contactsApi.showContact()
    .done(showContactRecordSuccess)
    .fail(showContactRecordFailure);
};

const displayContactDropdownSuccess = function(data) {
  $(".notification-container").children().text("");

  let companyOptionDisplay = displayContactOptions({
    contacts: data.contacts
  });

  let dataUpdateFormVal = parseInt($("#update-reminder-form").attr("data-update-form"));

  $('.associate-reminder-with-contact-container').append(companyOptionDisplay);

  if (dataUpdateFormVal === 1) {
    let currentContactId = store.currentContactId;
    let valueString = '#select-option-contact-name option[value=' + currentContactId + ']';
    $(valueString).prop('selected', true);
  }
};

module.exports = {
  getContactSuccess,
  showContactRecordSuccess,
  deleteContactSuccess,
  deleteContactFailure,
  updateFormGenerator,
  showContactCreateForm,
  getContactFailure,
  updateContactSuccess,
  // updateContactFailure,
  showContactRecordFailure,
  createContactSuccess,
  displayContactDropdownSuccess,
  displayContactOptions,
  getReminderSuccess,
  // getReminderSuccess,
};
