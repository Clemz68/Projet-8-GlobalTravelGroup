public with sharing class CrudContractController {

     @AuraEnabled (cacheable=true)

    public static List <Contract> crudContControllerGet (Id accountId){

    try {
        
    return crudContractSelector.crudContSelectorGet (accountId);
        
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
    }


    @AuraEnabled
    public static void crudContControllerDelete(Id ContDelete) {
        try {

            crudContractSelector.crudContSelectorDelete(ContDelete);
    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Contract crudContControllerCreate (String contJSON, Id accountId) {
        try {

            return crudContractSelector.crudContSelectorCreate (contJSON, accountId);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Contract crudContControllerEdit (String contJSON) {
        try {

            return crudContractSelector.crudContSelectorEdit (contJSON);

        } catch (Exception e) {
            System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}
