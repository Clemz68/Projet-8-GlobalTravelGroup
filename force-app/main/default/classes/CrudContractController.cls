public with sharing class CrudContractController {
    /*
    *********************************************************
    @description    : Méthode pour appeler le selector et récupérer les contract liés au compte.
    @param          : Id du compte
    @return         : Liste de contrats
    *********************************************************
    */
     @AuraEnabled (cacheable=true)

    public static List <Contract> crudContControllerGet (Id accountId){

        try {
            
        return crudContractSelector.crudContSelectorGet (accountId);
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    /*
    *********************************************************
    @description    : Méthode pour apeler le selector et supprimer le contrat.
    @param          : Le contrat à suppr
    *********************************************************
    */

    @AuraEnabled
    public static void crudContControllerDelete(Id contDelete) {

        Contract cont = new Contract();

        cont = crudContractSelector.crudContSelectorDelete(contDelete);
    
        if (cont!= null){

            delete cont;
        }

    }
    /*
    *********************************************************
    @description    : Méthode pour apeler le selector et créer un contrat.
    @param          : objet js sous format JSON
    @return         : Le contrat inséré 
    *********************************************************
    */
    @AuraEnabled
    public static Contract crudContControllerCreate (String contJSON, Id accountId) {
        
        Contract contRec = new Contract();
        
        contRec = crudContractSelector.crudContSelectorCreate (contJSON, accountId);

        if (contRec != null){
            insert contRec;
            return contRec;
        }
        return null;
    }
     /*
    *********************************************************
    @description    : Méthode pour apeler le selector et éditer un contrat.
    @param          : objet js sous format JSON
    @return         : Le contrat édité
    *********************************************************
    */
    @AuraEnabled
    public static Contract crudContControllerEdit (String contJSON) {

        Contract contRec = new Contract();

        try {

            contRec = crudContractSelector.crudContSelectorEdit (contJSON);

        } catch (Exception e) {
            System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }

         if (contRec != null){
            update contRec;
            return contRec;
        } else {
            return null;
        }
    }
}
