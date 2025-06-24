public class EmailUtils {
    public static void sendMessage(AsyncApexJob job, Integer recordsProcessed) {
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { job.CreatedBy.Email });
        mail.setSubject('Batch terminé : Trip annulés');
        mail.setPlainTextBody('Nombre de voyages annulés : ' + recordsProcessed);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }
}