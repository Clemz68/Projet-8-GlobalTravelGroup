@isTest
private class TestCrudAccountController {

    public class AccWrapper {
      public String phone;
      public String currencyIsoCode;
      public String industry;
      public String name;
    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui supprime un account
    *********************************************************
    */

    @isTest
    static void testDelete() {
        
    Account testAccount = FactoryClass.createAccountTestData();
    Id testAccountId = testAccount.Id; 

    CrudAccountController.crudAccControllerDelete(testAccountId);   
        List <Account> acc = [SELECT Id FROM Account WHERE Id = :testAccountId LIMIT 1];
    System.assertNotEquals(null, acc, 'la soql aurait du retourner un account');

    }
   /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui recupère les account
    *********************************************************
    */

     @isTest
    static void testGet() {
        
    Account testAccount = FactoryClass.createAccountTestData();
    List <Account> acc = crudAccountController.crudAccControllerGet();   

    System.assertNotEquals(null, acc, 'la soql aurait du retourner un account');

    }
     /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui créé un account
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

    Account acc = CrudAccountController.crudAccControllerCreate(accJSON);   

    System.assertNotEquals(null, acc, 'la soql aurait du retourner account');

    }
      /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui édite un account
    *********************************************************
    */

     @isTest
    static void testEdit() {
        
    Account testAccount = FactoryClass.createAccountTestData();
    String accJSON = JSON.serialize(testAccount);

    Account acc = crudAccountController.crudAccControllerEdit(accJSON);   

    System.assertNotEquals(null, acc, 'la soql aurait du retourner account');

    }

}