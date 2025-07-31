public with sharing class CrudOppController {
      /*
    *********************************************************
    @description    : Méthode pour appeler le selector et récupérer les Opps liés au compte.
    @param          : Id du compte
    @return         : Liste de Opps
    *********************************************************
    */
     @AuraEnabled (cacheable=true)

    public static List <Opportunity> crudOppControllerGet (Id accountId){

    try {
        
    return crudOppSelector.crudOppSelectorGet (accountId);
        
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
    }
    /*
    *********************************************************
    @description    : Méthode pour apeler le selector et supprimer l'Opp'.
    @param          : L'Opp à suppr
    *********************************************************
    */

    @AuraEnabled
    public static void crudOppControllerDelete(Id oppDelete) {

        Opportunity opp = new Opportunity();

        opp = crudOppSelector.crudOppSelectorDelete(oppDelete);

        if (opp!= null){
            delete opp;
        }

    }
    /*
    *********************************************************
    @description    : Méthode pour apeler le selector et créer une Opp.
    @param          : objet js sous format JSON
    @return         : L'Opp insérée
    *********************************************************
    */
    @AuraEnabled
    public static Opportunity crudOppControllerCreate (String oppJSON, Id accountId) {
        
        Opportunity oppRec = new Opportunity();
        
         oppRec = crudOppSelector.crudOppSelectorCreate (oppJSON, accountId);

         if (oppRec != null){

            insert oppRec;
            return oppRec;
        } else {
            return null;
        }
    }
   /*
    *********************************************************
    @description    : Méthode pour apeler le selector et éditer une Opp.
    @param          : objet js sous format JSON
    @return         : L'Opp éditée
    *********************************************************
    */
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