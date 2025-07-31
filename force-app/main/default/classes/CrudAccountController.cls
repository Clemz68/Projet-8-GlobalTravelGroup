public with sharing class CrudAccountController {
  
    /*
    *********************************************************
    @description    : Méthode pour appeler le selector et récupérer les comptes.
    @return         : List <Account>
    *********************************************************
    */

    @AuraEnabled (cacheable=true)

        public static List <Account> crudAccControllerGet (){

        try { 

        return crudAccountSelector.crudAccSelectorGet ();
        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /*
    *********************************************************
    @description    : Appele le selector et supprimer le compte.
    @param          : Account à supprimer
    *********************************************************
    */
    @AuraEnabled
    public static void crudAccControllerDelete(Id accDelete) {

        Account acc = new Account();

        acc = crudAccountSelector.crudAccSelectorDelete(accDelete);

        if (acc!= null){
        delete acc;
        }
    }
    /*
    *********************************************************
    @description    : Apelle le selector et créer un compte.
    @param          : objet JavaScript sous format JSON
    @return         : Account inséré 
    *********************************************************
    */
    @AuraEnabled
    public static Account crudAccControllerCreate (String accJSON) {

        Account accRec = new Account();

        

        accRec = crudAccountSelector.crudAccSelectorCreate (accJSON);

        

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
    @description    : Appele le selector et met à jour l'Account.
    @param          : objet JavaScript sous format JSON
    @return         : Account mis à jour
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