'use strict';
const contactsApi = require('./api');
const contactsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const dashboardLogic = require('../dashboard/logic');
const jobOptions = require("../templates/link/contact-form-job-link.handlebars");
const linkLogic = require('../dashboard/link-logic');
// Contact EVENTS

const onGetContacts = function(event) {
  event.preventDefault();
  contactsApi.getContacts()
    .done(contactsUi.getContactSuccess)
    .fail(contactsUi.getContactFailure);
};

const onShowContactRecord = function(event) {
  event.preventDefault();
  store.currentContactId = $(this).attr("data-current-contact-id");
  contactsApi.showContact()
    .done(contactsUi.showContactRecordSuccess)
    .fail(contactsUi.showContactRecordFailure);
};

const onEditContact = function(event) {
  event.preventDefault();
  store.currentContactId = $(this).attr("data-current-contact-id");
  store.currentJobRefId = $(this).attr("data-current-job-ref-id");
  contactsUi.updateFormGenerator();
};

const onCreateContact = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);
  store.createContactData = data;
  store.lastShowContactData = data;

  let firstName = $(".contact-first-name").val().trim();
  let lastName = $(".contact-last-name").val().trim();
  let fullName = firstName + " " + lastName;

  data.contact.full_name = fullName;

  data.contact.notes = $("#contact-notes-input").val();

  let listCategory = "job";

  let submitValue = linkLogic.obtainOptionVal(listCategory);

  data.contact.job_ref_id = submitValue;


  let submitText = linkLogic.obtainOptionText(listCategory);
  data.contact.job_ref_text = submitText;


  if (submitValue === -1) {
    data.contact.job_ref_id = 0;
    data.contact.job_ref_text = "";
  }

  console.log(data);
  contactsApi.createContact(data)
    .done(contactsUi.createContactSuccess)
    .fail(contactsUi.createContactFailure);
};

const onDeleteContact = function(event) {
  event.preventDefault();
  store.currentContactId= $("#contact-record-delete").attr("data-current-contact-id");
  contactsApi.deleteContact(store.currentContactId)
    .done(contactsUi.deleteContactSuccess)
    .fail(contactsUi.deleteContactFailure);
};

const onUpdateContact = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);

  store.createContactData = data;
  store.lastShowContactData = data;

  let firstName = $(".contact-first-name").val().trim();
  let lastName = $(".contact-last-name").val().trim();
  let fullName = firstName + " " + lastName;

  data.contact.full_name = fullName;

  data.contact.notes = $("#contact-notes-input").val();

  let listCategory = "job";

  let refUpdatedDiv = "#" + listCategory + "-category-update-link";

  let isRefBeingUpdated = $(refUpdatedDiv).prop("checked");

  if (isRefBeingUpdated) {
    let submitValue = linkLogic.obtainOptionVal(listCategory);

    data.contact.job_ref_id = submitValue;


    let submitText = linkLogic.obtainOptionText(listCategory);
    data.contact.job_ref_text = submitText;


    if (submitValue === -1) {
      data.contact.job_ref_id = 0;
      data.contact.job_ref_text = "";
    }
  }

  console.log(data);
  contactsApi.updateContact(data)
    .done(contactsUi.updateContactSuccess)
    .fail(contactsUi.updateContactFailure);
};

const onShowContactCreateForm = function(event) {
  event.preventDefault();
  contactsUi.showContactCreateForm();
};

const onSelectJobDropdown = function(event) {
  event.preventDefault();
  let tagCategory = $(this).attr("class");
  // let formCategory = "contact";
  // let listCategory = "job";
  //
  // let availableJobOptions = jobOptions();
  // $("#display-radio-drop-job").append(availableJobOptions);
  //
  // linkLogic.linkClassIdGen(formCategory, listCategory);
  // dashboardLogic.determineApiRequest(tagCategory);
};

// const onDisplayJobDropdownUpdate = function(event) {
//   event.preventDefault();
//   let formCategory = "contact";
//   let listCategory = "job";
//
//   let linkContainerSelect = ".display-dropdown-" + listCategory;
//   let altFormContainer = ".display-alt-" + listCategory;
// }

