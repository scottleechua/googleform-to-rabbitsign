// Update these variables:
const PROJECT_ID = "<GOOGLE_CLOUD_PROJECT_ID>";
const SECRET_ID = "<SECRET_MANAGER_SECRET_ID>";
const SECRET_VERSION = 1;
const TEMPLATE_ID = "<RABBITSIGN_TEMPLATE_ID>";
const RECIPIENT_ROLE_NAME = "<RABBITSIGN_RECIPIENT_ROLE_NAME>";
const DOCUMENT_TITLE = "<DOCUMENT_TITLE>";
const EMAIL_BODY = "<EMAIL_BODY>";

const POST_PATH = `/api/v1/folderFromTemplate/${TEMPLATE_ID}`;
const POST_URL = `https://www.rabbitsign.com${POST_PATH}`;
const SECRETS_PATH = `/${PROJECT_ID}/secrets/${SECRET_ID}/versions/${SECRET_VERSION}:access`;
const SECRETS_URL = `https://secretmanager.googleapis.com/v1/projects${SECRETS_PATH}`;

function onSubmit(e) {
  var form = FormApp.getActiveForm();
  var allResponses = form.getResponses();
  var latestResponse = allResponses[allResponses.length - 1];
  var response = latestResponse.getItemResponses();

  const googleFormAnswers = {};
  for (var i = 0; i < response.length; i++) {
    var question = response[i].getItem().getTitle();
    var answer = response[i].getResponse();
    googleFormAnswers[question] = answer;
  };

  // Specify which Google Form question contains the recipient's name:
  const recipientName = googleFormAnswers["Name"];

  // Specify the recipient's email.
  // Option 1: If you enabled Responses > Collect email addresses in Form settings, use:
  const recipientEmail = latestResponse.getRespondentEmail();
  // Option 2: If you manually collected the email through a question in the form, specify which:
  // const recipientEmail = googleFormAnswers["email"];

  const rabbitsignFields = {};

  // Assign Google Form answers to RabbitSign fields. For example:
  rabbitsignFields["name"] = googleFormAnswers["Name"]; // text field
  rabbitsignFields["checkbox"] = googleFormAnswers["Select Yes or No"] === "Yes" ? "true" : "false"; // checkbox field
  rabbitsignFields["date-today"] = "true"; // date field
  rabbitsignFields["sender-signature"] = "Firstname Lastname"; // sender's signature field

  const recipientRole = {};
  recipientRole[RECIPIENT_ROLE_NAME] = {
    "name": recipientName,
    "email": recipientEmail
  };

  const payload = {};
  payload["title"] = DOCUMENT_TITLE;
  payload["summary"] = EMAIL_BODY;
  payload["date"] = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd");
  payload["senderFieldValues"] = Object.keys(rabbitsignFields).map(function(key){
    return {name: key, currentValue: rabbitsignFields[key]}
  });
  payload["roles"] = recipientRole;

  const options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "headers": getRabbitsignHeaders()
  };
  UrlFetchApp.fetch(POST_URL, options);

};