import { LightningElement, api, wire } from 'lwc';
import crudTrpControllerGet from '@salesforce/apex/CrudTripController.crudTrpControllerGet';
import crudTrpControllerDelete from '@salesforce/apex/CrudTripController.crudTrpControllerDelete';
import crudOppControllerGet from '@salesforce/apex/CrudOppController.crudOppControllerGet';
import crudTrpControllerCreate from '@salesforce/apex/CrudTripController.crudTrpControllerCreate';
import crudTrpControllerEdit from '@salesforce/apex/CrudTripController.crudTrpControllerEdit';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import modal from 'c/modal';

// Définition des colonnes pour la lightning-datatable
const columns = [
    { label: 'Name', fieldName: 'Name', type:'text', editable: false },
    { label: 'Opportunity', fieldName: 'OpportunityName', type: 'text', editable: false },
    { 
        label: 'Status', fieldName: 'Status__c', type: 'picklist', editable: true, 
        cellAttributes: { alignment:'left', class: {fieldName: 'statusClass'} }
    },
    { label: 'Destination', fieldName: 'Destination__c', type: 'text', editable: true },
    { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date', editable: true },
    { label: 'End Date', fieldName: 'End_Date__c', type: 'date', editable: true },
    { 
        label: 'Participants', fieldName: 'Number_of_Participants__c', type: 'number', editable: true,
        cellAttributes: { alignment:'left', class: {fieldName: 'participantClass'} }
    },
    { 
        label: 'See Trip', type: 'button', initialWidth: 125,
        typeAttributes: { iconName: 'utility:preview', label: 'See Trip', variant:'brand', name: 'see_trip', title: 'Click to see the trip' },
        cellAttributes: { alignment: 'center' }
    },
    { 
        label: 'Delete', type: 'button-icon', 
        typeAttributes: { iconName: 'utility:delete', name: 'delete', title: 'Click to delete the trip' }
    },
    { 
        label: 'Edit', type: 'button-icon', 
        typeAttributes: { iconName: 'utility:edit', name: 'edit', title: 'Click to edit the trip' }
    },
];

export default class DatatableTripAccount extends NavigationMixin(LightningElement) {

    @api recordId;
    tripItem = [];
    data = [];
    columns = columns;
    draftValues = [];
    wiredTrips; 
    opportunityOptions = [];

    /**
     * @description Récupère la liste des Trip via Apex et la stocke dans this.data et this.tripItem.
     *              Gère les erreurs d’appel.
     */
    @wire(crudTrpControllerGet, { accountId : '$recordId' })
    wiredCrudTrpControllerGet(result) {
        this.wiredTrips = result;
        const { data, error } = result;
        if (data) {
            this.data = data; 
            this.tripItem = data.map((record) => {
                let statusClass = this.styleCssStatus(record); 
                let participantClass = this.styleCssParticipant(record); 
                return { 
                    ...record, 
                    statusClass: statusClass,
                    participantClass: participantClass,
                    OpportunityName: record.Opportunity__r?.Name ?? '',
                };
            });
        } 
        else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while fetching Trips',
                    message: error.body?.message || JSON.stringify(error),
                    variant: 'error'
                })
            );
        }
    }

    /**
     * @description Récupère la liste des Opp via Apex, stocke dans this.opportunityOptions et gère les erreurs d’appel.
     */
    @wire(crudOppControllerGet, { accountId : '$recordId' })
    wiredCrudOppControllerGet(result) {
        const { data, error } = result;
        if (data) { 
            this.opportunityOptions = data.map(opp => {
                return { label: opp.label, value: opp.value };
            });
        }
        else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while fetching Opp',
                    message: error.body?.message || JSON.stringify(error),
                    variant: 'error'
                })
            );
        }
    }

    /**
     * @description Prend l'objet du tableau et retourne une classe CSS pour mettre en forme le statut.
     * @param {Object} record - L'objet correspondant à la ligne du tableau.
     */
    styleCssStatus(record) {
        if (record.Status__c == 'En cours') {
            return 'slds-text-color_success slds-theme_success slds-text-bold';
        }
        else {
            if (record.Number_of_Participants__c < 10 && record.Status__c == 'A venir') {
                return 'slds-theme_warning slds-theme_alert-texture slds-text-bold';
            }
            else if (record.Status__c == 'A venir') {
                return 'slds-theme_info slds-text-bold';
            }
        }
    }

    styleCssParticipant(record) {
        if (record.Status__c == 'A venir') {
            if (record.Number_of_Participants__c < 10) {
                return 'slds-theme_warning slds-theme_alert-texture slds-text-bold';
            }
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
                        variant: 'success'
                    })
                );
                this.draftValues = [];

                return refreshApex(this.wiredTrips);
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'An Error ' + error,
                        variant: 'error'
                    })
                );
            });
        } catch(error) {
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
            case 'see_trip':
                this.handleSeeTrip(row);
                break;
            case 'edit':
                this.handleEditApex(row);
                break;
        }
    }

    /**
     * @description Supprime un objet via Apex et rafraîchit la liste.
     * @param {Object} row - L’objet à supprimer.
     */
    async handleDelete(row) {
        try {
            const rowId = row.Id;
            await crudTrpControllerDelete({ tripDelete: rowId });

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Succès',
                    message: 'Le voyage a été supprimé avec succès.',
                    variant: 'success'
                })
            );
            await refreshApex(this.wiredTrips); 

        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Erreur',
                    message: error.body?.message || 'La suppression a échoué.',
                    variant: 'error'
                })
            );
            console.error(error);
        }
    }

    /**
     * @description Navigue vers la page standard de l'objet sélectionné.
     * @param {Object} row - L’objet à afficher.
     */
    handleSeeTrip(row) {
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
     * @description Ouvre un modal pour créer un objet et rafraîchit la liste après succès.
     * @param {Object} row - (optionnel) L’objet utilisé pour l’ouverture du modal.
     */
    async handleAdd(row) {
        const result = await modal.open({
            size: 'small',
            description: 'Accessible description of modal\'s purpose',
            content: 'Passed into content api',
            modalCreateTrip: true
        });
        if (result == 'success') {
            await refreshApex(this.wiredTrips);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Succès',
                    message: 'Le voyage a été créé avec succès.',
                    variant: 'success'
                })
            );
        }
    }

    /**
     * @description Ouvre un modal pour créer un objet via Apex et rafraîchit la liste après succès.
     * @param {Object} row - (optionnel) L’objet utilisé pour l’ouverture du modal.
     */
    async handleAddApex(row) {
        const result = await modal.open({
            size: 'small',
            description: 'Formulaire création trip',
            content: 'Passed into content api',
            modalCreateTripApex: true
        });

        if (result) {
            crudTrpControllerCreate({ tripJSON: result, accountId: this.recordId })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Succès',
                            message: 'Le voyage a été créé avec succès.',
                            variant: 'success'
                        })
                    );
                    return refreshApex(this.wiredTrips);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Erreur',
                            message: error.body?.message || JSON.stringify(error),
                            variant: 'error'
                        })
                    );
                });
        }        
    }

    /**
     * @description Ouvre un modal pour éditer un objet via Apex et rafraîchit la liste après succès.
     * @param {Object} row - L’objet à éditer.
     */      
    async handleEditApex(row) {

        const result = await modal.open({
            size: 'small',
            label: 'my little modal',
            description: 'Formulaire udpate trip',
            content: 'Passed into content api',
            objectToEdit: row,
            modalEditTripApex: true
        });

        if (result) {
            crudTrpControllerEdit({ tripJSON: result })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Succès',
                            message: 'Le voyage a été mis à jour avec succès.',
                            variant: 'success'
                        })
                    );
                    return refreshApex(this.wiredTrips);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Erreur',
                            message: error.body?.message || JSON.stringify(error),
                            variant: 'error'
                        })
                    );
                });
        }
    }
}