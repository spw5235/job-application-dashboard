'use strict';

const letterToNum = function(letter) {
  let num;
  if (letter === "a") {
    num = 1;
  } else if (letter === "b") {
    num = 2;
  } else if (letter === "c") {
    num = 3;
  } else if (letter === "d") {
    num = 4;
  } else if (letter === "e") {
    num = 5;
  } else if (letter === "f") {
    num = 6;
  } else if (letter === "g") {
    num = 7;
  } else if (letter === "h") {
    num = 8;
  } else if (letter === "i") {
    num = 9;
  } else if (letter === "j") {
    num = 10;
  } else if (letter === "k") {
    num = 11;
  } else if (letter === "l") {
    num = 12;
  } else if (letter === "m") {
    num = 13;
  } else if (letter === "n") {
    num = 14;
  } else if (letter === "o") {
    num = 15;
  } else if (letter === "p") {
    num = 16;
  } else if (letter === "q") {
    num = 17;
  } else if (letter === "r") {
    num = 18;
  } else if (letter === "s") {
    num = 19;
  } else if (letter === "t") {
    num = 20;
  } else if (letter === "u") {
    num = 21;
  } else if (letter === "v") {
    num = 22;
  } else if (letter === "w") {
    num = 23;
  } else if (letter === "x") {
    num = 24;
  } else if (letter === "y") {
    num = 25;
  } else if (letter === "z") {
    num = 26;
  } else if (letter === " ") {
    num = 27;
  } else {
    num = 0;
  }

  return num;
};

const NumToLetter = function(letter) {
  let num;
  if (num === 1) {
    letter = "a";
  } else if (num === 2) {
    letter = "b";
  } else if (letter === 3) {
    letter = "c";
  } else if (letter === 4) {
    letter = "d";
  } else if (letter === 5) {
    letter = "e";
  } else if (letter === 6) {
    letter = "f";
  } else if (letter === 7) {
    letter = "g";
  } else if (letter === 8) {
    letter = "h";
  } else if (letter === 9) {
    letter = "i";
  } else if (letter === 10) {
    letter = "j";
  } else if (letter === 11) {
    letter = "k";
  } else if (letter === 12) {
    letter = "l";
  } else if (letter === 13) {
    letter = "m";
  } else if (letter === 14) {
    letter = "n";
  } else if (letter === 15) {
    letter = "o";
  } else if (letter === 16) {
    letter = "p";
  } else if (letter === 17) {
    letter = "q";
  } else if (letter === 18) {
    letter = "r";
  } else if (letter === 19) {
    letter = "s";
  } else if (letter === 20) {
    letter = "t";
  } else if (letter === 21) {
    letter = "u";
  } else if (letter === 22) {
    letter = "v";
  } else if (letter === 23) {
    letter = "w";
  } else if (letter === 24) {
    letter = "x";
  } else if (letter === 25) {
    letter = "y";
  } else if (letter === 26) {
    letter = "z";
  } else if (letter === 27) {
    letter = " ";
  } else {
    letter = "";
  }

  return letter;
};

const alphabatize = function(company) {
  console.log(company);

  let nameSplit = company.toLowerCase().split("");

  // Will need if statement for blank situation

  let emptyArr = [];

  for (let i = 0; i < nameSplit.length; i++) {
    let letter = nameSplit[i];
    let number = letterToNum(letter);
    emptyArr.push(number);
  }

  console.log('convert to num arr');
  console.log(emptyArr);

  let convertBack = [];

  for (let i = 0; i < emptyArr.length; i++) {
    let num = emptyArr[i];
    let letter = NumToLetter(num);
    convertBack.push(letter);
  }

  console.log('letterArr');
  console.log(convertBack);

  convertBack = convertBack.join("");

  console.log(convertBack);

};

