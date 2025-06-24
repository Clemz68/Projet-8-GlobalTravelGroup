trigger CheckDateTripTrigger on Trip__c (before insert) {

    for (Trip__c trp : trigger.new) {

        if (trp.Start_Date__c >= trp.End_Date__c) {

         trp.addError('The creation of the Trip related to the opp is cancelled, end date should be set after start date');
        }

    }
} 
