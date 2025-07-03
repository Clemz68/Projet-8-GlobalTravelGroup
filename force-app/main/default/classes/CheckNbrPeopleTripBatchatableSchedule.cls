public class CheckNbrPeopleTripBatchatableSchedule implements Database.Batchable<sObject>,Database.Stateful, Schedulable {
    public Integer recordsProcessed = 0;

    /**
     * Méthode start - Point d'entrée du batch
     * Prépare la requête SOQL pour récupérer tous les enregistrements Trip__c
     * @param bc Contexte du batch (non utilisé ici)
     * @return QueryLocator pour paginer les résultats
     */
    public Database.QueryLocator start(Database.BatchableContext bc) {
        Date dateSevenDaysLater = Date.today().addDays(7);
        String query = 'SELECT Id, Start_Date__c, End_Date__c, Number_of_Participants__c, Status__c FROM Trip__c WHERE Start_Date__c <= :dateSevenDaysLater';
        return Database.getQueryLocator(query);
    }

     /**
     * Méthode execute - Traite chaque lot d'enregistrements
     * Met à jour le statut des trips selon le nombre de participants
     * @param bc Contexte du batch (non utilisé ici)
     * @param trips Liste des Trip__c traités dans ce lot
     */
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
    /**
     * Méthode finish - S'exécute après le traitement de tous les lots
     * Utilisée pour envoyer une notification ou enregistrer un log
     * @param bc Contexte du batch (non utilisé ici)
     */
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
    /**
     * Méthode execute du Scheduler - Lance l'exécution du batch via un scheduler
     * @param sc Contexte du scheduler
     */
    public void execute(SchedulableContext sc) {

    CheckNbrPeopleTripBatchatableSchedule batch = new CheckNbrPeopleTripBatchatableSchedule();
    Database.executeBatch(batch, 200);
    }
}
    
