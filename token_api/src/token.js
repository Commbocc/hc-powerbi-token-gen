const { config, validateConfig } = require('./config')
const auth = require('./auth')
const fetch = require('node-fetch')

module.exports = async (reportId) => {

    // Check for any non-existing credential or invalid credential from config.json file
    config.reportId = reportId
    let configCheckResult = validateConfig(config)
    if (configCheckResult) {
        return {
            "status": 400,
            "error": configCheckResult
        };
    }

    let tokenResponse = null;
    let errorResponse = null;

    // Call the function to get the response from the authentication request
    try {
        tokenResponse = await auth(config);
    } catch (err) {
        if (err.hasOwnProperty('error_description') && err.hasOwnProperty('error')) {
            errorResponse = err.error_description;
        } else {

            // Invalid PowerBI Username provided
            errorResponse = err.toString();
        }
        return {
            "status": 401,
            "error": errorResponse
        };
    }

    // Extract AccessToken from the response
    let token = tokenResponse.accessToken;

    // embedData will be used for resolution of the Promise
    let embedData = null;

    // Call the function to get the Report Embed details
    try {

        embedData = await getReportEmbedDetails(token, config);

        // Call the function to get the Embed Token
        let embedToken = await getReportEmbedToken(token, config, embedData);
        return {
            "accessToken": embedToken.token,
            "embedUrl": embedData.embedUrl,
            "expiration": embedToken.expiration,
            "status": 200
        };
    } catch (err) {
        return {
            "status": err.status,
            "error": 'Error while retrieving report embed details\r\n' + err.statusText + '\r\nRequestId: \n' + err.headers.get('requestid')
        }
    }
}

async function getReportEmbedDetails(token, { apiUrl, workspaceId, reportId }) {
    const reportUrl = `${apiUrl}/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
    };

    // Used node-fetch to call the PowerBI REST API
    let result = await fetch(reportUrl, {
        method: 'GET',
        headers: headers,
    })
    if (!result.ok)
        throw result;
    return result.json();
}

async function getReportEmbedToken(token, { apiUrl }, embedData) {
    const embedTokenUrl = `${apiUrl}/v1.0/myorg/GenerateToken`
    // const embedTokenUrl = "https://api.powerbigov.us/v1.0/myorg/GenerateToken";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    const formData = {
        "datasets": [{
            "id": embedData.datasetId
        }],
        "reports": [{
            "id": embedData.id
        }]
    };

    // Used node-fetch to call the PowerBI REST API
    let result = await fetch(embedTokenUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
    });
    if (!result.ok)
        throw result;
    return result.json();
}