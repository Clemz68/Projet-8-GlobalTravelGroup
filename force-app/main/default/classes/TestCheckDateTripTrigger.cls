
@isTest
private class TestCheckDateTripTrigger {

    @isTest
    static void myUnitTest() {
        
    Trip__c invalidTrip = new Trip__c(
            Start_Date__c = Date.today().addDays(5),
            End_Date__c = Date.today()
        );

        // Bloc try/catch pour intercepter l’erreur
        Test.startTest();
        try {
            insert invalidTrip;
            System.assert(false, 'Linsertion aurait dû échouer à cause du trigger CheckDateTripTrigger.');
        } catch (DmlException e) {
            System.assert(e.getMessage().contains('end date should be set after start date'),
                         'Le message d\'erreur attendu n\'a pas été trouvé.');
        }
        Test.stopTest();
    }
}
