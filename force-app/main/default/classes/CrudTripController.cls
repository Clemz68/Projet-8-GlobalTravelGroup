public with sharing class CrudTripController {
    
    @AuraEnabled
    public static void crudTrpControllerDelete(Id tripDelete) {
        try {

            crudTripSelector.crudTrpSelectorDelete(tripDelete);
    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Trip__c crudTrpControllerCreate (String tripJSON, Id accountId) {
        try {

            return crudTripSelector.crudTrpSelectorCreate (tripJSON, accountId);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Trip__c crudTrpControllerEdit (String tripJSON) {
        try {

            return crudTripSelector.crudTrpSelectorEdit (tripJSON);

        } catch (Exception e) {
            System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled (cacheable=true)

    public static List <Trip__c> crudTrpControllerGet (Id accountId){

    try {
        
    return crudTripSelector.crudTrpSelectorGet (accountId);
        
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
    }
}