'use strict';
const contactsApi = require('./api');
const contactsUi = require('./ui');
const getFormFields = require('../../../lib/get-form-fields');
const store = require('../store');
const linkLogic = require('../dashboard/link-logic');
const logic = require('../dashboard/logic');
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
  store.currentJobRefText = $(this).attr("data-current-job-ref-text");

  // Template
  let formCategory = "contact";
  let listCategory = "job";
  contactsUi.generateUpdateForm(listCategory, formCategory);
};

const onCreateContact = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);

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

  data.contact.notes = $("#contact-notes-input").val();

  data.contact.website = logic.convertToUrl(data.contact.website);

  store.createContactData = data;
  store.lastShowContactData = data;
  contactsApi.createContact(data)
    .done(contactsUi.createContactSuccess)
    .fail(contactsUi.createContactFailure);
};

const onDeleteContact = function(event) {
  event.preventDefault();
  store.currentContactId = $("#contact-record-delete").attr("data-current-contact-id");
  contactsApi.deleteContact(store.currentContactId)
    .done(contactsUi.deleteContactSuccess)
    .fail(contactsUi.deleteContactFailure);
};

const onUpdateContact = function(event) {
  event.preventDefault();
  let data = getFormFields(event.target);

  let firstName = $(".contact-first-name").val().trim();
  let lastName = $(".contact-last-name").val().trim();
  let fullName = firstName + " " + lastName;

  data.contact.full_name = fullName;

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
            data.contact.job_ref_text = prevJobRefText;
            data.contact.job_ref_id = prevJobRefId;
          } else {
            data.contact.job_ref_text = $("#alt-input-entry-job").val();
            data.contact.job_ref_id = 0;
          }
        } else if (isRadioYesChecked) {
          let jobRefIdSelected = parseInt($("#select-element-job").val());
          if (jobRefIdSelected === -1) {
            data.contact.job_ref_id = prevJobRefId;
            data.contact.job_ref_text = prevJobRefText;
          } else {
            let jobRefIdSelected = $("#select-element-job").val();
            let textValueSelectDiv =  "#select-element-job option[value=" + jobRefIdSelected + "]";
            data.contact.job_ref_id = jobRefIdSelected;
            data.contact.job_ref_text = $(textValueSelectDiv).text();
          }
        }
      } else {
        data.contact.job_ref_text = prevJobRefText;
        data.contact.job_ref_id = prevJobRefId;
      }
    } else {
      data.contact.job_ref_text = prevJobRefText;
      data.contact.job_ref_id = prevJobRefId;
    }

    if (data.contact.job_ref_text === "Click to Select") {
      data.contact.job_ref_text = prevJobRefText;
      data.contact.job_ref_id = prevJobRefId;
    }

data.contact.notes = $("#contact-notes-input").val();

data.contact.website = logic.convertToUrl(data.contact.website);

store.createContactData = data;
store.lastShowContactData = data;

contactsApi.updateContact(data)
  .done(contactsUi.updateContactSuccess)
  .fail(contactsUi.updateContactFailure);
};

const onShowContactCreateForm = function(event) {
  event.preventDefault();
  contactsUi.showContactCreateForm();
};

const onDisplayJobDropdown = function(event) {
  event.preventDefault();
  let formCategory = "contact";
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
  if (isUpdateChecked) {
    $(".job-radio-container input").prop("checked", false);
    $(radioButtonContainer).show();
  } else {
    $(".job-radio-container input").prop("checked", false);
    $("#contact-ref-text-alt-job-container").remove();
    $(".display-dropdown-job").children().remove();
    $(radioButtonContainer).hide();
  }
};

const addHandlers = () => {
  $('.content').on('submit', '#new-contact-form', onCreateContact);
  $('.content').on('submit', '#update-contact-form', onUpdateContact);
  $('.content').on('click', '#contact-record-btn-edit', onEditContact);
  $('.content').on('click', '#dashboard-new-contact-btn', onShowContactCreateForm);
  $('.content').on('click', '.dashboard-contact-record-btn', onShowContactRecord);
  $('#get-contacts-btn').on('click', onGetContacts);
  $('.content').on('click', '#contact-record-delete', onDeleteContact);
  $('.content').on('change', '.job-category', onDisplayJobDropdown);
  $('.content').on('change', "#job-update-link", onHideShowUpdateOptions);
  $('.content').on('change', '.update-job', onDisplayJobDropdown);
  $('.content').on('click', '.get-contacts', onGetContacts);
};

module.exports = {
  addHandlers,
};
