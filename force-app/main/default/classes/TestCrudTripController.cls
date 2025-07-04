@isTest
private class TestCrudTripController {

     public class Wrapper {
      public String status;
      public String destination;
      public Date startDate;
      public Date endDate;
      public Integer numberOfParticipants;
    }
  /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui supprime un trip
    *********************************************************
    */
    @isTest
    static void testDelete() {
        
    Trip__c testObject = FactoryClass.createTrpTestData();
    Id testId = testObject.Id; 

    CrudTripController.crudTrpControllerDelete(testId);   

    List <Trip__c> trp = [SELECT Id FROM Trip__c WHERE Id = :testId LIMIT 1];
    System.assertEquals(0, trp.size(), 'Le Trip__c aurait dû être supprimé');
   
    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui récupère les trips
    *********************************************************
    */
     @isTest
    static void testGet() {
    
    Trip__c testObject = FactoryClass.createTrpTestData();
    Id accountId = testObject.Account__c;

    List <Trip__c> trp = CrudTripController.crudTrpControllerGet(accountId);   

    System.assertNotEquals(null, trp, 'la soql aurait du retourner un obj');

    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui créer un trip
    *********************************************************
    */
     @isTest
    static void testCreate() {
    
    Account trpAccount = FactoryClass.createAccountTestData();
    Id trpAccountId = trpAccount.Id; 

    Wrapper wrapper = new Wrapper();
    wrapper.status = 'Terminé';
    wrapper.destination = 'somewhere';
    wrapper.startDate = Date.newInstance(1990, 11, 21);
    wrapper.endDate = Date.newInstance(1991, 11, 21);
    wrapper.numberOfParticipants= 12;

    String objJSON = JSON.serialize(wrapper);

    Trip__c trp = CrudTripController.crudTrpControllerCreate(objJSON,trpAccountId);   

    System.assertNotEquals(null, trp, 'la soql aurait du retourner un obj');

    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui créer un trip
    *********************************************************
    */
     @isTest
    static void testEdit() {
        
    Trip__c testObject = FactoryClass.createTrpTestData();
    String objJSON = JSON.serialize(testObject);

    Trip__c trp = CrudTripController.crudTrpControllerEdit(objJSON);   

    System.assertNotEquals(null, trp, 'la soql aurait du retourner un obj');

    }
}