import { LightningElement, api, wire} from 'lwc';
import crudContControllerDelete from '@salesforce/apex/CrudContractController.crudContControllerDelete';
import crudContControllerGet from '@salesforce/apex/CrudContractController.crudContControllerGet';
import crudContControllerCreate from '@salesforce/apex/CrudContractController.crudContControllerCreate';
import crudContControllerEdit from '@salesforce/apex/CrudContractController.crudContControllerEdit';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import modal from'c/modal';


const columns = [
    { label: 'Contract Number', fieldName: 'ContractNumber', type: 'number', editable: false},
    { label: 'Currency', fieldName: 'CurrencyIsoCode', type: 'text', editable: true},
    { label: 'Status', fieldName: 'Status', type: 'text', editable: true},
    { label: 'Start Date', fieldName: 'StartDate', type: 'date', editable: true},
    { label: 'Contract Term', fieldName: 'ContractTerm', type: 'number', editable: true},
    { label: 'See Contract', type: 'button', initialWidth: 125,
    typeAttributes: { iconName: 'utility:preview', label: 'See Contract', variant:'brand', name: 'see_cont', title: 'Click to see the Contract', },
    cellAttributes: { alignment: 'center',}},
    {label: 'Delete', type: 'button-icon', typeAttributes: { iconName: 'utility:delete', name: 'delete', title: 'Click to delete the Contract'}},
    {label: 'Edit', type: 'button-icon', typeAttributes: { iconName: 'utility:edit', name: 'edit', title: 'Click to edit the Contract'}},
]

export default class DatatableConctractAccount extends  NavigationMixin(LightningElement) {

    @api recordId;
    contItem = [];
    data = [];
    columns = columns;
    draftValues = [];
    wiredConts; 

  @wire(crudContControllerGet, {accountId : '$recordId'})
    wiredCrudContControllerGet (result) {
      this.wiredConts= result;
        const { data, error } = result;
        if (data) {

         this.data = data; 
         this.contItem = data.map((record) => {
            return {... record,
        }})
        }
        else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while fetching Contract',
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

        return refreshApex(this.wiredConts);
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
      case 'see_cont':
        this.handleSeeCont(row);
        break;
      case 'edit':
        this.handleEditApex(row);
        break;
    }
  }

async handleDelete(row) {
    try {

       const rowId = row.Id;
        await crudContControllerDelete ({ contDelete: rowId });

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

  async handleAddApex (row) {
    const result = await modal.open({
        size: 'small',
        description: 'Formulaire création Contract',
        content: 'Passed into content api',
        modalCreateContractApex: true
    }
  );

    if (result) {
console.log ("c'est passé par laaaaaaa" + result)
       crudContControllerCreate({contJSON: result,accountId : this.recordId})
            .then(() => {console.log ("c'est passé par laaaaaaa")
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Succès',
                        message: 'Contrat créée avec succès.',
                        variant: 'success'
                    })
                );
                console.log ("avant refresh");
                return refreshApex(this.wiredConts);
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
        description: 'Formulaire udpate contract',
        content: 'Passed into content api',
        objectToUdpate: {row},
        modalUpdateContract: true
    });

    if (result) {
console.log ("formulaire retrouné au LWC parent" + result)
       crudContControllerEdit({contJSON: result})
            .then(() => {console.log ('formulaire envoyé à apex' + result)
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
