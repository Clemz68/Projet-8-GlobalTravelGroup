public with sharing class CrudContractSelector {

    public class ContWrapper {
      public Id Id;
      public Integer contractNumber;
      public String currencyIsoCode;
      public String status;
      public Date startDate;
      public Integer contractTerm;
    }

    public static void crudContSelectorDelete (Id contDelete) {

      Contract contToDelete = [SELECT Id FROM Contract WHERE Id = :contDelete LIMIT 1 ];

      delete contToDelete;
    }

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

                insert contRec;

                return contRec;
            }
            return null;

        } catch (Exception e) {
          System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

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

                update contRec;

                return contRec;
            }
            return null;

        } catch (Exception e) {
          System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
  public static List <Contract> crudContSelectorGet (Id accountId) {

      List <Contract> conts = [SELECT Id, AccountId, ContractNumber, CurrencyIsoCode, Status, StartDate, ContractTerm FROM Contract WHERE AccountId = :accountId];

      return conts;
    }
}