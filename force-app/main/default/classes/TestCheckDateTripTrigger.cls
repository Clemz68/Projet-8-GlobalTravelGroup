@isTest
private class TestCheckDateTripTrigger {

    /*
    *********************************************************
    @description    : Méthode de test pour tester le trigger qui bloque la création du trip si les dates sont incohérentes
    *********************************************************
    */

    @isTest
    static void myUnitTest() {
        
    Trip__c invalidTrip = new Trip__c(
            Start_Date__c = Date.today().addDays(5),
            End_Date__c = Date.today()
        );

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
