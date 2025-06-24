public with sharing class CheckDateTripBatchatableSchedule implements Database.Batchable<sObject>,Database.Stateful, Schedulable {
    // Variable d'instance pour récupérer l'état du batch
    public Integer recordsProcessed = 0;
    
    public Database.QueryLocator start(Database.BatchableContext bc) {
        
        String query = 'SELECT Id, Start_Date__c, End_Date__c, Number_of_Participants__c, Status__c FROM Trip__c';
        return Database.getQueryLocator(query);
    }

    public void execute(Database.BatchableContext bc, list<Trip__c> trips){
        
        List<Trip__c> toUpdateComing = new List<Trip__c>();
        List<Trip__c> toUpdateOngoing = new List<Trip__c>();
        List<Trip__c> toUpdateEnded = new List<Trip__c>();

        Date today = Date.today();

        for(Trip__c trp : trips)
        
             if (today < trp.Start_Date__c && trp.Status__c != 'À venir') {
                trp.Status__c = 'À venir';
                toUpdateComing.add(trp);
            } else if (today >= trp.Start_Date__c && today <= trp.End_Date__c && trp.Status__c != 'En cours') {
                trp.Status__c = 'En cours';
                toUpdateOngoing.add(trp);
            } else if (today > trp.End_Date__c && trp.Status__c != 'Terminé') {
                trp.Status__c = 'Terminé';
                toUpdateEnded.add(trp);
            }
    
        List<Trip__c> updateTrips = new List<Trip__c>();
        updateTrips.addAll(toUpdateComing);
        updateTrips.addAll(toUpdateOngoing);
        updateTrips.addAll(toUpdateEnded);

        if (!updateTrips.isEmpty()) {
            update updateTrips;
        }
    }
        
    public void finish(Database.BatchableContext bc){
            
    }
    
    public void execute(SchedulableContext sc) {

    CheckDateTripBatchatableSchedule batch = new CheckDateTripBatchatableSchedule();
    Database.executeBatch(batch, 200);
    }
}
