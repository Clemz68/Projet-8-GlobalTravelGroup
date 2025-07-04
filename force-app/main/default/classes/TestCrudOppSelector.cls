@isTest
private class TestCrudOppSelector {

    public class Wrapper {
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
    @description    : Méthode de test pour tester la classe selector qui supprime une opp
    *********************************************************
    */
    @isTest
    static void testDelete() {
        
    Opportunity testObject = FactoryClass.createOppTestData();
    Id testId = testObject.Id; 

    Opportunity opp = crudOppSelector.crudOppSelectorDelete(testId);   

    System.assertNotEquals(null, opp, 'la soql aurait du retourner un obj');

    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe selector qui récupère les opps
    *********************************************************
    */
     @isTest
    static void testGet() {
    
    Opportunity testObject = FactoryClass.createOppTestData();
    Id accountId = testObject.AccountId;

    List <Opportunity> opp = crudOppSelector.crudOppSelectorGet(accountId);   

    System.assertNotEquals(null, opp, 'la soql aurait du retourner un obj');

    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe selector qui créer une opp
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

    Opportunity opp = crudOppSelector.crudOppSelectorCreate(objJSON,oppAccountId);   

    System.assertNotEquals(null, opp, 'la soql aurait du retourner un obj');

    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la classe selector qui édite une opp
    *********************************************************
    */
     @isTest
    static void testEdit() {
        
    Opportunity testObject = FactoryClass.createOppTestData();
    String objJSON = JSON.serialize(testObject);

    Opportunity opp = crudOppSelector.crudOppSelectorEdit(objJSON);   

    System.assertNotEquals(null, opp, 'la soql aurait du retourner un obj');

    }

}