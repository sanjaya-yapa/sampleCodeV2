function fieldOnChange(executionContext){
    var formContext = executionContext.getFormContext();
    setWorkOrderPriceList(formContext);
}

function setWorkOrderPriceList(formContext){
    //var billingAccount, group, division, workOrderType, incidentType;

    var billingAccount = CheckFieldValue(formContext,'msdyn_billingaccount');
    var group = CheckFieldValue(formContext,'vel_group');
    var servceAccount = CheckFieldValue(formContext,'msdyn_serviceaccount');
    var workOrderType = CheckFieldValue(formContext,'msdyn_workordertype');
    var incidentType = CheckFieldValue(formContext,'msdyn_primaryincidenttype');
    
    if(billingAccount !== null && group !== null && workOrderType !== null && incidentType !== null){
        getServiceAccountDivision(servceAccount,billingAccount,group,workOrderType,incidentType,formContext); 
    }
}

function getServiceAccountDivision(serviceAccountId,billingAccount,group,workOrderType,incidentType,formContext){
    Xrm.WebApi.retrieveRecord('account', serviceAccountId, '?$select=accountid,_vel_division_value,name').then(
        function success(result) {
            var division = result._vel_division_value;
            getCustomerCotract(billingAccount,group,division,workOrderType,incidentType,formContext); 
        },
        function (error) {
            console.log(error.message);
            // handle error conditions
        }
    );
}

function getCustomerCotract(billingAccount,group,division,workOrderType,incidentType,formContext){
    Xrm.WebApi.retrieveMultipleRecords('vel_customercontract','?$select=vel_customercontractid,vel_name,_vel_pricelist_value&$filter=_vel_customer_value eq '+billingAccount+
                                        ' and _vel_group_value eq '+group+' and _vel_division_value eq '+division+' and _vel_workordertype_value eq '+workOrderType+
                                        ' and _vel_incidenttype_value eq '+incidentType+' and statuscode eq 1').then(
        function success(result) {
            for(var x = 0; x < result.entities.length; x++){
                var resultSet = result.entities[0];
                if(resultSet['_vel_pricelist_value'] != null){
                    setPriceList(resultSet['_vel_pricelist_value'],formContext);
                }
            }
        },
        function (error) {
            console.log(error.message);
        }
    );
}

function setPriceList(priceListId,formContext){
    Xrm.WebApi.retrieveRecord('pricelevel',priceListId,'?$select=pricelevelid,name').then(
        function success(result){
            var priceListLookup = new Array();
            priceListLookup[0] = new Object();
            priceListLookup[0].id = result.pricelevelid;
            priceListLookup[0].name = result.name;
            priceListLookup[0].entityType = 'pricelevel';
            formContext.getAttribute('msdyn_pricelist').setValue(priceListLookup);
        },
        function (error){
            console.log(error.message);
        }
    );
}

function CheckFieldValue (formContext, fieldName) {
    let returnValue = null;
    let control = formContext.getAttribute(fieldName);
    if (control !== null && typeof (control) !== "undefined" && control.getValue() !== null) {
        returnValue = control.getValue()[0].id;
    }
    return returnValue;
}
    
    