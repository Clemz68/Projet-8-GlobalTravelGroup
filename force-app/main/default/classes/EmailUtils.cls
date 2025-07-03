public class EmailUtils {
       /**
     * @description Envoie un email de notification à l'utilisateur ayant lancé le batch
     * pour l'informer du nombre d'enregistrements traités (voyages annulés)
     * @param job Instance de AsyncApexJob représentant le batch Apex terminé
     * @param recordsProcessed Nombre d'enregistrements traités dans le batch
     */
    public static void sendMessage(AsyncApexJob job, Integer recordsProcessed) {
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { job.CreatedBy.Email });
        mail.setSubject('Batch terminé : Trip annulés');
        mail.setPlainTextBody('Nombre de voyages annulés : ' + recordsProcessed);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }
}