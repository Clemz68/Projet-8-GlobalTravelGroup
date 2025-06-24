public with sharing class CrudAccountController {

    @AuraEnabled (cacheable=true)

    public static List <Account> crudAccControllerGet (){

    try {
        
    return crudAccountSelector.crudAccSelectorGet ();
        
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
    }


    @AuraEnabled
    public static void crudAccControllerDelete(Id accDelete) {
        try {

            crudAccountSelector.crudAccSelectorDelete(accDelete);
    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Account crudAccControllerCreate (String accJSON) {
        try {

            return crudAccountSelector.crudAccSelectorCreate (accJSON);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Account crudAccControllerEdit (String accJSON) {
        try {

            return crudAccountSelector.crudAccSelectorEdit (accJSON);

        } catch (Exception e) {
            System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}