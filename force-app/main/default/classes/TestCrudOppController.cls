@isTest
private class TestCrudOppController {

   public class Wrapper {
      public Id Id;
      public String name;
      public String stage;
      public Date closeDate;
      public Double amount;
      public String destination;
      public Date startDate;
      public Date endDate;
      public Integer numberOfParticipants;
    }
   /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui supprime une opp
    *********************************************************
    */
    @isTest
    static void testDelete() {
        
    Opportunity testObject = FactoryClass.createOppTestData();
    Id testId = testObject.Id; 

    CrudOppController.crudOppControllerDelete(testId);   

    List <Opportunity> opp = [SELECT Id FROM Opportunity WHERE Id = :testId LIMIT 1];
    System.assertEquals(0, opp.size(), 'L opp aurait dû être supprimée');
   
    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui récupère les opps
    *********************************************************
    */
     @isTest
    static void testGet() {
    
    Opportunity testObject = FactoryClass.createOppTestData();
    Id accountId = testObject.AccountId;

    List <Opportunity> opp = CrudOppController.crudOppControllerGet(accountId);   

    System.assertNotEquals(null, opp, 'la soql aurait du retourner un obj');

    }
   /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui créer une opp
    *********************************************************
    */
     @isTest
    static void testCreate() {
    
    Account oppAccount = FactoryClass.createAccountTestData();
    Id oppAccountId = oppAccount.Id; 

    Wrapper wrapper = new Wrapper();
    wrapper.name = 'Opptest';
    wrapper.stage = 'Qualification';
    wrapper.closeDate = Date.newInstance(1990, 11, 21);
    wrapper.amount = 47;
    wrapper.destination = 'france';

    String objJSON = JSON.serialize(wrapper);

    Opportunity opp = CrudOppController.crudOppControllerCreate(objJSON,oppAccountId);   

    System.assertNotEquals(null, opp, 'la soql aurait du retourner un obj');

    }
   /*
    *********************************************************
    @description    : Méthode de test pour tester la classe controller qui édite une opp
    *********************************************************
    */
     @isTest
    static void testEdit() {
        
    Opportunity testObject = FactoryClass.createOppTestData();
      Id oppId = testObject.Id; 

    Wrapper wrapper = new Wrapper();
    wrapper.id = oppId;
    wrapper.stage = 'Qualification';
    wrapper.closeDate = Date.newInstance(1990, 11, 21);
    wrapper.amount = 42;
    wrapper.destination = 'france';

      String objJSON = JSON.serialize(wrapper);

    Opportunity opp = CrudOppController.crudOppControllerEdit(objJSON);   

    System.assertNotEquals(null, opp, 'la soql aurait du retourner un obj');

    }
}