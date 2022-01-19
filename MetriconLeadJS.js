// This JS Function is used to call a flow from a ribbon button
// Use the ribbon button to pass the primary control CRM Parameter
// Uses the XRM WebApi to retrieve the Environment Variable
// Environment variable stores the URL of the flow
// The flow trigger should be HTTP request of type POST

function CallNurtureProcess(primaryControl) {
    var isConfirmed = confirm("Are you sure you want to continue?");
    var envVarDef = "";
    var envVarVal = "";

    var parameterId = JSON.stringify({
        "id": primaryControl.data.entity.getId().replace("{", "").replace("}", "")
    });

    if (isConfirmed) {
        Xrm.WebApi.retrieveMultipleRecords("environmentvariabledefinition", "?$select=environmentvariabledefinitionid&$filter=schemaname eq 's365_NurtureProcessURL'").then(
            function success(result) {
                for (var x = 0; x < result.entities.length; x++) {
                    var resutlSet = result.entities[0];
                    if (resutlSet['environmentvariabledefinitionid'] != null) {
                        envVarDef = resutlSet['environmentvariabledefinitionid'];
                        Xrm.WebApi.retrieveMultipleRecords('environmentvariablevalue', "?$select=value&$filter=_environmentvariabledefinitionid_value eq '" + envVarDef + "'").then(
                            function success(result) {
                                for (var x = 0; x < result.entities.length; x++) {
                                    var resultSet = result.entities[0];
                                    if (resultSet['value'] != null) {
                                        envVarVal = resultSet['value'];
                                        if (envVarVal !== null && envVarVal !== '') {
                                            var request = new XMLHttpRequest();
                                            var url = envVarVal;
                                            request.open("POST", url, true);
                                            request.setRequestHeader('Content-Type', 'application/json');
                                            request.send(parameterId);
                                            request.onreadystatechange = function() {
                                                // Added to handle the response
                                                // Page refresh when based on the results
                                                if (this.readyState === 4) {
                                                    request.onreadystatechange = null;
                                                    if (this.status === 202) {
                                                        alert("Lead status is set to Nurture");
                                                        Xrm.Page.data.refresh(true);
                                                    } else {
                                                        alert("Lead status update failed");
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            function(error) {
                                console.log('ERROR - Env Var Value: ' + error.message);
                            }
                        );
                    }
                }
            },
            function(error) {
                console.log('ERROR: ' + error.message);
            });
    }
}