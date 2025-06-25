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
    public static void crudContControllerDelete(Id contDelete) {

        Contract cont = new Contract();

        try {

        cont = crudContractSelector.crudContSelectorDelete(contDelete);
    
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        if (cont!= null){

            delete cont;
        }

    }

    @AuraEnabled
    public static Contract crudContControllerCreate (String contJSON, Id accountId) {
        
        Contract contRec = new Contract();
        
        try {

           contRec = crudContractSelector.crudContSelectorCreate (contJSON, accountId);

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        if (contRec != null){
            insert contRec;
            return contRec;
        }
        return null;
    }

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
