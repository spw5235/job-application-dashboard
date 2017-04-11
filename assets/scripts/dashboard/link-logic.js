'use strict';

// const store = require('../store');
// const contactsApi = require('../contacts/api');
const jobsApi = require('../jobs/api');
const store = require('../store');
const displayJobOptions = require('../templates/link/contact-form-job-link.handlebars');
// const communicationsApi = require('../communications/api');
// const documentsApi = require('../documents/api');
// const remindersApi = require('../reminders/api');

// const contactsUi = require('../contacts/ui');
const linkClassIdGen = function(formCategory, listCategory) {

  let appendingDivIdTxt = "display-radio-drop-" + listCategory;

  let appendingDivId = "#" + appendingDivIdTxt;

  let selectContainerIdDefTxt = formCategory + "-select-container-" + listCategory;

  let selectContainerSelector = appendingDivId + " .select-container";

  $(selectContainerSelector).attr("id", selectContainerIdDefTxt);

  let selectContainerSelectorId = "#" + selectContainerIdDefTxt;
  let selectElementSelector = selectContainerSelectorId + " .select-element";
  let selectElementTxt = "select-element-" + listCategory;

  $(selectElementSelector).attr("id", selectElementTxt);
  // Option Vals
  //
  //
  //
  // let categoryIdent = appendingDivId + " .category-identifier";
  //
  //
  // let selectElDivIdText = formCategory + "-category-select-" + listCategory;
  // // let selectElement = appendingDivId + " .select-element";
  //
  // let optionElement = appendingDivId + " .option-element";
  // let addOptionClass = formCategory + "-option-" + listCategory;
  //
  // // $(categoryIdent).attr("id", selectContainerIdDefTxt);
  // $(appendingDivId).attr("id", selectContainerIdDefTxt);
  // $(selectElement).attr("id", selectElDivIdText);
  // $(optionElement).addClass(addOptionClass);
};

const insertFailure = function() {
  console.log('failure');
};

const jobDropdownDataResults = (data) => {
  console.log(data);
  let listCategory = store.currentListCategory;
  let formCategory = store.currentFormCategory;
  let containerAppendId = "#" + "display-radio-drop-" + listCategory;

  console.log(listCategory);
  console.log(formCategory);

  if (listCategory === "job" && formCategory === "contact") {
    let jobDataDropdown = displayJobOptions({
      jobs: data.jobs
    });

    $(containerAppendId).append(jobDataDropdown);
  }
  linkClassIdGen(formCategory, listCategory);
};

const showDropOptionsCreatePage = function(formCategory, listCategory) {
  store.currentListCategory = listCategory;
  store.currentFormCategory = formCategory;
  if (listCategory === "job" && formCategory ==="contact") {
    jobsApi.getJobs()
      .done(jobDropdownDataResults)
      .fail(insertFailure);
  }
};

const radioClassIdNameGen = function(formCategory, listCategory) {
  let appendingDivIdTxt = listCategory + "-category-radio-container";
  let appendingDivId = "#" + appendingDivIdTxt;

  let radioGroupContainerTxt = listCategory + "-radio-group-container";

  let radioGroupContainerSelector = appendingDivId + " .radio-group-container";

  let radioBtnContainerTxt = listCategory + "-radio-btns-container";
  let radioBtnContainerSelector = appendingDivId + " .radio-btn-container";

  let formCategoryNameTxt = formCategory + "-form-category-name";
  let formCategoryNameSelector = appendingDivId + " .form-category-name";


  let listCategoryNameTxt = listCategory + "-list-category-name";
  let listCategoryNameSelector = appendingDivId + " .list-category-name";

  let radioContainerTxt = "#" + radioBtnContainerTxt;
  let radioInputClassSelector = radioContainerTxt + " input";

  let radioInputClassTxt = listCategory + "-category";

  let radioNameTxt = listCategory + "-category-radio";
  let radioNameSelector = "." + radioInputClassTxt;

  let radioDropContainerTxt = "display-radio-drop-" + listCategory;
  let radioDropContainerSelector = "#" + radioGroupContainerTxt + " .display-radio-drop";

  let formCategoryNameId = "#" + formCategoryNameTxt;
  let listCategoryNameId = "#" + listCategoryNameTxt;

  $(radioGroupContainerSelector).attr("id", radioGroupContainerTxt);
  $(radioBtnContainerSelector).attr("id", radioBtnContainerTxt);
  $(formCategoryNameSelector).attr("id", formCategoryNameTxt);
  $(formCategoryNameId).text(formCategory);
  $(listCategoryNameSelector).attr("id", listCategoryNameTxt);
  $(listCategoryNameId).text(listCategory);
  $(radioInputClassSelector).addClass(radioInputClassTxt);
  $(radioNameSelector).attr("name", radioNameTxt);
  $(radioDropContainerSelector).attr("id", radioDropContainerTxt);
};

module.exports = {
  radioClassIdNameGen,
  linkClassIdGen,
  showDropOptionsCreatePage,
};
