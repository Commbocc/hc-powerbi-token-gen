const guid = require("guid")

exports.config = {
    tenantId: process.env.TENET_ID,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    workspaceId: process.env.WORKSPACE_ID,
    scope: process.env.API_SCOPE,
    apiUrl: process.env.API_URL,
    authorityUri: "https://login.microsoftonline.com/common/",
    authenticationMode: "ServicePrincipal",
    // pbiUsername: "",
    // pbiPassword: "",
}

exports.validateConfig = (conf) => {
    // Validation function to check whether the Configurations are available in the configuration file or not

    if (!conf.authenticationMode) {
        return "AuthenticationMode is empty. Please choose MasterUser or ServicePrincipal in configuration."
    }

    if (conf.authenticationMode.toLowerCase() !== "masteruser" && conf.authenticationMode.toLowerCase() !== "serviceprincipal") {
        return "AuthenticationMode is wrong. Please choose MasterUser or ServicePrincipal in configuration"
    }

    if (!conf.clientId) {
        return "ClientId is empty. Please register your application as Native app in https://dev.powerbi.com/apps and fill Client Id in configuration."
    }

    if (!guid.isGuid(conf.clientId)) {
        return "ClientId must be a Guid object. Please register your application as Native app in https://dev.powerbi.com/apps and fill Client Id in configuration."
    }

    if (!conf.reportId) {
        return "ReportId is empty. Please select a report you own and fill its Id in configuration."
    }

    if (!conf.workspaceId) {
        return "WorkspaceId is empty. Please select a group you own and fill its Id in configuration."
    }

    if (!guid.isGuid(conf.workspaceId)) {
        return "WorkspaceId must be a Guid object. Please select a workspace you own and fill its Id in configuration."
    }

    if (!conf.authorityUri) {
        return "AuthorityUri is empty. Please fill valid AuthorityUri in configuration."
    }

    if (conf.authenticationMode.toLowerCase() === "masteruser") {
        if (!conf.pbiUsername || !conf.pbiUsername.trim()) {
            return "PbiUsername is empty. Please fill Power BI username in configuration."
        }

        if (!conf.pbiPassword || !conf.pbiPassword.trim()) {
            return "PbiPassword is empty. Please fill password of Power BI username in configuration."
        }
    } else if (conf.authenticationMode.toLowerCase() === "serviceprincipal") {
        if (!conf.clientSecret || !conf.clientSecret.trim()) {
            return "ClientSecret is empty. Please fill Power BI ServicePrincipal ClientSecret in configuration."
        }

        if (!conf.tenantId) {
            return "TenantId is empty. Please fill the TenantId in configuration."
        }

        if (!guid.isGuid(conf.tenantId)) {
            return "TenantId must be a Guid object. Please select a workspace you own and fill its Id in configuration."
        }
    }
}