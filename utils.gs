// Create request headers as required by RabbitSign
function getRabbitsignHeaders() {
  const utcTime = new Date().toISOString().split('.')[0]+"Z";
  const apiCredentials = getApiCredentials();
  const keyString = ["POST", POST_PATH, utcTime, apiCredentials['secret']].join(" ");
  const apiSignature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_512, keyString, Utilities.Charset.UTF_8);

  const requiredHeaders = {};
  requiredHeaders["x-rabbitsign-api-time-utc"] = utcTime;
  requiredHeaders["x-rabbitsign-api-key-id"] = apiCredentials['id'];
  requiredHeaders["x-rabbitsign-api-signature"] = toHexUpper(apiSignature);
  return requiredHeaders;
};

// Retrieve API credentials from Google Cloud Secret Manager
function getApiCredentials() {
  const options = {
    "method": "get",
    "contentType": "application/json",
    "headers": {
      "Authorization": `Bearer ${ScriptApp.getOAuthToken()}`
    }
  };
  const response = UrlFetchApp.fetch(SECRETS_URL, options);
  const { _, payload } = JSON.parse(response.getContentText());

  // Decode base64-encoded secret
  const bytes = Utilities.base64Decode(payload.data);
  const base64 = bytes.map((byte) => `%${byte.toString(16).padStart(2, '0')}`).join('');
  const credentialsObject = JSON.parse(decodeURIComponent(base64));
  return credentialsObject;
};

// Encode API signature in hexadecimal uppercase
function toHexUpper(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('').toUpperCase()
}