const formatDate = function(date) {
  if (date !== null) {
    let splitDate = date.split("-");

    if (splitDate.length > 1) {
      let revisedDate = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`;
      return revisedDate;
    } else {
      return date;
    }
  } else {
    return null;
  }
};

const dateFormatByClass = function() {
  let classCollection = $(".format-date");
  classCollection.each(function() {
    let textVal = $(this).text();

    if (textVal !== "") {
      textVal = $(this).text().trim();
      let formattedDate = formatDate(textVal);
      // console.log(formattedDate);
      $(this).text(formattedDate);
    }
    // console.log(textVal);
  });
};

const convertPercentage = function() {
    let allInputs = document.querySelectorAll('.text-input');
    let allInputsLength = allInputs.length;

    for (let i = 0; i < allInputsLength; ++i) {
      let currentVal = allInputs[i].value;
      let currentArr = currentVal.split("");

      for (let j = 0; j < currentArr.length; j++) {
        if (currentArr[j] === "%") {
          currentArr[j] = " percent";
        }
      }

      let revisedValue = currentArr.join("");

      allInputs[i].value = revisedValue;

    }

  };

const defaultDate = function() {
  let d = new Date();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let output = d.getFullYear() + '-' +
    (month < 10 ? '0' : '') + month + '-' +
    (day < 10 ? '0' : '') + day;
  return output;
};

const onResizeTextarea = function(currentId) {

  // let currentId = $(this).attr("id");

  let MaxHeight = 2000;
  let textarea = document.getElementById(currentId);
  let textareaRows = textarea.value.split("\n");
  let counter;

  if (textareaRows[0] !== "undefined" && textareaRows.length < MaxHeight) {
    counter = textareaRows.length;
  } else if (textareaRows.length >= MaxHeight) {
    counter = MaxHeight;
  } else {
    counter = 1;
  }

  textarea.rows = counter;
};

const textAreaHeightUpdate = function(divId) {
  let text = $(divId).text();
  let tempDiv = $('<div id="temp"></div>');
  let currentTdWidth = $(divId).width();
  let currentTdWidthPx = currentTdWidth.toString() + "px";
  tempDiv.css({
    "width": currentTdWidthPx,
    "white-space": "pre-line",
    "font-size": "15px"
  });

  tempDiv.text(text);
  $('body').append(tempDiv);

  let useHeight = $("#temp").height();

  if (useHeight > 0) {
    let useHeightPx = useHeight.toString() + "px";
    $(divId).css("height", useHeightPx);
  }

  $("#temp").remove();
};

const convertToUrl = function(url) {
  let submittedUrlArr = url.split("");
  let returnUrl;

  if (submittedUrlArr[0] === "w") {
    returnUrl = "http://" + url;
  } else {
    returnUrl = url;
  }

  return returnUrl;
};

const displayUrl = function() {
  let showPath = "/...";
  let preceding = "www.";
  let removedPath;
  let fullUrl;
  let url = $(".display-url").attr("href");
  let urlArr;
  let isWWW = (url.split("www.").length > 1);
  let isHttp = (url.split("http://").length > 1);
  let isHttpS = (url.split("https://").length > 1);
  let isBlank = (url.trim() === "");

  if (isWWW) {
    urlArr = url.split("www.");
    removedPath = urlArr[1].split("/");
    fullUrl = preceding + removedPath[0] + showPath;
    $(".display-url").text(fullUrl);
    $(".display-empty-p").remove();
    return;
  } else if (isHttpS) {
    urlArr = url.split("https://");
    removedPath = urlArr[1].split("/");
    fullUrl = preceding + removedPath[0] + showPath;
    $(".display-url").text(fullUrl);
    $(".display-empty-p").remove();
    return;
  } else if (isHttp) {
    urlArr = url.split("http://");
    removedPath = urlArr[1].split("/");
    fullUrl = preceding + removedPath[0] + showPath;
    $(".display-url").text(fullUrl);
    $(".display-empty-p").remove();
    return;
  } else if (isBlank) {
    $(".display-empty-p").text("N/A");
    $(".display-url").remove();
    return;
  } else {
    $(".display-url").text("link");
    $(".display-empty-p").remove();
    return;
  }
};

module.exports = {
  convertToUrl,
  displayUrl,
  textAreaHeightUpdate,
  onResizeTextarea,
  defaultDate,
  convertPercentage,
  formatDate,
  dateFormatByClass,
  alphabatize,
  // isDateBlank,
};