const onDisplayJobDropdown = function(event) {
  event.preventDefault();
  let formCategory = "contact";
  let listCategory = "job";

  // let altContainerSelect = "#" + formCategory + "-ref-text-alt-" + listCategory + "-container";
  // let linkContainerSelect = "#" + formCategory + "-select-container-" + listCategory;
  let linkContainerSelect = ".display-dropdown-" + listCategory;
  // linkLogic.linkClassIdGen(formCategory, listCategory);
  // // linkLogic.showDropOptionsCreatePage(formCategory, listCategory);
  let altFormContainer = ".display-alt-" + listCategory;
  let selectVal = parseInt($(this).val());
  console.log(selectVal);

  if (selectVal === 1) {
    $(altFormContainer).children().remove();
    linkLogic.showDropOptionsCreatePage(formCategory, listCategory);
    // linkLogic.linkClassIdGen(formCategory, listCategory);
  } else {
    $(linkContainerSelect).children().remove();
    linkLogic.altOptionAppend(formCategory, listCategory);
    // linkLogic.altLinkClassIdGen(formCategory, listCategory);
  }
  // let data = store.dropDownOptionData;
  // console.log(data);
  //
  // let availableJobOptions = jobOptions();
  // $("#display-radio-drop-job").append(availableJobOptions);
  //
  // let thisCheckBoxStatus = $(this).is(':checked');
  //
  // let thisRadioStatus = parseInt($(this).val());
  //
  // if (thisRadioStatus === 0) {
  //
  // }
  //
  // if (!thisCheckBoxStatus) {
  //   $(this).parent().children(".tag-select-container").remove();
  // }
  //
  // let isUpdateForm;
  // // let radioDivName = $(this).attr("name");
  // let tagCategory = $(this).attr("class");
  // let radioValue = $(this).val();
  // let formCategory = "contact";
  //
  // console.log(tagCategory);
  // console.log(radioValue);
  //
  // let updateFormStatus = $(".general-form-container").attr("data-update-form");
  // updateFormStatus = parseInt(updateFormStatus);
  // if (updateFormStatus === 1) {
  //   isUpdateForm = true;
  // } else {
  //   isUpdateForm = false;
  // }
  // dashboardLogic.tagRadioActivated(tagCategory, radioValue, formCategory);
};

const onHideShowUpdateOptions = function() {
  let jobUpdateChecked = $(this).prop("checked");
  let radioButtonContainer = $(this).parent().parent().parent().children(".update-radio-container-btn");
  console.log(jobUpdateChecked);
  if ( jobUpdateChecked ) {
    $(radioButtonContainer).show();
  } else {
    $(radioButtonContainer).hide();
  }
};

const addHandlers = () => {
  $('.content').on('submit', '#new-contact-form', onCreateContact);
  $('.content').on('submit', '#update-contact-form', onUpdateContact);
  $('.content').on('click', '#contact-record-btn-edit', onEditContact);
  $('.content').on('click', '#generate-create-contact-btn', onShowContactCreateForm);
  $('.content').on('click', '.dashboard-contact-record-btn', onShowContactRecord);
  // $('.content').on('click', '#get-contacts-btn', onGetContacts);
  $('#get-contacts-btn').on('click', onGetContacts);
  $('.content').on('click', '#contact-record-delete', onDeleteContact);
  $('.content').on('change', '.job-category', onDisplayJobDropdown);
  $('.content').on('change', '#select-option-job-category', onSelectJobDropdown);
  $('.content').on('change', "#job-category-update-link", onHideShowUpdateOptions);
  $('.content').on('change', '.update-job-category', onDisplayJobDropdown);
  // $('.content').on('change', '#associate-contact-with-company', onDisplayCompanyDropdown);
  // $('.content').on('change', '#select-option-company-name', onSelectOptionCompanyVal);
  // $('.content').on('click', '#job-back-contact-overview', onShowContactRecord);
};

module.exports = {
  addHandlers,
};
