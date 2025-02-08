// Update these variables:
const PROJECT_ID = "REDACTED";
const SECRET_ID = "REDACTED";
const SECRET_VERSION = 1;
const TEMPLATE_ID = "REDACTED";
const RECIPIENT_ROLE_NAME = "Superhero";
const DOCUMENT_TITLE = "Google Form to RabbitSign Demo";
const EMAIL_BODY = "This form has been pre-filled out based on your Google Form answers.";

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
  const recipientName = googleFormAnswers["Your real name"];

  // Specify the recipient's email.
  const recipientEmail = latestResponse.getRespondentEmail();

  const rabbitsignFields = {};

  // Assign Google Form answers to RabbitSign fields.
  rabbitsignFields["real-name"] = recipientName;
  rabbitsignFields["superhero-name"] = googleFormAnswers["Your superhero name"];
  rabbitsignFields["powers-date"] = googleFormAnswers["When you first gained your powers:"];
  rabbitsignFields["chat-checkbox"] = googleFormAnswers["Do you want to be added to the superhero group chat?"] === "Yes" ? "true" : "false";
  rabbitsignFields["email"] = recipientEmail;
  rabbitsignFields["sender-signature"] = "Professor X";
  rabbitsignFields["date-today"] = "true";

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

  // DEMO ONLY: Delete your response from Google Forms.
  form.deleteResponse(latestResponse.getId());
};