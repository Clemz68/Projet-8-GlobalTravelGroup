public with sharing class CrudTripSelector {
    
    public class TripWrapper {
      public Id id;
      public String status;
      public String destination;
      public Date startDate;
      public Date endDate;
      public Integer numberOfParticipants;
    }
  /*
    *********************************************************
    @description    : Méthode avec SOQL pour récupérer un trip.
    @param          : Id du trip
    @return         : Le trip
    *********************************************************
    */
    public static Trip__c crudTrpSelectorDelete (Id tripDelete) {

      Trip__c trp = [SELECT Id, Status__c FROM Trip__c WHERE Id = :tripDelete LIMIT 1 ];

      return trp;
    }
  /*
    *********************************************************
    @description    : Méthode pour créer un trip.
    @param          : objet js sous format JSON, Id du compte
    @return         : objet trip sans Id propre
    *********************************************************
    */
    public static Trip__c crudTrpSelectorCreate (String tripJSON, Id accountId) {
        try {
            TripWrapper tripWrapperRec =  (TripWrapper) JSON.deserialize(tripJSON,TripWrapper.class);
            
            if(tripWrapperRec != null){
                Trip__c tripRec   = new Trip__c();
                tripRec.Account__c= accountId;
                tripRec.Status__c = tripWrapperRec.status;
                tripRec.Destination__c = tripWrapperRec.destination;
                tripRec.Start_Date__c = tripWrapperRec.startDate;
                tripRec.End_Date__c = tripWrapperRec.endDate;
                tripRec.Number_of_Participants__c = tripWrapperRec.numberOfParticipants;

                return tripRec;
            }
            return null;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
  /*
    *********************************************************
    @description    : Méthode pour éditer un trip.
    @param          : objet js sous format JSON
    @return         : objet trip complet avec Id existant
    *********************************************************
    */
    public static Trip__c crudTrpSelectorEdit (String tripJSON) {

       try {
      TripWrapper tripWrapperRec =  (TripWrapper) JSON.deserialize(tripJSON,TripWrapper.class);
            if(tripWrapperRec != null){
                Trip__c tripRec   = new Trip__c();
                tripRec.Id = tripWrapperRec.id;
                tripRec.Status__c = tripWrapperRec.status;
                tripRec.Destination__c = tripWrapperRec.destination;
                tripRec.Start_Date__c = tripWrapperRec.startDate;
                tripRec.End_Date__c = tripWrapperRec.endDate;
                tripRec.Number_of_Participants__c = tripWrapperRec.numberOfParticipants;

                return tripRec;
            }
            return null;

        } catch (Exception e) {
          System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
    /*
    *********************************************************
    @description    : Méthode avec SOQL pour récupérer les trips liés au compte.
    @param          : Id du compte
    @return         : Liste de trips
    *********************************************************
    */
    public static List <Trip__c> crudTrpSelectorGet (Id accountId) {

      List <Trip__c> trips = [SELECT Id,Status__c, Name,Days_Remaining__c,Start_Date__c,End_Date__c,Number_of_Participants__c,Total_Cost__c,Opportunity__c, Opportunity__r.Name, Destination__c  FROM Trip__c WHERE Account__c = :accountId];

      return trips;
    }

}