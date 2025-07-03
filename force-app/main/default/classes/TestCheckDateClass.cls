@isTest
private class TestCheckDateClass {

   @testSetup
    static void testSetup() {
       
        List <Trip__c> trps = FactoryClass.createTestDataTripB();
        insert trps; 
    }

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
