public with sharing class CrudContractSelector {

    public class ContWrapper {
      public Id Id;
      public Integer contractNumber;
      public String currencyIsoCode;
      public String status;
      public Date startDate;
      public Integer contractTerm;
    }
  /*
    *********************************************************
    @description    : Méthode avec SOQL pour récupérer un contrat.
    @param          : Id du contrat
    @return         : Le contrat
    *********************************************************
    */
    public static Contract crudContSelectorDelete (Id contDelete) {

      Contract cont = [SELECT Id FROM Contract WHERE Id = :contDelete LIMIT 1 ];
      return cont;
    }
    /*
    *********************************************************
    @description    : Méthode pour créer un contrat.
    @param          : objet js sous format JSON, Id du compte
    @return         : objet contrat sans Id propre
    *********************************************************
    */
    public static Contract crudContSelectorCreate (String contJSON, Id accountId) {
        try {
            ContWrapper contWrapperRec =  (ContWrapper) JSON.deserialize(contJSON,ContWrapper.class);
            
            if(contWrapperRec != null){
              Contract contRec  = new Contract();
                contRec.AccountId = accountId;
                contRec.CurrencyIsoCode = contWrapperRec.currencyIsoCode;
                contRec.Status = contWrapperRec.status;
                contRec.StartDate = contWrapperRec.startDate;
                contRec.ContractTerm = contWrapperRec.contractTerm;

                return contRec;
            }
            return null;

        } catch (Exception e) {
          System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
    /*
    *********************************************************
    @description    : Méthode pour éditer un contrat.
    @param          : objet js sous format JSON
    @return         : objet contrat complet avec Id existant
    *********************************************************
    */
    public static Contract crudcontSelectorEdit (String contJSON) {

       try {
      ContWrapper contWrapperRec =  (ContWrapper) JSON.deserialize(contJSON,ContWrapper.class);
            if(contWrapperRec != null){
              System.debug('contWrapperRec.Id = ' + contWrapperRec.Id);
              Contract contRec = new Contract();

                contRec.Id = contWrapperRec.Id;
                contRec.CurrencyIsoCode = contWrapperRec.currencyIsoCode;
                contRec.Status = contWrapperRec.status;
                contRec.StartDate = contWrapperRec.startDate;
                contRec.ContractTerm = contWrapperRec.contractTerm;

                return contRec;
            }
            return null;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    /*
    *********************************************************
    @description    : Méthode avec SOQL pour récupérer les contrat liés au compte.
    @param          : Id du compte
    @return         : Liste de contrats
    *********************************************************
    */
  public static List <Contract> crudContSelectorGet (Id accountId) {

      List <Contract> conts = [SELECT Id, AccountId, ContractNumber, CurrencyIsoCode, Status, StartDate, ContractTerm FROM Contract WHERE AccountId = :accountId];
      return conts;
    }
}