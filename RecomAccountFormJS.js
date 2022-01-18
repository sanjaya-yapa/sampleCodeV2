//Form onchange
function OnChangeAccountType(executionContext) {
    var formContext = executionContext.getFormContext();
    ShowHideStoreInformation(formContext);
    AccountFormShowHideTabs(formContext);
}

//Form onload
function OnLoadRecomAccountForm(executionContext) {
    var formContext = executionContext.getFormContext();
    ShowHideStoreInformation(formContext);
    AccountFormShowHideTabs(formContext);
}

//Show hide Store information tab
function ShowHideStoreInformation(formContext) {
    if (formContext.getAttribute('customertypecode').getValue() === 282230000) {
        formContext.ui.tabs.get('SUMMARY_TAB').sections.get('SUMMARY_TAB_section_7').setVisible(true);
        SetStoreInformationFieldsMandatory(formContext);
    }else if(formContext.getAttribute('customertypecode').getValue() === 282230001){
        formContext.ui.tabs.get('SUMMARY_TAB').sections.get('SUMMARY_TAB_section_7').setVisible(true);
        SetStoreInformationFieldsMandatory(formContext);
    } else {
        formContext.getAttribute('vel_storetype').setValue(null);
        formContext.getAttribute('vel_storenumber').setValue(null);
        formContext.getAttribute('vel_division').setValue(null);
        formContext.getAttribute('vel_defaultschedulingteamelectrical').setValue(null);
        formContext.getAttribute('vel_defaultschedulingteamequipment').setValue(null);
        SetStoreInformationFieldsNonMandatory(formContext);
        formContext.ui.tabs.get('SUMMARY_TAB').sections.get('SUMMARY_TAB_section_7').setVisible(false);
    }
}

//Set the store information fields mandatory
function SetStoreInformationFieldsMandatory(formContext) {
    formContext.getAttribute('vel_storenumber').setRequiredLevel('required');
    formContext.getAttribute('vel_defaultschedulingteamelectrical').setRequiredLevel('required');
    formContext.getAttribute('vel_defaultschedulingteamequipment').setRequiredLevel('required');
}

function SetStoreInformationFieldsNonMandatory(formContext) {
    formContext.getAttribute('vel_storenumber').setRequiredLevel('recommended');
    formContext.getAttribute('vel_defaultschedulingteamelectrical').setRequiredLevel('recommended');
    formContext.getAttribute('vel_defaultschedulingteamequipment').setRequiredLevel('recommended');
}

function AccountFormShowHideTabs(formContext) {
    if (formContext.getAttribute('customertypecode').getValue() === 12) {
        //Show 'Divisions' tab and Hide 'Customer Contracts' tab
        SetStoreInformationFieldsNonMandatory(formContext);
        formContext.ui.tabs.get('tab_6').setVisible(false);
        formContext.ui.tabs.get('divisions').setVisible(true);
    } else if (formContext.getAttribute('customertypecode').getValue() === 3) {
        //Hide 'Divisions' tab and Show 'Customer Contracts' tab
        SetStoreInformationFieldsNonMandatory(formContext);
        formContext.ui.tabs.get('divisions').setVisible(false);
        formContext.ui.tabs.get('tab_6').setVisible(true);
    } else if ((formContext.getAttribute('customertypecode').getValue() !== 12) || (formContext.getAttribute('customertypecode').getValue() !== 3)) {
        //Hide 'Divisions' tab and Hide 'Customer Contracts' tab
        formContext.ui.tabs.get('divisions').setVisible(false);
        formContext.ui.tabs.get('tab_6').setVisible(false);
    } else if (formContext.getAttribute('customertypeode').getValue() === null) {
        //Hide 'Divisions' tab and Hide 'Customer Contracts' tab
        formContext.ui.tabs.get('divisions').setVisible(false);
        formContext.ui.tabs.get('tab_6').setVisible(false);
    }
}