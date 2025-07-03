public with sharing class CrudAccountController {
  
    /*
    *********************************************************
    @description    : Méthode pour appeler le selector récupérer les comptes.
    @return         : Liste de comptes
    *********************************************************
    */

    @AuraEnabled (cacheable=true)

    public static List <Account> crudAccControllerGet (){

    List <Account> accGet= new List<Account>();

    try { 

    return crudAccountSelector.crudAccSelectorGet ();
     
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
    }

    /*
    *********************************************************
    @description    : Méthode pour apeler le selector et supprimer le compte.
    @param          : Le compte à suppr
    *********************************************************
    */
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
    /*
    *********************************************************
    @description    : Méthode pour apeler le selector et créer un compte.
    @param          : objet js sous format JSON
    @return         : Le compte inséré 
    *********************************************************
    */
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
     /*
    *********************************************************
    @description    : Méthode pour apeler le selector et éditer un compte.
    @param          : objet js sous format JSON
    @return         : Le compte édité
    *********************************************************
    */

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