@isTest
private class TestCrudContractSelector {

    public class Wrapper {
      public Integer contractNumber;
      public String currencyIsoCode;
      public String status;
      public Date startDate;
      public Integer contractTerm;
    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe selector qui supprime un contrat
    *********************************************************
    */
    @isTest
    static void testDelete() {
        
    Contract testObject = FactoryClass.createContractTestData();
    Id testId = testObject.Id; 

    Contract cont = crudContractSelector.crudContSelectorDelete(testId);   

    System.assertNotEquals(null, cont, 'la soql aurait du retourner un obj');

    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe selector qui récupère les contrats
    *********************************************************
    */
     @isTest
    static void testGet() {
    
    Contract testObject = FactoryClass.createContractTestData();
    Id accountId = testObject.AccountId;

    List <Contract > cont = crudContractSelector.crudContSelectorGet(accountId);   

    System.assertNotEquals(null, cont, 'la soql aurait du retourner un obj');

    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe selector qui créer un contrat
    *********************************************************
    */
     @isTest
    static void testCreate() {
    
    Account contAccount = FactoryClass.createAccountTestData();
    Id contAccountId = contAccount.Id; 

    Wrapper wrapper = new Wrapper();
    wrapper.currencyIsoCode = 'EUR';
    wrapper.status = 'Draft';
    wrapper.startDate = Date.newInstance(1990, 11, 21);
    wrapper.contractTerm = 5;

    String objJSON = JSON.serialize(wrapper);

    Contract cont = crudContractSelector.crudContSelectorCreate(objJSON,contAccountId);   

    System.assertNotEquals(null, cont, 'la soql aurait du retourner un obj');

    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe selector qui édite un contrat
    *********************************************************
    */
     @isTest
    static void testEdit() {
        
    Contract testObject = FactoryClass.createContractTestData();
    String objJSON = JSON.serialize(testObject);

    Contract cont = crudContractSelector.crudContSelectorEdit(objJSON);   

    System.assertNotEquals(null, cont, 'la soql aurait du retourner un obj');

    }

}