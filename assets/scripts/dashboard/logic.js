'use strict';

const store = require('../store');
const contactsApi = require('../contacts/api');
const companyApi = require('../companies/api');
const displayContactOptions = require('../templates/contact/option-dropdown-contacts.handlebars');
const displayCompanyOptions = require('../templates/contact/option-dropdown-contacts.handlebars');

// const determineTagId = function(category, id) {
//   let communicationTextSelected = $("#select-option-" + category + " option[value=" + id + "]").text();
//   let idSelected = $("#select-option-" + category).val();
//   if ( communicationTextSelected === "" ) {
//     return idSelected;
//   } else {
//     return idSelected;
//   }
// };

const determineTagText = function(category, id) {
  let communicationTextSelected = $("#select-option-" + category + " option[value=" + id + "]").text();
  console.log(communicationTextSelected);
  return communicationTextSelected;
};

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
  } else if (category === "company-category") {
    dataToAppend = displayCompanyOptions({
      companies: data.companies
    });
  }

  $(classAppend).append(dataToAppend);

  let isUpdateForm = parseInt($(".general-form-class").attr("data-update-form"));

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

  if (isUpdate) {
    $(checkDivId).click();
  } else {
    if (category === "contact-category") {
      contactsApi.getContacts()
        .done(displayDropdownSuccess)
        .fail(displayDropdownFail);
    } else if ( category === "company-category" ) {
      companyApi.getCompanies()
        .done(displayDropdownSuccess)
        .fail(displayDropdownFail);
    }
  }
};

const calcStoreDefaultVals = function(category) {
  let isContactCategory = (category === "contact-category");
  let isCompanyCategory = (category === "contact-category");
  if (isContactCategory) {
    store.selectedContactId = 0;
    store.selectedContactName = "";
  } else if ( isCompanyCategory ) {
    store.selectedCompanyId = 0;
    store.selectedCompanyName = "";
  }
  let dropdownContainer = "#" + store.currentInputId + "-select";
  console.log(dropdownContainer);
  $(".select-option-value").val(0)
  $(dropdownContainer).remove();
  return;
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
};

module.exports = {
  tagCheckboxClicked,
  determineApiRequest,
  tagCheckboxUpdate,
  determineTagText,
  calcStoreDefaultVals,
};
