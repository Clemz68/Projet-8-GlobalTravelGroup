public with sharing class CrudOppSelector {

    public class OppWrapper {
      public Id Id;
      public String name;
      public String stage;
      public Date closeDate;
      public Double amount;
      public String destination;
      public Date startDate;
      public Date endDate;
      public Integer numberOfParticipants;
    }
  /*
    *********************************************************
    @description    : Méthode avec SOQL pour récupérer une Opp.
    @param          : Id de l'Opp
    @return         : L'Opp'
    *********************************************************
    */
    public static Opportunity crudOppSelectorDelete (Id oppDelete) {

      Opportunity opp = [SELECT Id FROM Opportunity WHERE Id = :oppDelete LIMIT 1 ];

      return opp;
    }
  /*
    *********************************************************
    @description    : Méthode pour créer une Opp.
    @param          : objet js sous format JSON, Id du compte
    @return         : objet Opp sans Id propre
    *********************************************************
    */
    public static Opportunity crudOppSelectorCreate (String oppJSON, Id accountId) {
        try {
            OppWrapper oppWrapperRec =  (OppWrapper) JSON.deserialize(oppJSON,OppWrapper.class);
            
            if(oppWrapperRec != null){
              Opportunity oppRec  = new Opportunity();
                oppRec.Name = oppWrapperRec.name;
                oppRec.AccountId = accountId;
                oppRec.StageName = oppWrapperRec.stage;
                oppRec.CloseDate = oppWrapperRec.closeDate;
                oppRec.Amount = oppWrapperRec.amount;
                oppRec.Destination__c = oppWrapperRec.destination;
                oppRec.Start_Date__c = oppWrapperRec.startDate;
                oppRec.End_Date__c = oppWrapperRec.endDate;
                oppRec.Number_of_Participants__c = oppWrapperRec.numberOfParticipants;

                return oppRec;
            }
            return null;

        } catch (Exception e) {
          System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
  /*
    *********************************************************
    @description    : Méthode pour éditer un Opp.
    @param          : objet js sous format JSON
    @return         : objet Opp complet avec Id existant
    *********************************************************
    */
    public static Opportunity crudOppSelectorEdit (String oppJSON) {

       try {
      OppWrapper oppWrapperRec =  (OppWrapper) JSON.deserialize(oppJSON,OppWrapper.class);
            if(oppWrapperRec != null){
              System.debug('OppWrapperRec.Id = ' + oppWrapperRec.Id);
              Opportunity oppRec = new Opportunity();
                oppRec.Id = oppWrapperRec.Id;
                oppRec.StageName = oppWrapperRec.stage;
                oppRec.CloseDate = oppWrapperRec.closeDate;
                oppRec.Amount = oppWrapperRec.amount;
                oppRec.Destination__c = oppWrapperRec.destination;
                oppRec.Start_Date__c = oppWrapperRec.startDate;
                oppRec.End_Date__c = oppWrapperRec.endDate;
                oppRec.Number_of_Participants__c = oppWrapperRec.numberOfParticipants;
          
                return oppRec;
            }
            return null;

        } catch (Exception e) {
          System.debug('Erreur CRUD: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

     /*
    *********************************************************
    @description    : Méthode avec SOQL pour récupérer les Opps liés au compte.
    @param          : Id du compte
    @return         : Liste d'Opps
    *********************************************************
    */

  public static List <Opportunity> crudOppSelectorGet (Id accountId) {

      List <Opportunity> opps = [SELECT Id, Name, Number_of_Participants__c, Destination__c, Start_Date__c, End_Date__c, AccountId, StageName, CloseDate, Amount FROM Opportunity WHERE AccountId = :accountId];

      return opps;
    }
}