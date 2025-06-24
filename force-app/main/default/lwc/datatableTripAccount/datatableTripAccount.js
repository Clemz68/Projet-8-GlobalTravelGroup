import { LightningElement, api, wire} from 'lwc';
import crudTrpControllerGet from '@salesforce/apex/CrudTripController.crudTrpControllerGet';
import crudTrpControllerDelete from '@salesforce/apex/CrudTripController.crudTrpControllerDelete';
import crudOppControllerGet from '@salesforce/apex/CrudOppController.crudOppControllerGet';
import crudTrpControllerCreate from '@salesforce/apex/CrudTripController.crudTrpControllerCreate';
import crudTrpControllerEdit from '@salesforce/apex/CrudTripController.crudTrpControllerEdit';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import modal from'c/modal';


const columns = [
    { label: 'Name', fieldName: 'Name', type:'text', editable: false},
    { label: 'Opportunity', fieldName: 'OpportunityName', type: 'text', editable: false },
    { label: 'Status', fieldName: 'Status__c', type: 'picklist', editable: true, 
      cellAttributes: { alignment:'left', class: {fieldName: 'statusClass'}}},
    { label: 'Destination', fieldName: 'Destination__c', type: 'text', editable: true},
    { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date', editable: true},
    { label: 'End Date', fieldName: 'End_Date__c', type: 'date', editable: true},
    { label: 'Participants', fieldName: 'Number_of_Participants__c', type: 'number', editable: true,
    cellAttributes: { alignment:'left', class: {fieldName: 'participantClass'}}},
    { label: 'See Trip', type: 'button', initialWidth: 125,
    typeAttributes: { iconName: 'utility:preview', label: 'See Trip', variant:'brand', name: 'see_trip', title: 'Click to see the trip', },
    cellAttributes: { alignment: 'center',}},
    {label: 'Delete', type: 'button-icon', typeAttributes: { iconName: 'utility:delete', name: 'delete', title: 'Click to delete the trip'}},
    {label: 'Edit', type: 'button-icon', typeAttributes: { iconName: 'utility:edit', name: 'edit', title: 'Click to edit the trip'}},
]

export default class DatatableTripAccount extends  NavigationMixin(LightningElement) {

    @api recordId;
    tripItem = [];
    data = [];
    columns = columns;
    draftValues = [];
    wiredTrips; 
    opportunityOptions = [];

   @wire(crudTrpControllerGet,{accountId : '$recordId'})
   wiredCrudTrpControllerGet (result) {
      this.wiredTrips = result;
        const { data, error } = result;
        if (data) {

          this.data = data; 
          this.tripItem = data.map((record) => {

            let statusClass = this.styleCssStatus (record); 
            let participantClass = this.styleCssParticipant (record); 
            return {... record, 
            statusClass: statusClass,
            participantClass: participantClass,
            OpportunityName: record.Opportunity__r?.Name ?? '',
        }})
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

  @wire(crudOppControllerGet, {accountId : '$recordId'})
    wiredCrudOppControllerGet (result) {
        const { data, error } = result;
        if (data) { console.log ("donnée opp" +data, JSON.stringify(result, null, 2));
          this.opportunityOptions = data.map(opp => {
                return { label: opp.label, value: opp.value };
            });
            console.log ("donnée options" +this.opportunityOptions, JSON.stringify(result, null, 2));
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

  styleCssStatus (record) {

  if (record.Status__c == 'En cours') {
 
      return 	'slds-text-color_success slds-theme_success slds-text-bold';
    }
      else {
    
        if (record.Number_of_Participants__c < 10 && record.Status__c == 'A venir'){

      return 'slds-theme_warning slds-theme_alert-texture slds-text-bold';
        }
      else if (record.Status__c == 'A venir') {
      
        return 'slds-theme_info slds-text-bold';

      }
    }
  }

  
  styleCssParticipant (record) {

    if (record.Status__c == 'A venir') {

      if (record.Number_of_Participants__c < 10) {

        return 'slds-theme_warning slds-theme_alert-texture slds-text-bold';
      }
    }
  }

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
          message: 'An Error '+error,
          variant: 'error'
         })
        );
      });
    }catch(error){
      console.error(error);
    }
  }

  handleRowAction(event) {

    const actionName = event.detail.action.name;
    const row = event.detail.row;

      console.log('nom de laction' + actionName);
      console.log('id de ligne' + event.detail.row.Id);
      console.log('row de ligne' + row ,JSON.stringify(row, null, 2));

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

// Ajouter l'écoute de la classe apex crudTrpControllerEdit, fare de meme pour le bouton Create(Apex) lié à crudTrpControllerCreate

async handleDelete(row) {
    try {

       const rowId = row.Id;
        await crudTrpControllerDelete ({ tripDelete: rowId });

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

handleSeeTrip(row) {

  const rowId = row.Id

    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: rowId,
        actionName: "view",
      },
    });
  }

  async handleAdd (row) {

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

// Créer classe apex qui récup données du modal lancé ici, modifier le modal pour qu'il soit calibré pour l'édition d'un trip

  async handleAddApex (row) {
    const result = await modal.open({
        size: 'small',
        description: 'Formulaire création trip',
        content: 'Passed into content api',
        modalCreateTripApex: true
        
    }
  );

    if (result) {
console.log ("c'est passé par laaaaaaa" + result)
       crudTrpControllerCreate({ tripJSON: result , accountId : this.recordId})
            .then(() => {console.log ("c'est passé par laaaaaaa")
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Succès',
                        message: 'Le voyage a été créé avec succès.',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredTrips);
            })
            .catch(error => {console.log ("c'est passé par")
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

async handleEditApex (row) {

      console.log('row de ligne après passage handler' + row ,JSON.stringify(row, null, 2));
      

    const result = await modal.open({
        size: 'small',
        label: 'my little modal',
        description: 'Formulaire udpate trip',
        content: 'Passed into content api',
        objectToUdpate: {row},
        modalUpdateTrip: true
    });

    if (result) {
console.log ("formulaire retrouné au LWC parent" + result)
       crudTrpControllerEdit({ tripJSON: result})
            .then(() => {console.log ('formulaire envoyé à apex' + result)
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Succès',
                        message: 'Le voyage a été édité avec succès.',
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
