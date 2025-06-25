public with sharing class CrudAccountController {

    @AuraEnabled (cacheable=true)

    public static List <Account> crudAccControllerGet (){

    List <Account> accGet= new List<Account>();

    try { 

    return crudAccountSelector.crudAccSelectorGet ();
     
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
    }


    @AuraEnabled
    public static void crudAccControllerDelete(Id accDelete) {

        Account acc = new Account();

        try {

        acc = crudAccountSelector.crudAccSelectorDelete(accDelete);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        if (acc!= null){
        delete acc;
        }
    }

    @AuraEnabled
    public static Account crudAccControllerCreate (String accJSON) {

        Account accRec = new Account();

        try {

            accRec = crudAccountSelector.crudAccSelectorCreate (accJSON);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        if (accRec!=null){
            insert accRec;
            return accRec;
        }
        else {
        return null;
        }

    }

    @AuraEnabled
    public static Account crudAccControllerEdit (String accJSON) {

        Account accRec = new Account();

        try {

            accRec = crudAccountSelector.crudAccSelectorEdit (accJSON);

        } catch (Exception e) {
            System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

        if (accRec!=null){
            update accRec;
            return accRec;
        }
        else {
        return null;
        }
    }
}