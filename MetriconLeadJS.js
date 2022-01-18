function CallNurtureProcess(recordid){
    var isConfirmed = confirm("Are you sure you want to continue?");
    alert(recordid);
    if(isConfirmed){
        var envVarDefQuery = "environmentvariabledefinitions?$filter=schemaname eq 's365_NurtureProcessURL'&$select=environmentvariabledefinitionid";
        var envVarDef = ExecuteFetch(envVarDefQuery);
        if(envVarDef.value[0] !== null && envVarDef.value[0] !== ''){
            var envVarValQuery = "environmentvariablevalues?$filter=_environmentvariabledefinitionid_value eq '" + envVarDef.value[0].environmentvariabledefinitionid + "'&$select=value";
			var envVarVal = Downer.Project.ExecuteFetch(envVarValQuery); 

            if(envVarVal.value[0] !== null && envVarVal.value[0] !== ''){
                var request = new XMLHttpRequest();
                var url = envVarVal.value[0].value;
                request.open("POST",url,true);
                request.setRequestHeader('Content-Type','application/json');
                request.send(JSON.stringify(recordid[0]));
            }
        }
    }
}

function ExecuteFetch(query){
    var result;

    var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();
    var request = new XMLHttpRequest();
    
    request.open("GET",serverUrl + "api/data/v9.1/" + query, false);
    request.setRequestHeader("Accept", "application/json");
	request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	request.setRequestHeader("OData-MaxVersion", "4.0");
	request.setRequestHeader("OData-Version", "4.0");
    request.onreadystatechange = function(){
        if(this.readyState === 4){
            request.onreadystatechange = null;
            if(this.status === 200){
                var data = JSON.parse(this.respose);
                if(data != null){
                    result = data;
                }
            }
            else{
                var error = JSON.parse(this.response).error;
                alert(error.message);
            }
        }
    };
    request.send();
    return result;
}