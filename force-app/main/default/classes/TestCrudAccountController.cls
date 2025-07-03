@isTest
private class TestCrudAccountController {

    public class AccWrapper {
      public String phone;
      public String currencyIsoCode;
      public String industry;
      public String name;
    }

    @isTest
    static void testDelete() {
        
    Account testAccount = FactoryClass.createAccountTestData();
    Id testAccountId = testAccount.Id; 

    CrudAccountController.crudAccControllerDelete(testAccountId);   
        List <Account> acc = [SELECT Id FROM Account WHERE Id = :testAccountId LIMIT 1];
    System.assertNotEquals(null, acc, 'la soql aurait du retourner un account');

    }

     @isTest
    static void testGet() {
        
    Account testAccount = FactoryClass.createAccountTestData();
    List <Account> acc = crudAccountController.crudAccControllerGet();   

    System.assertNotEquals(null, acc, 'la soql aurait du retourner un account');

    }

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

     @isTest
    static void testEdit() {
        
    Account testAccount = FactoryClass.createAccountTestData();
    String accJSON = JSON.serialize(testAccount);

    Account acc = crudAccountController.crudAccControllerEdit(accJSON);   

    System.assertNotEquals(null, acc, 'la soql aurait du retourner account');

    }

}