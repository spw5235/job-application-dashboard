'use strict';

const store = require('../store');
const contactsApi = require('../contacts/api');
const displayContactOptions = require('../templates/contact/option-dropdown-contacts.handlebars');

// Communications API

// const determineTagText = function(category, selectAttribute) {
//   const currentSelectIdText = '#select-option-' + category;
//   const currentId = $(currentSelectIdText).attr(selectAttribute);
//   // let currentId = $("#associate-reminder-with-company").attr("data-current-job-id");
//   //
//   // $("#associate-reminder-with-company").val(currentId);
//   //
//   // let valueString = '#select-option-job-title option[value=' + currentReminderJobId + ']';
//   //
//   // $(valueString).prop('selected',true);
// }

const displayDropdownFail = function() {
  console.log('fail');
};

const displayDropdownSuccess = function(data) {
  console.log(data);
  $(".notification-container").children().text("");
  let classAppend = store.classAppend;
  let dataToAppend;
  let category = store.apiRequestCategory;

  if (category === "contact-category") {
    dataToAppend = displayContactOptions({
      contacts: data.contacts
    });
  }

  $(classAppend).append(dataToAppend);

  let isUpdateForm = parseInt($("#update-communication-form").attr("data-update-form"));

  if (isUpdateForm === 1) {
    let divIdSelector = "#" + store.currentUpdateInputId;
    let idValue = parseInt($(divIdSelector).val());
    let communicationTextSelect = '#select-option-' + category + ' option[value=' + idValue + ']';
    $(communicationTextSelect).prop('selected', true);

  } else {
    return;
  }

};

const determineApiRequest = function(category, isUpdate, checkboxId) {
  console.log(category);
  console.log(isUpdate);

  let checkDivId = checkboxId;
  store.apiRequestCategory = category;
  if (category === "contact-category") {
    if (isUpdate) {
      $(checkDivId).click();
      // contactsApi.getContacts()
      //   .done(displayDropdownSuccess)
      //   .fail(displayDropdownFail);
    } else {
      contactsApi.getContacts()
        .done(displayDropdownSuccess)
        .fail(displayDropdownFail);
    }
  }
};

const calcStoreDefaultVals = function(category) {
  let isContactCategory = (category === "contact-category");
  if (isContactCategory) {
    store.selectedContactId = 0;
    store.selectedContactName = "";
  }
  let dropdownContainer = "#" + store.currentInputId + "-select";
  console.log(dropdownContainer);
  $(dropdownContainer).remove();
};


const tagCheckboxClickedCreate = function(category, isBoxChecked) {
  let isUpdate = false;
  if (!isBoxChecked) {
    calcStoreDefaultVals(category);
  } else {
    determineApiRequest(category, isUpdate);
  }
};

const tagCheckboxClicked = function(category, inputId) {
  const inputidString = "#" + inputId;
  const isBoxChecked = $(inputidString).prop("checked");
  store.currentInputId = inputId;
  store.classAppend = "." + inputId + "-container";
  store.currentCategory = category;
  tagCheckboxClickedCreate(category, isBoxChecked);
};

const tagCheckboxUpdate = function(category) {
  const isUpdate = true;
  const checkboxIdText = "." + category;
  const checkboxIdVal = $(checkboxIdText).attr("id");
  const checkboxId = "#" + checkboxIdVal;

  store.currentUpdateInputId = checkboxIdVal;
  console.log(checkboxId);
  const isExistingId = parseInt($(checkboxId).val());

  console.log(isExistingId);
  if ( isExistingId > 0 ) {
    determineApiRequest(category, isUpdate, checkboxId);
  } else {
    calcStoreDefaultVals(category);
  }
  // tagCheckboxClickedUpdate(category, isBoxChecked);
};

module.exports = {
  tagCheckboxClicked,
  determineApiRequest,
  tagCheckboxUpdate,
};
