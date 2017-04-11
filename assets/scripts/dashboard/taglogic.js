'use strict';

// const store = require('../store');

const linkClassIdGen = function(formCategory, listCategory) {

  let appendingDivIdTxt = listCategory + '-dropdown-in-' + formCategory +"-form";
  let appendingDivId = "#" + appendingDivIdTxt;

  let selectContainerIdDefTxt = formCategory + "-select-container-" + listCategory;
  let categoryIdent = appendingDivId + " .category-identifier";
  $(categoryIdent).attr("id", selectContainerIdDefTxt);

  let selectElDivIdText = formCategory + "-category-select-" + listCategory;
  let selectElement = appendingDivId + " .select-element";
  $(selectElement).attr("id", selectElDivIdText);

  let optionElement = appendingDivId + " .option-element";
  let addOptionClass = formCategory + "-option-" + listCategory;
  $(optionElement).addClass(addOptionClass);
};

const radioClassIdNameGen = function(formCategory, listCategory) {

  let appendingDivIdTxt = listCategory + "-category-radio-container";
  let appendingDivId = "#" + appendingDivIdTxt;

  let radioGroupContainerTxt = listCategory + "-radio-group-container";
  // let RadioGroupContainerId = "#" + RadioGroupContainerTxt;

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
  let radioNameSelector = "." + "radioInputClassTxt";

  let radioDropContainerTxt = "display-radio-drop-" + listCategory;
  let radioDropContainerSelector = "#" + radioGroupContainerTxt + " .display-radio-drop";

  $(radioGroupContainerSelector).attr("id", radioGroupContainerTxt);
  $(radioBtnContainerSelector).attr("id", radioBtnContainerTxt);
  $(formCategoryNameSelector).attr("id", formCategoryNameTxt);
  $(listCategoryNameSelector).attr("id", listCategoryNameTxt);
  $(radioInputClassSelector).addClass(radioInputClassTxt);
  $(radioNameSelector).attr(radioNameTxt);
  $(radioDropContainerSelector).attr("id", radioDropContainerTxt);
};

module.exports = {
  linkClassIdGen,
  radioClassIdNameGen,
};
