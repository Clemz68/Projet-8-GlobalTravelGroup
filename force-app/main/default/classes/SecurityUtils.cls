public class SecurityUtil {

    /**
     * @description   Vérifie si l'utilisateur a le droit de lire l'objet spécifié.
     * @param         sObjType - Le type d'objet Salesforce à vérifier (ex : Schema.SObjectType.Account)
     * @throws        AuraHandledException si la lecture n'est pas autorisée
     */
    public static void checkReadAccess(Schema.SObjectType sObjType) {
        if (!sObjType.isAccessible()) {
            throw new AuraHandledException('Accès refusé : lecture non autorisée sur l\'objet.');
        }
    }

    /**
     * @description   Vérifie si l'utilisateur a le droit de modifier l'objet spécifié.
     * @param         sObjType
     * @throws        AuraHandledException si la modification n'est pas autorisée
     */
    public static void checkUpdateAccess(Schema.SObjectType sObjType) {
        if (!sObjType.isUpdateable()) {
            throw new AuraHandledException('Accès refusé : modification non autorisée sur l\'objet.');
        }
    }

    /**
     * @description   Vérifie si l'utilisateur a le droit de créer un enregistrement de cet objet.
     * @param         sObjType
     * @throws        AuraHandledException si la création n'est pas autorisée
     */
    public static void checkCreateAccess(Schema.SObjectType sObjType) {
        if (!sObjType.isCreateable()) {
            throw new AuraHandledException('Accès refusé : création non autorisée sur l\'objet.');
        }
    }

    /**
     * @description   Vérifie si l'utilisateur a le droit de supprimer un enregistrement de cet objet.
     * @param         sObjType
     * @throws        AuraHandledException si la suppression n'est pas autorisée
     */
    public static void checkDeleteAccess(Schema.SObjectType sObjType) {
        if (!sObjType.isDeletable()) {
            throw new AuraHandledException('Accès refusé : suppression non autorisée sur l\'objet.');
        }
    }

    /**
     * @description   Vérifie si l'utilisateur a le droit de lire un champ spécifique.
     * @param         field - Le champ Salesforce à vérifier (ex : Account.Name)
     * @throws        AuraHandledException si la lecture du champ n'est pas autorisée
     */
    public static void checkFieldRead(Schema.SObjectField field) {
        if (!field.getDescribe().isAccessible()) {
            throw new AuraHandledException('Accès refusé : lecture non autorisée sur le champ ' + field.getDescribe().getName());
        }
    }

    /**
     * @description   Vérifie si l'utilisateur a le droit de modifier un champ spécifique.
     * @param         field
     * @throws        AuraHandledException si la modification du champ n'est pas autorisée
     */
    public static void checkFieldWrite(Schema.SObjectField field) {
        if (!field.getDescribe().isUpdateable()) {
            throw new AuraHandledException('Accès refusé : modification non autorisée sur le champ ' + field.getDescribe().getName());
        }
    }
}