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
    public static void crudOppControllerDelete(Id oppDelete) {

        Opportunity opp = new Opportunity();

        try {

        opp = crudOppSelector.crudOppSelectorDelete(oppDelete);
    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        if (opp!= null){
            delete opp;
        }

    }

    @AuraEnabled
    public static Opportunity crudOppControllerCreate (String oppJSON, Id accountId) {
        
        Opportunity oppRec = new Opportunity();
        
        try {

            oppRec = crudOppSelector.crudOppSelectorCreate (oppJSON, accountId);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

         if (oppRec != null){

            insert oppRec;
            return oppRec;
        } else {
            return null;
        }
    }

    @AuraEnabled
    public static Opportunity crudOppControllerEdit (String oppJSON) {

        Opportunity oppRec = new Opportunity();

        try {

            oppRec = crudOppSelector.crudOppSelectorEdit (oppJSON);

        } catch (Exception e) {
            System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

        if (oppRec != null){

            update oppRec;
            return oppRec;
        } else {
            return null;
        }
    }
}