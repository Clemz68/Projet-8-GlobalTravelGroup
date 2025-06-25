public with sharing class CrudAccountSelector {

    public class AccWrapper {
      public Id id;
      public String phone;
      public String currencyIsoCode;
      public String industry;
      public String name;
    }

    public static Account crudAccSelectorDelete (Id accDelete) {

      Account acc = [SELECT Id FROM Account WHERE Id = :accDelete LIMIT 1 ];
      return acc;
    }

    public static Account crudAccSelectorCreate (String accJSON) {
        try {
            AccWrapper accWrapperRec =  (AccWrapper) JSON.deserialize(accJSON,AccWrapper.class);
            
            if(accWrapperRec != null){
              Account accRec  = new Account();
                accRec.CurrencyIsoCode = accWrapperRec.currencyIsoCode;
                accRec.Phone = accWrapperRec.phone;
                accRec.Industry = accWrapperRec.industry;
                accRec.Name = accWrapperRec.name;

                return accRec;
            }
            return null;

        } catch (Exception e) {
          System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static Account crudAccSelectorEdit (String accJSON) {

       try {
      AccWrapper accWrapperRec =  (AccWrapper) JSON.deserialize(accJSON,AccWrapper.class);
            if(accWrapperRec != null){
              System.debug('accWrapperRec.Id = ' + accWrapperRec.Id);
              Account accRec = new Account();

                accRec.Id = accWrapperRec.id;
                accRec.CurrencyIsoCode = accWrapperRec.currencyIsoCode;
                accRec.Phone = accWrapperRec.phone;
                accRec.Industry = accWrapperRec.industry;
                accRec.Name = accWrapperRec.name;

                return accRec;
            }
            return null;

        } catch (Exception e) {
          System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
  public static List <Account> crudAccSelectorGet () {

      List <Account> accounts = [SELECT Id, Name, Industry, Phone, CurrencyIsoCode FROM Account];
        System.debug('les accounts récupérés' + accounts);
      return accounts;
    }
}