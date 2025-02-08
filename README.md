# Google Form to RabbitSign

A Google Apps Script that triggers when a Google Form is submitted, fills in a RabbitSign template, and sends the document out for signature.

Use [Google Apps Script](https://developers.google.com/apps-script) to automatically fill and send a [RabbitSign templated document](https://www.rabbitsign.com/faq.html#templates) based on responses submitted to a Google Form.

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
- [RabbitSign](https://www.rabbitsign.com/developer.html): While the RabbitSign API is currently in public beta and therefore free, the official free tier is 100 "folders" (documents) / month, and 0.10 USD / folder thereafter.
- [Google Cloud Secret Manager](https://cloud.google.com/security/products/secret-manager?hl=en#pricing): the [Google Cloud Free Tier](https://cloud.google.com/free/docs/free-cloud-features#secret-manager) covers up to 6 secret versions and 10k access operations / month.
- Google Forms & Apps Script: free.

## Acknowledgements
- The `onSubmit` function is adapted from Eyal Gershon's code in [Sending a Webhook for each Google Forms Submission](https://medium.com/@eyalgershon/sending-a-webhook-for-each-google-forms-submission-a0e73f72b397).
- The `toHexUpper` function is due to Bergi's mind-boggling code snippet on [this StackOverflow thread](https://stackoverflow.com/questions/34309988/byte-array-to-hex-string-conversion-in-javascript).
- Thanks to Amit Agarwal for teaching me [How to Access Secrets from Google Secret Manager using Apps Script](https://www.labnol.org/google-secret-manager-240330).