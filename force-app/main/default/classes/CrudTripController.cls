public with sharing class CrudTripController {
      /*
    *********************************************************
    @description    : Méthode pour appeler le selector et récupérer les trips liés au compte.
    @param          : Id du compte
    @return         : Liste de trips
    *********************************************************
    */
    @AuraEnabled
    public static void crudTrpControllerDelete(Id tripDelete) {

        Trip__c trp = new Trip__c();

        trp = crudTripSelector.crudTrpSelectorDelete(tripDelete);
    
        if (trp!= null){

            delete trp;
        }
    }
    /*
    *********************************************************
    @description    : Méthode pour apeler le selector et supprimer le trip.
    @param          : Le trip à suppr
    *********************************************************
    */
    @AuraEnabled
    public static Trip__c crudTrpControllerCreate (String tripJSON, Id accountId) {
        
        Trip__c tripRec = new Trip__c();

        tripRec = crudTripSelector.crudTrpSelectorCreate (tripJSON, accountId);

        if (tripRec!= null){
            insert tripRec;
            return tripRec;
        } else {
            return null;
        }
    }
    /*
    *********************************************************
    @description    : Méthode pour apeler le selector et créer un trip.
    @param          : objet js sous format JSON
    @return         : Le trip inséré
    *********************************************************
    */
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
     /*
    *********************************************************
    @description    : Méthode pour apeler le selector et éditer un trip.
    @param          : objet js sous format JSON
    @return         : Le trip édité
    *********************************************************
    */
    @AuraEnabled (cacheable=true)

    public static List <Trip__c> crudTrpControllerGet (Id accountId){

    return crudTripSelector.crudTrpSelectorGet (accountId);
    
    }
}