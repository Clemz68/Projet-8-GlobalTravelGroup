@isTest
private class TestCheckDateClass {
    /*
    *********************************************************
    @description    : Méthode avec @testSetup pour créer des records
    *********************************************************
    */
   @testSetup
    static void testSetup() {
       
        List <Trip__c> trps = FactoryClass.createTestDataTripB();
        insert trps; 
    }
    /*
    *********************************************************
    @description    : Méthode de test pour tester la mise a jour des status selon les dates des trips
    *********************************************************
    */
    @isTest 
    static void test() {

    Test.startTest();

        CheckDateTripBatchatableSchedule cdtbs = new CheckDateTripBatchatableSchedule();
        Id batchId = Database.executeBatch(cdtbs);
    
    Test.stopTest();

        // after the testing stops, assert records were updated properly
        System.assertEquals(1, [select count() from Trip__c where Status__c = 'A venir']);
        System.assertEquals(1, [select count() from Trip__c where Status__c = 'En cours']);
        System.assertEquals(1, [select count() from Trip__c where Status__c = 'Terminé']);

    }
}
