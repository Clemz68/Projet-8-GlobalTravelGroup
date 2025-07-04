@isTest
private class TestCrudAccountSelector {

    public class AccWrapper {
      public String phone;
      public String currencyIsoCode;
      public String industry;
      public String name;
    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe selector qui supprime un account
    *********************************************************
    */
    @isTest
    static void testDelete() {
        
    Account testAccount = FactoryClass.createAccountTestData();
    Id testAccountId = testAccount.Id; 

    Account acc = crudAccountSelector.crudAccSelectorDelete(testAccountId);   

    System.assertNotEquals(null, acc, 'la soql aurait du retourner un account');

    }
     /*
    *********************************************************
    @description    : Méthode de test pour tester la classe selector qui récupère les accounts
    *********************************************************
    */
     @isTest
    static void testGet() {
        
    Account testAccount = FactoryClass.createAccountTestData();
    List <Account> acc = crudAccountSelector.crudAccSelectorGet();   

    System.assertNotEquals(null, acc, 'la soql aurait du retourner un account');

    }
     /*
    *********************************************************
    @description    : Méthode de test pour tester la classe selector qui créér un account
    *********************************************************
    */
     @isTest
    static void testCreate() {
        
    AccWrapper accWrapper = new AccWrapper();
    accWrapper.phone = '123456789';
    accWrapper.currencyIsoCode = 'EUR';
    accWrapper.industry = 'Education';
    accWrapper.name = 'clement';

    String accJSON = JSON.serialize(accWrapper);

    Account acc = crudAccountSelector.crudAccSelectorCreate(accJSON);   

    System.assertNotEquals(null, acc, 'la soql aurait du retourner account');

    }
     /*
    *********************************************************
    @description    : Méthode de test pour tester la classe selector qui édite un account
    *********************************************************
    */
     @isTest
    static void testEdit() {
        
    Account testAccount = FactoryClass.createAccountTestData();
    String accJSON = JSON.serialize(testAccount);

    Account acc = crudAccountSelector.crudAccSelectorEdit(accJSON);   

    System.assertNotEquals(null, acc, 'la soql aurait du retourner account');

    }


}