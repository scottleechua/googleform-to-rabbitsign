# Google Form to RabbitSign

Use [Apps Script](https://developers.google.com/apps-script) to fill and send a [RabbitSign document](https://www.rabbitsign.com/faq.html#templates) whenever a Google Form is submitted.

## [Try it out now!](https://docs.google.com/forms/d/e/1FAIpQLSdRA_m0kYRXReUqKgqyRg-4TF9m3PDkR6jEJLbLIUoBw8ZLdg/viewform?usp=header)

![A side-by-side image showing a filled Google Form on the left and the generated, filled-up form on the right with matching form details.](https://raw.githubusercontent.com/scottleechua/googleform-to-rabbitsign/main/assets/header.jpeg)


## Requirements
1. A completed [RabbitSign document template](https://www.rabbitsign.com/faq.html#templates). Note down the **sender field names**, **recipient's role name**, and the **template ID**.
2. A Google Form that collects the information to be injected into the RabbitSign document (at minimum, the **recipient's name and email address**).
3. [RabbitSign API credentials](https://www.rabbitsign.com/developer.html) stored in [Google Cloud Secret Manager](https://cloud.google.com/security/products/secret-manager) in the format:

```
{"id":"<APIKEYID>","secret":"<APIKEYSECRET>"}
```
replacing `<APIKEYID>` and `<APIKEYSECRET>` with your actual credentials.

## Instructions

### A. Setup Apps Script
1. From your Google Form, click the 3-dots icon in the upper right and select Apps Script.
2. This creates a new Apps Script project linked to the Google Form. Give the project a meaningful title, as this will show up as a "Third-party app" in your Google account.
3. In the Apps Script project, go to Project Settings (the gear icon in the left-hand side menu) and tick "Show `appsscript.json` manifest file in editor".
4. Open `appsscript.json` and add a new entry:
```
"oauthScopes": [
      "https://www.googleapis.com/auth/script.external_request",
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/forms"
    ]
```
remembering to add a comma after the previous argument.
5. Copy in `main.gs`, `utils.gs` from this repo.
6. Go to Triggers (the alarm clock in the left-hand side menu) and Add Trigger:
    - which function to run: `onSubmit`
    - which deployment should run: `Head`
    - event source: `From form`
    - event type: `On form submit`
    - Failure notification settings: `Immediately`
Saving the Trigger should, in turn, trigger an authentication flow to grant the project the necessary permissions.

### B. Customize `main.gs`
1. Update lines 2-4 with details of the Secret you stored in Google Cloud Secret Manager.
2. Update lines 5-8 with details of your RabbitSign document.
3. On line 29, specify which Google Form question contains the respondent's name.
4. If you collected the respondent's email using Google Forms' "Collect email addresses" feature, use line 33.
5. If you collected the respondent's email manually (by creating a question), comment out line 33 and use line 35 instead.
6. Below line 39, map Google Form questions to RabbitSign fields.
7. Submit the Google Form with a test response and use Apps Script's Execution log to debug.
8. All done!

## Pricing
- Google Forms & Apps Script: free.
- RabbitSign: Free while in public beta; refer to the [Developer Page](https://www.rabbitsign.com/developer.html) for updated pricing.
- Secret Manager: Up to 6 active secrets and 10k access operations free per month under the [Google Cloud Free Tier](https://cloud.google.com/free/docs/free-cloud-features#secret-manager).

## Acknowledgements
- The `onSubmit` function is adapted from Eyal Gershon's code in [Sending a Webhook for each Google Forms Submission](https://medium.com/@eyalgershon/sending-a-webhook-for-each-google-forms-submission-a0e73f72b397).
- The `toHexUpper` function is due to Bergi's mind-boggling code snippet on [this StackOverflow thread](https://stackoverflow.com/questions/34309988/byte-array-to-hex-string-conversion-in-javascript).
- Thanks to Amit Agarwal for teaching me [How to Access Secrets from Google Secret Manager using Apps Script](https://www.labnol.org/google-secret-manager-240330).

## Contribute
For bug reports or features, please open an issue before making a pull request.
