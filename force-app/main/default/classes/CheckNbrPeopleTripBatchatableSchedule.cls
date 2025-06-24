/**
 * Classe batch et schedulable qui annule les voyages ayant moins de 10 participants dans les 7 prochains jours.
 * @author Clément
 * @date 2025-05-13
 */

public class CheckNbrPeopleTripBatchatableSchedule implements Database.Batchable<sObject>,Database.Stateful, Schedulable {
   
    // Variable d'instance pour récupérer l'état du batch
    public Integer recordsProcessed = 0;
    
    public Database.QueryLocator start(Database.BatchableContext bc) {
        Date dateSevenDaysLater = Date.today().addDays(7);
        String query = 'SELECT Id, Start_Date__c, End_Date__c, Number_of_Participants__c, Status__c FROM Trip__c WHERE Start_Date__c <= :dateSevenDaysLater';
        return Database.getQueryLocator(query);
    }
    public void execute(Database.BatchableContext bc, list<Trip__c> trips){
        
        List <Trip__c> tripsToUpdate = new List<Trip__c>();
        for(Trip__c trp : trips)
        
            if (trp.Number_of_Participants__c != null && trp.Number_of_Participants__c <  10){
           
                trp.Status__c = 'Annulé';
                tripsToUpdate.add(trp);
                recordsProcessed = recordsProcessed + 1;
            }
            
            if (!tripsToUpdate.isEmpty()) {
            update tripsToUpdate;
            }
        }
        
    public void finish(Database.BatchableContext bc){
             System.debug(recordsProcessed + ' records processed. Shazam!');
        AsyncApexJob job = [SELECT Id, Status, NumberOfErrors,
            JobItemsProcessed,
            TotalJobItems, CreatedBy.Email
            FROM AsyncApexJob
            WHERE Id = :bc.getJobId()];
        // call some utility to send email
        EmailUtils.sendMessage(job, recordsProcessed);
    }
    
    public void execute(SchedulableContext sc) {

    CheckNbrPeopleTripBatchatableSchedule batch = new CheckNbrPeopleTripBatchatableSchedule();
    Database.executeBatch(batch, 200);
    }
}
    
