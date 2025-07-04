@isTest
private class TestCreateTripTrigger {

    /*
    *********************************************************
    @description    : Méthode de test pour tester la bonne création du Trip
    *********************************************************
    */
    @isTest
    static void myUnitTest() {
       
        Test.startTest();

        Opportunity opp = new Opportunity(

            Name = 'Test Opportunity',
            StageName = 'Prospecting',
            CloseDate = System.today().addDays(30),
            Number_of_Participants__c = 14,
            Destination__c = 'Somewhere',
            Start_Date__c = Date.newInstance(2025, 5, 25),
            End_Date__c = Date.newInstance(2025, 5, 27),
            Amount = 12000
        );
        insert opp;

        opp.stageName = 'Closed Won';
        update opp;

        Test.stopTest();
        
        Trip__c trp = [SELECT Id, Status__c, Opportunity__c, Destination__c,Start_Date__c, End_Date__c,Number_of_Participants__c,Total_Cost__c FROM Trip__c];

        System.Assert (trp.Opportunity__c == opp.Id);
        System.Assert (trp.Status__c == 'A venir');
        System.Assert (trp.Destination__c == opp.Destination__c);
        System.Assert (trp.Start_Date__c == opp.Start_Date__c);
        System.Assert (trp.End_Date__c == opp.End_Date__c);
        System.Assert (trp.Number_of_Participants__c == opp.Number_of_Participants__c);
        System.Assert (trp.Total_Cost__c == opp.Amount);

    }
}