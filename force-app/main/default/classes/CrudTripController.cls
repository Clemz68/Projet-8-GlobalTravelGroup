public with sharing class CrudTripController {
    
    @AuraEnabled
    public static void crudTrpControllerDelete(Id tripDelete) {

        Trip__c trp = new Trip__c();

        try {

        trp = crudTripSelector.crudTrpSelectorDelete(tripDelete);
    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        if (trp!= null){

            delete trp;
        }
    }

    @AuraEnabled
    public static Trip__c crudTrpControllerCreate (String tripJSON, Id accountId) {
        
        Trip__c tripRec = new Trip__c();
        
        try {

        tripRec = crudTripSelector.crudTrpSelectorCreate (tripJSON, accountId);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        if (tripRec!= null){
            insert tripRec;
            return tripRec;
        } else {
            return null;
        }
    }

    @AuraEnabled
    public static Trip__c crudTrpControllerEdit (String tripJSON) {

        Trip__c tripRec = new Trip__c();

        try {

            tripRec = crudTripSelector.crudTrpSelectorEdit (tripJSON);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

         if (tripRec!= null){
            update tripRec;
            return tripRec; 

        } else {
            return null;
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