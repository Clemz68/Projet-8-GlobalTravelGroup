import { LightningElement, api, wire} from 'lwc';
import crudOppControllerDelete from '@salesforce/apex/CrudOppController.crudOppControllerDelete';
import crudOppControllerGet from '@salesforce/apex/CrudOppController.crudOppControllerGet';
import crudOppControllerCreate from '@salesforce/apex/CrudOppController.crudOppControllerCreate';
import crudOppControllerEdit from '@salesforce/apex/CrudOppController.crudOppControllerEdit';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import modal from 'c/modal';

// Définition des colonnes pour la lightning-datatable
const columns = [
    { label: 'Name', fieldName: 'Name', type:'text', editable: false},
    { label: 'Stage', fieldName: 'StageName', type: 'text', editable: true},
    { label: 'Close Date', fieldName: 'CloseDate', type: 'date', editable: true},
    { label: 'Amount', fieldName: 'Amount', type: 'currency', editable: true},
    { label: 'Destination', fieldName: 'Destination__c', type: 'text', editable: true},
    { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date', editable: true},
    { label: 'End Date', fieldName: 'End_Date__c', type: 'date', editable: true},
    { 
        label: 'Participants', 
        fieldName: 'Number_of_Participants__c', 
        type: 'number', 
        editable: true,
        cellAttributes: { alignment:'left', class: {fieldName: 'participantClass'} }
    },
    { 
        label: 'See Opp', 
        type: 'button', 
        initialWidth: 125,
        typeAttributes: { 
            iconName: 'utility:preview', 
            label: 'See Opp', 
            variant:'brand', 
            name: 'see_opp', 
            title: 'Click to see the Opp', 
        },
        cellAttributes: { alignment: 'center' }
    },
    { 
        label: 'Delete', 
        type: 'button-icon', 
        typeAttributes: { 
            iconName: 'utility:delete', 
            name: 'delete', 
            title: 'Click to delete the Opp'
        }
    },
    { 
        label: 'Edit', 
        type: 'button-icon', 
        typeAttributes: { 
            iconName: 'utility:edit', 
            name: 'edit', 
            title: 'Click to edit the Opp'
        }
    },
]

export default class DatatableOppAccount extends NavigationMixin(LightningElement) {

    @api recordId;
    oppItem = [];
    data = [];
    columns = columns;
    draftValues = [];
    isLoading = true;
    nodata = false;
    wiredOpps;
    datatableVisible = false;

    /**
     * @description Récupère la liste des Opp via Apex et la stocke dans this.data et this.oppItem.
     *              Gère les erreurs d’appel.
     */
    @wire(crudOppControllerGet, {accountId : '$recordId'})
    wiredCrudOppControllerGet(result) {
        this.wiredOpps = result;
            const { data, error } = result;
        if (data != undefined && data !== null) {
            if (data.length > 0) {
            this.datatableVisible = true;
            this.data = data; 
            this.oppItem = data.map((record) => {
                return {...record};
            });
            }else{
                this.nodata = true;
            }
        }
        
        if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while fetching Opp',
                    message: error.body?.message || JSON.stringify(error),
                    variant: 'error'
                })
            );
        }
        this.isLoading = false;
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

                return refreshApex(this.wiredOpps);
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
            case 'see_opp':
                this.handleSeeOpp(row);
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
       
          const result = await modal.open({
            size: 'small',
            description: 'Confirmation suppression',
            content: 'Passed into content api',
            modalConfirmSuppr: true
        });

        if (result) {
       
            try {
                const rowId = row.Id;
                await crudOppControllerDelete({ oppDelete: rowId });

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Succès',
                        message: 'Cette opportunité a été supprimé avec succès.',
                        variant: 'success'
                    })
                );
                await refreshApex(this.wiredOpps); 

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
    }   

    /**
     * @description Navigue vers la page standard de l'objet sélectionné.
     * @param {Object} row - L’objet à afficher.
     */
    handleSeeOpp(row) {
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
     * @description Ouvre un modal pour créer un objet via Apex et rafraîchit la liste après succès.
     * @param {Object} row - (optionnel) L’objet utilisé pour l’ouverture du modal.
     */
    async handleAddApex(row) {
        const result = await modal.open({
            size: 'small',
            description: 'Formulaire création opp',
            content: 'Passed into content api',
            modalCreateOppApex: true
        });

        if (result) {
            crudOppControllerCreate({ oppJSON: result, accountId: this.recordId })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Succès',
                            message: 'Opportunité créée avec succès.',
                            variant: 'success'
                        })
                    );
                    return refreshApex(this.wiredOpps);
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
            description: 'Formulaire udpate opp',
            content: 'Passed into content api',
            objectToUdpate: { row },
            modalUpdateOpp: true
        });

        if (result) {
            crudOppControllerEdit({ oppJSON: result })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Succès',
                            message: 'Opportunité éditée avec succès.',
                            variant: 'success'
                        })
                    );
                    return refreshApex(this.wiredOpps);
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