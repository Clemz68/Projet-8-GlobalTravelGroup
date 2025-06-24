trigger CreateTripTrigger on Opportunity (after update) {

List <Trip__c> tripsToCreate = new List <Trip__c> (); 

List <Opportunity> oppToGet = [SELECT Destination__c, Start_Date__c , End_Date__c , Number_of_Participants__c, StageName, Amount,AccountId, Id FROM Opportunity WHERE Id IN: trigger.new];

for (Opportunity opp: oppToGet) {

    if (opp.StageName == 'Closed Won' && Trigger.oldMap.get(opp.Id).StageName != 'Closed Won') {

    Trip__c tripToCreate = new Trip__c (
    Status__c = 'A venir',
    Destination__c = opp.Destination__c,
    Start_Date__c = opp.Start_Date__c,
    End_Date__c = opp.End_Date__c,
    Number_of_Participants__c = opp.Number_of_Participants__c,
    Total_Cost__c = opp.Amount,
    Account__c = opp.AccountId,
    Opportunity__c = opp.Id
    );
    
    tripsToCreate.add (tripToCreate);
   
    }
}

insert tripsToCreate;

}