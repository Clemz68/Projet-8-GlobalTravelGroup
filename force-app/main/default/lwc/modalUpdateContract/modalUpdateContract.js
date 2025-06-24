import LightningModal from 'lightning/modal';
import {api} from 'lwc';

export default class ModalUpdateContract extends LightningModal {

    statusOptions = [

        { label: 'In Approval Process', value: 'In Approval Process' },
        { label: 'Activated', value: 'Activated' },
        { label: 'Draft', value: 'Draft' },
    ];

    currencyOptions = [

        { label: 'EUR - Euro', value: 'EUR' },
        { label: 'CHF - Swiss Frank', value: 'CHF' },
    ];
    fieldsValues = {};
    @api contToUdpate;
    contractNumberOutput; 
    statusEdit;
    currencyIsoCodeEdit;
    startDateEdit;
    contractTermEdit;
    
        connectedCallback() {
            this.contractNumberOutput = this.contToUdpate.row.ContractNumber;
            this.statusEdit = this.contToUdpate.row.Status;
            this.currencyIsoCodeEdit = this.contToUdpate.row.CurrencyIsoCode;
            this.contractTermEdit = this.contToUdpate.row.ContractTerm;
            this.startDateEdit = this.contToUdpate.row.StartDate;
        }

    handleChange(event){

        console.log('event.detals.name '+event.target.name+' : '+event.target.value);
       
        if(event.target.name=='status'){
        
            this.statusEdit = event.target.value;
        }

        if(event.target.name=='currencyIsoCode'){
        
            this.currencyIsoCodeEdit = event.target.value;
        }

        if(event.target.name=='contractTerm'){
        
            this.contractTermEdit = event.target.value;
        }

        if(event.target.name=='startDate'){
        console.log ('cont à update' + JSON.stringify(this.contToUdpate, null, 2));
            this.startDateEdit = event.target.value;
        }

    }

    handleSaveClick() {
        // fermer le modal en renvoyant les données saisies
        this.fieldsValues = {

            status:this.statusEdit,
            currencyIsoCode:this.currencyIsoCodeEdit,
            startDate:this. startDateEdit,
            Id:this.contToUdpate.row.Id,
            contractTerm:this.contractTermEdit,
        };
        let contsString = JSON.stringify(this.fieldsValues);
        this.close(contsString);
    }

    handleCancelClick() {
        this.close(null);
    }
}