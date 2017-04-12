'use strict';

const store = require('../store');
const displayEditContact = require('../templates/contact/update-contact-form.handlebars');
const displayContactDashboard = require('../templates/contact/get-contacts.handlebars');
const displayReminderDashboard = require('../templates/reminder/get-reminders.handlebars');
const displayContactDetails = require('../templates/contact/show-contact-record.handlebars');
const displayContactCreateForm = require('../templates/contact/create-contact.handlebars');
const contactsApi = require('./api');
const displayRadioButtonsTemplate = require('../templates/form-template/radio-btn-template.handlebars');
const displayContactOptions = require('../templates/contact/option-dropdown-contacts.handlebars');
const linkLogic = require('../dashboard/link-logic');

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

const showContactCreateForm = () => {
  $(".notification-container").children().text("");
  $(".content").children().remove();
  let showCreateContactForm = displayContactCreateForm();
  $('.content').append(showCreateContactForm);

  // Radio Template - Job
  let radioTemplate = displayRadioButtonsTemplate();
  $("#job-category-radio-container").append(radioTemplate);

  let formCategory = "contact";
  let listCategory = "job";
  linkLogic.radioClassIdNameGen(formCategory, listCategory);
};



const generateUpdateForm = function(listCategory, formCategory) {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowContactData;

  let editContact = displayEditContact({
    contact: data.contact
  });
  $('.content').append(editContact);

  let listLinkStatusSelector = "." + listCategory + "-tag-status";
  let statusDataAttr = "data-current-" + listCategory + "-ref-id";
  let listRefId = parseInt($(listLinkStatusSelector).attr(statusDataAttr));

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

  let currentRefTextVal = $(currentRefTextValTxt).val();

  if (currentRefTextVal === "") {
    $(currentRefTextVal).text("N/A");
  }

};










const updateFormGenerator = function(listCategory, formCategory) {
  $(".notification-container").children().text("");
  $(".content").children().remove();

  let data = store.lastShowContactData;

  let editContact = displayEditContact({
    contact: data.contact
  });
  $('.content').append(editContact);

  // Template Information

  // $(".job-category-radio-container input[type=radio]").attr('disabled', true);

  let jobRefId = parseInt($(".job-category-tag-status").attr("data-current-job-ref-id"));

  if (jobRefId > 0) {
    $(".job-category-tag-status").text("Linked");
  }

  let updateFormId = "#update-" + formCategory + "-form";
  let updateFormStatus = parseInt($("#update-contact-form").attr("data-update-form"));


  if ( updateFormStatus === 1) {
    let categoryText = "." + listCategory + "-radio-container ";
    $(categoryText).show();

    $(".update-radio-container-btn").hide();

    // let radioContainerClass = "." + updateCategory + "-radio-container";
    // $(radioContainerClass).hide();
  }

  let currentRefTextVal = $("#job-category-update-radio-text").val();

  if (currentRefTextVal === "") {
    $("#job-category-update-radio-text").text("N/A");
  }

};

const getContactFailure = () => {
  $(".notification-container").children().text("");
  console.log('get contact failure');
};

const createContactSuccess = (data) => {
  console.log("createsucces");
  console.log(data);
  store.currentContactId = data.contact.id;
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
  console.log("updatesuccess");
  console.log(data);

  store.currentContactId = data.contact.id;
  $(".form-error").text("");
  $(".notification-container").children().text("");
  $(".content").children().remove();
  $(".success-alert").text("Contact Has Been Successfully Updated");

  let showContactDetails = displayContactDetails({
    contact: store.createContactData.contact
  });
  $(".content").append(showContactDetails);
  $(".current").attr("data-current-contact-id", store.currentContactId);
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

const dropDownData = function(data) {
  console.log(data);
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
  showContactRecordFailure,
  createContactSuccess,
  displayContactDropdownSuccess,
  displayContactOptions,
  getReminderSuccess,
  dropDownData,
  generateUpdateForm,
};
