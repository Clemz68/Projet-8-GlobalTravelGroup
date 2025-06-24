public with sharing class CrudOppController {

     @AuraEnabled (cacheable=true)

    public static List <Opportunity> crudOppControllerGet (Id accountId){

    try {
        
    return crudOppSelector.crudOppSelectorGet (accountId);
        
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
    }


    @AuraEnabled
    public static void crudOppControllerDelete(Id OppDelete) {
        try {

            crudOppSelector.crudOppSelectorDelete(OppDelete);
    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Opportunity crudOppControllerCreate (String oppJSON, Id accountId) {
        try {

            return crudOppSelector.crudOppSelectorCreate (oppJSON, accountId);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Opportunity crudOppControllerEdit (String oppJSON) {
        try {

            return crudOppSelector.crudOppSelectorEdit (oppJSON);

        } catch (Exception e) {
            System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}