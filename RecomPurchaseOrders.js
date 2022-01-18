function onPurchaseOrderOnLoad(executionContext){
    var formContext = executionContext.getFormContext();
    //Get System user
    var userId = Xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, "");
    console.log('Current User: '+userId);

    if(formContext.getAttribute('msdyn_receivetowarehouse').getValue() == null){
        GetBookableresource(userId,formContext);
    }
}          

function GetBookableresource(userId,formContext){
    Xrm.WebApi.retrieveMultipleRecords('bookableresource', '?$select=bookableresourceid,_msdyn_warehouse_value&$filter=_userid_value eq ' + userId +
                                        ' and resourcetype eq 3').then(
        function success(result){
            for(var x = 0; x < result.entities.length; x++){
                var resultSet = result.entities[0];
                if(resultSet['_msdyn_warehouse_value']!= null){
                    SetWarehouseForPO(resultSet['_msdyn_warehouse_value'],formContext);
                }
            }                                            
        },
        function(error){
            console.log('ERROR: '+ error.message);
        }
    );                               
}

function SetWarehouseForPO(warehouseId,formContext){
    Xrm.WebApi.retrieveMultipleRecords('msdyn_warehouse', '?$select=msdyn_warehouseid,msdyn_name&$filter=msdyn_warehouseid eq '+warehouseId).then(
        function success(result){
            for(var x = 0; x < result.entities.length; x++){
                var resultSet = result.entities[0];
                if(resultSet != null){
                    var warehouseLookup = new Array();
                    warehouseLookup[0] = new Object();
                    warehouseLookup[0].id = resultSet['msdyn_warehouseid'];
                    warehouseLookup[0].name = resultSet['msdyn_name'];
                    warehouseLookup[0].entityType = 'msdyn_warehouse';
                    formContext.getAttribute('msdyn_receivetowarehouse').setValue(warehouseLookup);
                }   
                break;
            }
        },
        function(error){
            console.log('ERROR:'+ error.message);
        }
    );
}

