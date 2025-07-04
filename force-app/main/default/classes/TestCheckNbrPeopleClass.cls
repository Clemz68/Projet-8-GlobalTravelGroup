@isTest
private class TestCheckNbrPeopleClass {
    /*
    *********************************************************
    @description    : Méthode avec @testSetup pour créer des records
    *********************************************************
    */
    @testSetup
    static void testSetup() {
       
        List <Trip__c> trps = FactoryClass.createTestDataTrip();
        insert trps; 
    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la mise a jour du status selon le nombre de personnes
    *********************************************************
    */
    @isTest 
    static void test() {

    Test.startTest();

        CheckNbrPeopleTripBatchatableSchedule cnptbs = new CheckNbrPeopleTripBatchatableSchedule();
        Id batchId = Database.executeBatch(cnptbs);
    
    Test.stopTest();

        // after the testing stops, assert records were updated properly
        System.assertEquals(5, [select count() from Trip__c where Status__c = 'Annulé']);

    }
}