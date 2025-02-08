# Google Form to RabbitSign

Use [Apps Script](https://developers.google.com/apps-script) to fill and send a [RabbitSign document](https://www.rabbitsign.com/faq.html#templates) whenever a Google Form is submitted.

## [Try it out now!](https://docs.google.com/forms/d/e/1FAIpQLSdRA_m0kYRXReUqKgqyRg-4TF9m3PDkR6jEJLbLIUoBw8ZLdg/viewform?usp=header)

![A side-by-side image showing a filled Google Form on the left and the generated, filled-up form on the right with matching form details.](https://raw.githubusercontent.com/scottleechua/googleform-to-rabbitsign/main/assets/header.jpeg)


## Requirements
1. The template ID, sender field names, and recipient's role name of a RabbitSign template.
2. A Google Form that collects the data to be injected into the RabbitSign template (required: name and email)
3. [RabbitSign API credentials](https://www.rabbitsign.com/developer.html) stored in [Google Cloud Secret Manager](https://cloud.google.com/security/products/secret-manager) in the format:

```
{"id":"<APIKEYID>","secret":"<APIKEYSECRET>"}
```

## Steps
1. From the Google Form main menu, click the hamburger icon > Apps Script.
2. In the Apps Script project, click the gear icon > Show "appsscript.json" manifest file in editor.
3. Add `main.gs`, `utils.gs` from this repo.
4. Update variables (expound here).
5. Open `appsscript.json` and add an entry:
```
"oauthScopes": [
      "https://www.googleapis.com/auth/script.external_request",
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/forms"
    ]
```
6. Go to "Triggers" (the alarm clock in the left-hand side menu) > Add Trigger:
    - which function to run: `onSubmit`
    - which deployment should run: `Head`
    - event source: `From form`
    - event type: `On open`
    - Failure notification settings: `Immediately`
Saving the Trigger should, in turn, trigger an authentication flow to grant the project the necessary permissions (as defined in `oauthScopes`).
7. All done! Submit the Google Form with a test response and use Apps Script's Execution log to check error messages if needed.

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
