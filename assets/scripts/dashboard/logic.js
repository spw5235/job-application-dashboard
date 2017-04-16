'use strict';

// const jobsApi = require('../jobs/api');
// const store = require('../store');
// const displayJobOptions =  require('../templates/link/contact-form-job-link.handlebars');
// const displayJobContactAltOption = require('../templates/alt-link/contact-form-job-alt-link.handlebars');
// const displayJobCommunicationAltOption = require('../templates/alt-link/communication-form-job-alt-link.handlebars');

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
  let url = $(".display-url").attr("href");
  let urlArr = url.split("www.");
  console.log(urlArr);
  let removedPath = urlArr[1].split("/");
  console.log(removedPath);
  let showPath = "/...";
  let preceding = "www.";
  let fullUrl = preceding + removedPath[0] + showPath;
  $(".display-url").text(fullUrl);
};

module.exports = {
  convertToUrl,
  displayUrl,
};
