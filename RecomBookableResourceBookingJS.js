function OnChangeBookingStatus(executionContext) {
    var formContext = executionContext.getFormContext();
    //Show hide resolution section when the booking status changed
    HideResolutionSection(formContext);
}

function OnChangeProgram(executionContext) {
    var formContext = executionContext.getFormContext();
    ClearCauseAndResolution(formContext);
}

function OnChangeCause(executionContext) {
    var formContext = executionContext.getFormContext();
    ClearResolution(formContext);
}

function OnLoadBookingForm(executionContext) {
    var formContext = executionContext.getFormContext();
    //Show/hide resolution section when form on loads
    HideResolutionSection(formContext);
}

//Show/Hide resolution section
function HideResolutionSection(formContext) {
    if (formContext.getAttribute('bookingstatus').getValue() != null) {
        var bookingStatus = formContext.getAttribute('bookingstatus').getValue()[0].name;
        if (bookingStatus !== 'Completed') {
            SetResolutionFieldsNonMandatory(formContext);
            ClearResolutionFields(formContext);
            formContext.ui.tabs.get('GENERAL_TAB').sections.get('RESOLUTION_section').setVisible(false);
        } else {
            formContext.ui.tabs.get('GENERAL_TAB').sections.get('RESOLUTION_section').setVisible(true);
            SetResolutionFieldsMandatory(formContext);
        }
    }
}

//Clear resolution fields
function ClearResolutionFields(formContext) {
    formContext.getAttribute('vel_problem').setValue(null);
    formContext.getAttribute('vel_cause').setValue(null);
    formContext.getAttribute('vel_resolution').setValue(null);
}

//Set resolution fields mandatory
function SetResolutionFieldsMandatory(formContext) {
    formContext.getAttribute('vel_cause').setRequiredLevel('required');
    formContext.getAttribute('vel_resolution').setRequiredLevel('required');
    formContext.getAttribute('vel_problem').setRequiredLevel('required');
}

//Set resolution fields non mandatory
function SetResolutionFieldsNonMandatory(formContext) {
    formContext.getAttribute('vel_cause').setRequiredLevel('recommended');
    formContext.getAttribute('vel_resolution').setRequiredLevel('recommended');
    formContext.getAttribute('vel_problem').setRequiredLevel('recommended');
}

//Clear Cause and Resolution when Problem changed
function ClearCauseAndResolution(formContext) {
    if (formContext.getAttribute('vel_problem').getValue() != null) {
        var program = formContext.getAttribute('vel_problem').getValue();
        if (program != null) {
            formContext.getAttribute('vel_cause').setValue(null);
            formContext.getAttribute('vel_resolution').setValue(null);
        }
    }
}

function ClearResolution(formContext) {
    if (formContext.getAttribute('vel_cause').getValue() != null) {
        var cause = formContext.getAttribute('vel_cause').getValue();
        if (cause != null) {
            formContext.getAttribute('vel_resolution').setValue(null);
        }
    }
}