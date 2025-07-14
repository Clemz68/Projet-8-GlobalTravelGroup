public with sharing class CheckDateTripBatchatableSchedule implements Database.Batchable<sObject>, Database.Stateful, Schedulable {
    public Integer recordsProcessed = 0;
    
    /**
     * Méthode start - Point d'entrée du batch
     * Prépare la requête SOQL pour récupérer tous les enregistrements Trip__c
     * @param bc Contexte du batch (non utilisé ici)
     * @return QueryLocator pour paginer les résultats
     */
    public Database.QueryLocator start(Database.BatchableContext bc) {
        String query = 'SELECT Id, Start_Date__c, End_Date__c, Number_of_Participants__c, Status__c FROM Trip__c';
        return Database.getQueryLocator(query);
    }

    /**
     * Méthode execute - Traite chaque lot d'enregistrements
     * Met à jour le statut des trips selon la date du jour et les dates de début/fin
     * @param bc Contexte du batch (non utilisé ici)
     * @param trips Liste des Trip__c traités dans ce lot
     */
    public void execute(Database.BatchableContext bc, List<Trip__c> trips) {
        
        List<Trip__c> toUpdateComing = new List<Trip__c>();
        List<Trip__c> toUpdateOngoing = new List<Trip__c>();
        List<Trip__c> toUpdateEnded = new List<Trip__c>();

        Date today = Date.today();

        
        for (Trip__c trp : trips) {
            if (today < trp.Start_Date__c && trp.Status__c != 'A venir') {
               
                trp.Status__c = 'A venir';
                toUpdateComing.add(trp);
            } else if (today >= trp.Start_Date__c && today <= trp.End_Date__c && trp.Status__c != 'En cours') {
              
                trp.Status__c = 'En cours';
                toUpdateOngoing.add(trp);
            } else if (today > trp.End_Date__c && trp.Status__c != 'Terminé') {
               
                trp.Status__c = 'Terminé';
                toUpdateEnded.add(trp);
            }
        }

        List<Trip__c> updateTrips = new List<Trip__c>();
        updateTrips.addAll(toUpdateComing);
        updateTrips.addAll(toUpdateOngoing);
        updateTrips.addAll(toUpdateEnded);

        if (!updateTrips.isEmpty()) {
            update updateTrips;
        }
    }

    /**
     * Méthode finish - S'exécute après le traitement de tous les lots
     * Peut être utilisée pour envoyer une notification ou enregistrer un log
     * @param bc Contexte du batch (non utilisé ici)
     */
    public void finish(Database.BatchableContext bc) {
    }

    /**
     * Méthode execute du Scheduler - Lance l'exécution du batch via un scheduler
     * @param sc Contexte du scheduler
     */
    public void execute(SchedulableContext sc) {
        // Instancie la classe batch et exécute le batch avec une taille de lot de 200
        CheckDateTripBatchatableSchedule batch = new CheckDateTripBatchatableSchedule();
        Database.executeBatch(batch, 200);
    }
}