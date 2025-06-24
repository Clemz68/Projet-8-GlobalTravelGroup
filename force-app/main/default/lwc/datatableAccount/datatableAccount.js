import { LightningElement, api, wire} from 'lwc';
import crudAccControllerDelete from '@salesforce/apex/CrudAccountController.crudAccControllerDelete';
import crudAccControllerGet from '@salesforce/apex/CrudAccountController.crudAccControllerGet';
import crudAccControllerCreate from '@salesforce/apex/CrudAccountController.crudAccControllerCreate';
import crudAccControllerEdit from '@salesforce/apex/CrudAccountController.crudAccControllerEdit';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from "lightning/uiRecordApi";
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import modal from'c/modal';


const columns = [
    { label: 'Account Name', fieldName: 'Name', type: 'text', editable: true},
    { label: 'Currency', fieldName: 'CurrencyIsoCode', type: 'text', editable: true},
    { label: 'Industry', fieldName: 'Industry', type: 'text', editable: true},
    { label: 'Phone', fieldName: 'Phone', type: 'number', editable: true},
    { label: 'See Account', type: 'button', initialWidth: 125,
    typeAttributes: { iconName: 'utility:preview', label: 'See Account', variant:'brand', name: 'see_acc', title: 'Click to see the Account', },
    cellAttributes: { alignment: 'center',}},
    {label: 'Delete', type: 'button-icon', typeAttributes: { iconName: 'utility:delete', name: 'delete', title: 'Click to delete the Account'}},
    {label: 'Edit', type: 'button-icon', typeAttributes: { iconName: 'utility:edit', name: 'edit', title: 'Click to edit the Account'}},
]

export default class DatatableConctractAccount extends  NavigationMixin(LightningElement) {

    accItem = [];
    data = [];
    columns = columns;
    draftValues = [];
    wiredAccs; 

  @wire(crudAccControllerGet)
    wiredCrudAccControllerGet (result) {
      this.wiredAccs= result;
        const { data, error } = result;
        if (data) {

         this.data = data; 
         this.accItem = data.map((record) => {
            return {... record,
        }})
        }
        else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while fetching Account',
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

        return refreshApex(this.wiredAccs);
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
      case 'see_acc':
        this.handleSeeAcc(row);
        break;
      case 'edit':
        this.handleEditApex(row);
        break;
    }
  }

async handleDelete(row) {
    try {

       const rowId = row.Id;
        await crudAccControllerDelete ({ accDelete: rowId });

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Succès',
                message: 'Ce compte a été supprimé avec succès.',
                variant: 'success'
            })
        );
        await refreshApex(this.wiredAccs); 

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

handleSeeAcc(row) {

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
        description: 'Formulaire création Account',
        content: 'Passed into content api',
        modalCreateAccountApex: true
    }
  );

    if (result) {
console.log ("c'est passé par laaaaaaa" + result)
       crudAccControllerCreate({accJSON: result})
            .then(() => {console.log ("c'est passé par laaaaaaa")
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Succès',
                        message: 'Compte créé avec succès.',
                        variant: 'success'
                    })
                );
                console.log ("avant refresh");
                return refreshApex(this.wiredAccs);
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
      
 try {
    const result = await modal.open({
        size: 'small',
        description: 'Formulaire udpate Account',
        content: 'Passed into content api',
        objectToUdpate: {row},
        modalUpdateAccount: true
    });
  
    if (result) {
    console.log ("formulaire retrouné au LWC parent" + result)
       crudAccControllerEdit({accJSON: result})
            .then(() => {console.log ('formulaire envoyé à apex' + result)
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Succès',
                        message: 'Compte édité avec succès.',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredAccs);
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

  catch(error) {
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