import LightningModal from 'lightning/modal';
import {api} from 'lwc'; 

export default class ModalUpdateAccount extends LightningModal {
   
        industryOptions = [

        { label: 'Agriculture', value: 'Agriculture' },
        { label: 'Apparel', value: 'Apparel' },
        { label: 'Banking', value: 'Banking' },
        ];

        currencyOptions = [
    
            { label: 'EUR - Euro', value: 'EUR' },
            { label: 'CHF - Swiss Frank', value: 'CHF' },
        ];

        fieldsValues = {};
        @api accToUdpate;
        nameEdit;
        industryEdit; 
        phoneEdit;
        currencyIsoCodeEdit;
      
        
        connectedCallback() {
    
                this.nameEdit = this.accToUdpate.row.Name;
                this.industryEdit = this.accToUdpate.row.Industry;
                this.currencyIsoCodeEdit = this.accToUdpate.row.CurrencyIsoCode;
                this.phoneEdit = this.accToUdpate.row.Phone;
            }
    
        handleChange(event){
    
            console.log('event.detals.name '+event.target.name+' : '+event.target.value);
           
            if(event.target.name=='name'){
            
                this.nameEdit = event.target.value;
            }
    
            if(event.target.name=='currencyIsoCode'){
            
                this.currencyIsoCodeEdit = event.target.value;
            }
    
            if(event.target.name=='industry'){
            
                this.industryEdit = event.target.value;
            }
    
            if(event.target.name=='phone'){
            console.log ('acc à update' + JSON.stringify(this.accToUdpate, null, 2));
                this.phoneEdit = event.target.value;
            }
    
        }
    
        handleSaveClick() {
            // fermer le modal en renvoyant les données saisies
            this.fieldsValues = {
    
                name:this.nameEdit,
                currencyIsoCode:this.currencyIsoCodeEdit,
                industry:this.industryEdit,
                id:this.accToUdpate.row.Id,
                phone:this.phoneEdit,
            };
            let accsString = JSON.stringify(this.fieldsValues);
            this.close(accsString);
        }
    
        handleCancelClick() {
            this.close(null);
        }
    }