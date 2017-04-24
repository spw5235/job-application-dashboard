'use strict';

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
  let url = $(".display-url").attr("href").trim();
  if (url === "" || url === "N/A") {
    $(".display-empty-p").text("N/A");
    $(".display-url").remove();
    return;
  }

  let urlArr = url.split("www.");
  let removedPath = urlArr[1].split("/");
  let showPath = "/...";
  let preceding = "www.";
  let fullUrl = preceding + removedPath[0] + showPath;
  $(".display-url").text(fullUrl);
};

module.exports = {
  convertToUrl,
  displayUrl,
};
