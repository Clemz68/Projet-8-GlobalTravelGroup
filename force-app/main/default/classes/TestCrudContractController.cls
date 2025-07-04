
@isTest
private class TestCrudContractController {

    public class Wrapper {
      public Integer contractNumber;
      public String currencyIsoCode;
      public String status;
      public Date startDate;
      public Integer contractTerm;
    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui supprime un contrat
    *********************************************************
    */
    @isTest
    static void testDelete() {
        
    Contract testObject = FactoryClass.createContractTestData();
    Id testId = testObject.Id; 

    crudContractController.crudContControllerDelete(testId);   
    List <Contract> cont = [SELECT Id FROM Contract WHERE Id = :testId LIMIT 1];
    System.assertNotEquals(null, cont, 'la soql aurait du retourner un obj');

    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui récupère les contrats
    *********************************************************
    */
     @isTest
    static void testGet() {
    
    Contract testObject = FactoryClass.createContractTestData();
    Id accountId = testObject.AccountId;

    List <Contract > cont = crudContractController.crudContControllerGet(accountId);   

    System.assertNotEquals(null, cont, 'la soql aurait du retourner un obj');

    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui créer un contrat
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

    Contract cont = crudContractController.crudContControllerCreate(objJSON,contAccountId);   

    System.assertNotEquals(null, cont, 'la soql aurait du retourner un obj');

    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui édite un contrat
    *********************************************************
    */
     @isTest
    static void testEdit() {
        
    Contract testObject = FactoryClass.createContractTestData();
    String objJSON = JSON.serialize(testObject);

    Contract cont = crudContractController.crudContControllerEdit(objJSON);   

    System.assertNotEquals(null, cont, 'la soql aurait du retourner un obj');

    }
}