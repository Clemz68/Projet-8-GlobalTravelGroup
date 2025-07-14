import { LightningElement, api, wire } from 'lwc';
import crudContControllerDelete from '@salesforce/apex/CrudContractController.crudContControllerDelete';
import crudContControllerGet from '@salesforce/apex/CrudContractController.crudContControllerGet';
import crudContControllerCreate from '@salesforce/apex/CrudContractController.crudContControllerCreate';
import crudContControllerEdit from '@salesforce/apex/CrudContractController.crudContControllerEdit';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import modal from 'c/modal';

// Définition des colonnes pour la lightning-datatable
const columns = [
    { label: 'Contract Number', fieldName: 'ContractNumber', type: 'number', editable: false },
    { label: 'Currency', fieldName: 'CurrencyIsoCode', type: 'text', editable: true },
    { label: 'Status', fieldName: 'Status', type: 'text', editable: true },
    { label: 'Start Date', fieldName: 'StartDate', type: 'date', editable: true },
    { label: 'Contract Term', fieldName: 'ContractTerm', type: 'number', editable: true },
    {
        label: 'See Contract', type: 'button', initialWidth: 150,
        typeAttributes: {
            iconName: 'utility:preview',
            label: 'See Contract',
            variant: 'brand',
            name: 'see_cont',
            title: 'Click to see the Contract',
        },
        cellAttributes: { alignment: 'center', }
    },
    { label: 'Delete', type: 'button-icon', typeAttributes: { iconName: 'utility:delete', name: 'delete', title: 'Click to delete the Contract' } },
    { label: 'Edit', type: 'button-icon', typeAttributes: { iconName: 'utility:edit', name: 'edit', title: 'Click to edit the Contract' } },
]

export default class DatatableConctractAccount extends NavigationMixin(LightningElement) {

    @api recordId;
    contItem = [];
    data = [];
    columns = columns;
    draftValues = [];
    isLoading = true;
    nodata = false;
    datatableVisible = false;
    wiredConts;

    /**
     * @description Récupère la liste des contrats via Apex et la stocke dans this.data et this.contItem.
     *              Gère les erreurs d’appel.
     */
    @wire(crudContControllerGet, { accountId: '$recordId' })
    wiredCrudContControllerGet(result) {
        this.wiredConts = result;
            const { data, error } = result;
        if (data != undefined && data !== null) {
            if (data.length > 0) {
            this.datatableVisible = true;
            this.data = data;
            this.contItem = data.map((record) => {
                return { ...record, }
            })
            }else{
                this.nodata = true; 
            }
        }
        if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while fetching Contract',
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

                return refreshApex(this.wiredConts);
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'An Error ' + error,
                        variant: 'error'
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
            case 'see_cont':
                this.handleSeeCont(row);
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
                await crudContControllerDelete({ contDelete: rowId });

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Succès',
                        message: 'Ce contrat a été supprimé avec succès.',
                        variant: 'success'
                    })
                );
                await refreshApex(this.wiredConts);

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
    handleSeeCont(row) {

        const rowId = row.Id

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
            description: 'Formulaire création Contract',
            content: 'Passed into content api',
            modalCreateContractApex: true
        }
        );

        if (result) {
            crudContControllerCreate({ contJSON: result, accountId: this.recordId })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Succès',
                            message: 'Contrat créée avec succès.',
                            variant: 'success'
                        })
                    );
                    return refreshApex(this.wiredConts);
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
            description: 'Formulaire udpate contract',
            content: 'Passed into content api',
            objectToUdpate: { row },
            modalUpdateContract: true
        });

        if (result) {
            crudContControllerEdit({ contJSON: result })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Succès',
                            message: 'Contrat éditée avec succès.',
                            variant: 'success'
                        })
                    );
                    return refreshApex(this.wiredConts);
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