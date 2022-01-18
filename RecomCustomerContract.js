function OnChangeCustomer(executionContext) {
    var formContext = executionContext.getFormContext();
    SetGroup(formContext);
}

function OnLoadCustomerContract(executionContext) {
    var formContext = executionContext.getFormContext();
    SetGroup(formContext);
}

function SetGroup(formContext) {
    if (formContext.getAttribute('vel_customer').getValue() != null) {
        var customerId = formContext.getAttribute('vel_customer').getValue()[0].id;
        console.log('Customer ID: ' + customerId);
        if (customerId != null) {
            GetParentAccountId(customerId, formContext);
        }
    } else {
        formContext.getAttribute('vel_group').setValue(null);
    }
}

function GetParentAccountId(accountId, formContext) {
    console.log('accountid param: ' + accountId);
    parent.Xrm.WebApi.retrieveMultipleRecords('account', '?$select=accountid,_vel_group_value,name&$filter=accountid eq ' + accountId).then(
        function success(result) {
            for (var i = 0; i < result.entities.length; i++) {
                var resultSet = result.entities[0];
                console.log('Parent/Group Account Id: ' + resultSet['_vel_group_value']);
                if (resultSet['_vel_group_value'] != null) {
                    SetGroupLookUp(resultSet['_vel_group_value'], formContext);
                } else {
                    formContext.getAttribute('vel_group').setValue(null);
                }
            }
        },

        function(error) {
            console.log('ERROR MESSAGE ** ** * ');
            console.log(error.message);
            // handle error conditions
        }
    );
}

function SetGroupLookUp(parentAccountId, formContext) {
    console.log('SetGroupLookUp: ' + parentAccountId);
    parent.Xrm.WebApi.retrieveMultipleRecords('account', '?$select=accountid,name&$filter=accountid eq ' + parentAccountId).then(
        function success(result) {
            for (var i = 0; i < result.entities.length; i++) {
                var resultSet = result.entities[0];
                if (resultSet != null) {
                    var parentIdLookup = new Array();
                    parentIdLookup[0] = new Object();
                    parentIdLookup[0].id = resultSet['accountid'];
                    parentIdLookup[0].name = resultSet['name'];
                    parentIdLookup[0].entityType = 'account';
                    console.log('Entity Name: ' + parentIdLookup[0].entityType);
                    console.log('parent lookup name: ' + parentIdLookup[0].name);
                    formContext.getAttribute('vel_group').setValue(parentIdLookup);
                }
                break;
            }
        },

        function(error) {
            console.log('ERROR MESSAGE ** ** * ');
            console.log(error.message);
            // handle error conditions
        }
    );
}