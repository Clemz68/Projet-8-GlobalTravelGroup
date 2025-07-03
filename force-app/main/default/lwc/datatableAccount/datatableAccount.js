import { LightningElement, wire } from 'lwc';
import crudAccControllerDelete from '@salesforce/apex/CrudAccountController.crudAccControllerDelete';
import crudAccControllerGet from '@salesforce/apex/CrudAccountController.crudAccControllerGet';
import crudAccControllerCreate from '@salesforce/apex/CrudAccountController.crudAccControllerCreate';
import crudAccControllerEdit from '@salesforce/apex/CrudAccountController.crudAccControllerEdit';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import modal from 'c/modal';

// Définition des colonnes pour la lightning-datatable
const columns = [
    { label: 'Account Name', fieldName: 'Name', type: 'text', editable: true },
    { label: 'Currency', fieldName: 'CurrencyIsoCode', type: 'text', editable: true },
    { label: 'Industry', fieldName: 'Industry', type: 'text', editable: true },
    { label: 'Phone', fieldName: 'Phone', type: 'number', editable: true },
    { 
        label: 'See Account', 
        type: 'button', 
        initialWidth: 150,
        typeAttributes: { 
            iconName: 'utility:preview', 
            label: 'See Account', 
            variant: 'brand', 
            name: 'see_acc', 
            title: 'Click to see the Account' 
        },
        cellAttributes: { alignment: 'center' }
    },
    { 
        label: 'Delete', 
        type: 'button-icon', 
        typeAttributes: { iconName: 'utility:delete', name: 'delete', title: 'Click to delete the Account' }
    },
    { 
        label: 'Edit', 
        type: 'button-icon', 
        typeAttributes: { iconName: 'utility:edit', name: 'edit', title: 'Click to edit the Account' }
    },
];

export default class DatatableConctractAccount extends NavigationMixin(LightningElement) {

    accItem = [];
    data = [];
    columns = columns;
    draftValues = [];
    wiredAccs;

    /**
     * @description Récupère la liste des comptes via Apex et la stocke dans this.data et this.accItem.
     *              Gère les erreurs d’appel.
     */
    @wire(crudAccControllerGet)
    wiredCrudAccControllerGet(result) {
        this.wiredAccs = result;
        const { data, error } = result;
        if (data) {
            this.data = data;
            this.accItem = data.map(record => ({ ...record }));
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while fetching Account',
                    message: error.body?.message || JSON.stringify(error),
                    variant: 'error',
                })
            );
        }
    }

    /**
     * @description Gestion de la sauvegarde des modifications faites en inline edit sur la datatable.
     * @param {Event} event - L’événement de sauvegarde contenant les valeurs modifiées.
     */
    handleSave(event) {
        this.draftValues = event.detail.draftValues;

        const recordInputs = this.draftValues.slice().map(draft => {
            const fields = { ...draft };
            return { fields };
        });

        try {
            const updatePromises = recordInputs.map(recordInput => updateRecord(recordInput));
            Promise.all(updatePromises).then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Updated',
                        message: 'Records Updated Successfully',
                        variant: 'success',
                    })
                );
                this.draftValues = [];
                return refreshApex(this.wiredAccs);
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'An Error ' + error,
                        variant: 'error',
                    })
                );
            });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * @description Gère les actions des boutons dans la datatable (delete, see_acc, edit).
     * @param {Event} event - L’événement contenant les détails de l’action et la ligne concernée.
     */
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'delete':
                this.handleDelete(row);
                break;
            case 'see_acc':
                this.handleSeeAcc(row);
                break;
            case 'edit':
                this.handleEditApex(row);
                break;
        }
    }

    /**
     * @description Supprime un compte via Apex et rafraîchit la liste.
     * @param {Object} row - L’objet Account à supprimer.
     */
    async handleDelete(row) {
        try {
            const rowId = row.Id;
            await crudAccControllerDelete({ accDelete: rowId });

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Succès',
                    message: 'Ce compte a été supprimé avec succès.',
                    variant: 'success',
                })
            );

            await refreshApex(this.wiredAccs);

        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Erreur',
                    message: error.body?.message || 'La suppression a échoué.',
                    variant: 'error',
                })
            );
        }
    }

    /**
     * @description Navigue vers la page standard du compte sélectionné.
     * @param {Object} row - L’objet Account à afficher.
     */
    handleSeeAcc(row) {
        const rowId = row.Id;
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: rowId,
                actionName: "view",
            },
        });
    }

    /**
     * @description Ouvre un modal pour créer un compte via Apex et rafraîchit la liste après succès.
     * @param {Object} row - (optionnel) L’objet utilisé pour l’ouverture du modal.
     */
    async handleAddApex(row) {
        const result = await modal.open({
            size: 'small',
            description: 'Formulaire création Account',
            content: 'Passed into content api',
            modalCreateAccountApex: true
        });

        if (result) {
            crudAccControllerCreate({ accJSON: result })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Succès',
                            message: 'Compte créé avec succès.',
                            variant: 'success',
                        })
                    );
                    return refreshApex(this.wiredAccs);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Erreur',
                            message: error.body?.message || JSON.stringify(error),
                            variant: 'error',
                        })
                    );
                });
        }
    }

    /**
     * @description Ouvre un modal pour éditer un compte via Apex et rafraîchit la liste après succès.
     * @param {Object} row - L’objet Account à éditer.
     */
    async handleEditApex(row) {

        try {
            const result = await modal.open({
                size: 'small',
                description: 'Formulaire udpate Account',
                content: 'Passed into content api',
                objectToUdpate: { row },
                modalUpdateAccount: true
            });

            if (result) {
                crudAccControllerEdit({ accJSON: result })
                    .then(() => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Succès',
                                message: 'Compte édité avec succès.',
                                variant: 'success',
                            })
                        );
                        return refreshApex(this.wiredAccs);
                    })
                    .catch(error => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Erreur',
                                message: error.body?.message || JSON.stringify(error),
                                variant: 'error',
                            })
                        );
                    });
            }
        } catch (error) {
            console.error('Erreur brute :', error);
            if (error instanceof Error) {
                console.error('Message explicite :', error.message);
            } else if (typeof error === 'object') {
                console.error('Erreur JSON :', JSON.stringify(error, null, 2));
            } else {
                console.error('Erreur inconnue (format non object) :', error);
            }
        }
    }
}