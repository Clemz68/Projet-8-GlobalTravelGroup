import { LightningElement, api, wire} from 'lwc';
import crudOppControllerDelete from '@salesforce/apex/CrudOppController.crudOppControllerDelete';
import crudOppControllerGet from '@salesforce/apex/CrudOppController.crudOppControllerGet';
import crudOppControllerCreate from '@salesforce/apex/CrudOppController.crudOppControllerCreate';
import crudOppControllerEdit from '@salesforce/apex/CrudOppController.crudOppControllerEdit';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import modal from'c/modal';


const columns = [
    { label: 'Name', fieldName: 'Name', type:'text', editable: false},
    { label: 'Stage', fieldName: 'StageName', type: 'text', editable: true},
    { label: 'Close Date', fieldName: 'CloseDate', type: 'date', editable: true},
    { label: 'Amount', fieldName: 'Amount', type: 'currency', editable: true},
    { label: 'Destination', fieldName: 'Destination__c', type: 'text', editable: true},
    { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date', editable: true},
    { label: 'End Date', fieldName: 'End_Date__c', type: 'date', editable: true},
    { label: 'Participants', fieldName: 'Number_of_Participants__c', type: 'number', editable: true,
    cellAttributes: { alignment:'left', class: {fieldName: 'participantClass'}}},
    { label: 'See Opp', type: 'button', initialWidth: 125,
    typeAttributes: { iconName: 'utility:preview', label: 'See Opp', variant:'brand', name: 'see_opp', title: 'Click to see the Opp', },
    cellAttributes: { alignment: 'center',}},
    {label: 'Delete', type: 'button-icon', typeAttributes: { iconName: 'utility:delete', name: 'delete', title: 'Click to delete the Opp'}},
    {label: 'Edit', type: 'button-icon', typeAttributes: { iconName: 'utility:edit', name: 'edit', title: 'Click to edit the Opp'}},
]

export default class DatatableOppAccount extends  NavigationMixin(LightningElement) {

    @api recordId;
    oppItem = [];
    data = [];
    columns = columns;
    draftValues = [];
    wiredOpps; 

  @wire(crudOppControllerGet, {accountId : '$recordId'})
    wiredCrudOppControllerGet (result) {
      this.wiredOpps= result;
        const { data, error } = result;
        if (data) {

         this.data = data; 
         this.oppItem = data.map((record) => {
            return {... record,
        }})
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
      case 'see_opp':
        this.handleSeeOpp(row);
        break;
      case 'edit':
        this.handleEditApex(row);
        break;
    }
  }

async handleDelete(row) {
    try {

       const rowId = row.Id;
        await crudOppControllerDelete ({ oppDelete: rowId });

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

handleSeeOpp(row) {

  const rowId = row.Id

    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: rowId,
        actionName: "view",
      },
    });
  }

  async handleAddApex (row) {
    const result = await modal.open({
        size: 'small',
        description: 'Formulaire création opp',
        content: 'Passed into content api',
        modalCreateOppApex: true
    }
  );

    if (result) {
console.log ("c'est passé par laaaaaaa" + result)
       crudOppControllerCreate({oppJSON: result,accountId : this.recordId})
            .then(() => {console.log ("c'est passé par laaaaaaa")
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Succès',
                        message: 'Opportunité créée avec succès.',
                        variant: 'success'
                    })
                );
                console.log ("avant refresh");
                return refreshApex(this.wiredOpps);
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
        description: 'Formulaire udpate opp',
        content: 'Passed into content api',
        objectToUdpate: {row},
        modalUpdateOpp: true
    });

    if (result) {
console.log ("formulaire retrouné au LWC parent" + result)
       crudOppControllerEdit({oppJSON: result})
            .then(() => {console.log ('formulaire envoyé à apex' + result)
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
