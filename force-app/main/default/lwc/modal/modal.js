import LightningModal from 'lightning/modal';
import {api} from 'lwc';

export default class Modal extends LightningModal {

    industryOptions = [

        { label: 'Agriculture', value: 'Agriculture' },
        { label: 'Apparel', value: 'Apparel' },
        { label: 'Banking', value: 'Banking' },
    ];

    currencyOptions = [

        { label: 'EUR - Euro', value: 'EUR' },
        { label: 'CHF - Swiss Frank', value: 'CHF' },
    ];

    statusContractOptions = [

        { label: 'In Approval Process', value: 'In Approval Process' },
        { label: 'Activated', value: 'Activated' },
        { label: 'Draft', value: 'Draft' },

    ];

    statusTripOptions = [
        { label: 'Terminé', value: 'Terminé' },
        { label: 'En cours', value: 'En cours'},
        { label: 'A venir', value: 'A venir' },
        { label: 'Annulé', value: 'Annulé' },
    ];

     stageOptions = [

        { label: 'Prospecting', value: 'Prospecting' },
        { label: 'Qualification', value: 'Qualification'},
        { label: 'Needs Analysis', value: 'Needs Analysis' },
        { label: 'Value Proposition', value: 'Value Proposition' },
        { label: 'Id. Decision Makers', value: 'Id. Decision Makers' },
        { label: 'Perception Analysis', value: 'Perception Analysis' },
        { label: 'Proposal/Price Quote', value: 'Proposal/Price Quote' },
        { label: 'Negotiation/Review	', value: 'Negotiation/Review	' },
        { label: 'Closed Won', value: 'Closed Won' },
        { label: 'Closed Lost', value: 'Closed Lost' },

    ];

    fieldsValues = {};
    newTripId; 
    @api objectToUdpate;

    @api modalCreateTrip;
    @api modalCreateTripApex;
    @api modalUpdateTrip;
    @api modalCreateOppApex;
    @api modalUpdateOpp;
    @api modalCreateContractApex;
    @api modalUpdateContract;
    @api modalCreateAccountApex;
    @api modalUpdateAccount;

    nameEdit;
    industryEdit; 
    phoneEdit;
    stageEdit;
    closeDateEdit;
    amountEdit;
    endDateEdit;
    numberOfParticipantsEdit;
    contractNumberOutput; 
    currencyIsoCodeEdit;
    contractTermEdit;
    statusEdit;
    destinationEdit;
    startDateEdit;
    
    connectedCallback() {

        if (this.modalUpdateTrip){
            this.statusEdit = this.objectToUdpate.row.Status__c;
            this.destinationEdit = this.objectToUdpate.row.Destination__c;
            this.startDateEdit = this.objectToUdpate.row.Start_Date__c;
            this.endDateEdit = this.objectToUdpate.row.End_Date__c;
            this.numberOfParticipantsEdit = this.objectToUdpate.row.Number_of_Participants__c;
        }
        if (this.modalUpdateOpp){
            this.stageEdit = this.objectToUdpate.row.StageName;
            this.closeDateEdit = this.objectToUdpate.row.CloseDate;
            this.amountEdit = this.objectToUdpate.row.Amount;
            this.destinationEdit = this.objectToUdpate.row.Destination__c;
            this.startDateEdit = this.objectToUdpate.row.Start_Date__c;
            this.endDateEdit = this.objectToUdpate.row.End_Date__c;
            this.numberOfParticipantsEdit = this.objectToUdpate.row.Number_of_Participants__c;
        }
        if (this.modalUpdateContract){
            this.contractNumberOutput = this.objectToUdpate.row.ContractNumber;
            this.statusEdit = this.objectToUdpate.row.Status;
            this.currencyIsoCodeEdit = this.objectToUdpate.row.CurrencyIsoCode;
            this.contractTermEdit = this.objectToUdpate.row.ContractTerm;
            this.startDateEdit = this.objectToUdpate.row.StartDate;
        }
        if (this.modalUpdateAccount){
            this.nameEdit = this.objectToUdpate.row.Name;
            this.industryEdit = this.objectToUdpate.row.Industry;
            this.currencyIsoCodeEdit = this.objectToUdpate.row.CurrencyIsoCode;
            this.phoneEdit = this.objectToUdpate.row.Phone;
        }
    }
        

    handleSuccess(event) {
            this.newTripId = event.detail.id;
        if (this.newTripId) {
            this.close('success');
        }
    }

    handleChange(event){

        if (this.modalCreateTripApex || this.modalCreateOppApex ||this.modalCreateContractApex || this.modalCreateAccountApex) {
             const name = event.target.name;
            const value = event.target.value;
            this.fieldsValues = {...this.fieldsValues, [name]: value};
        } 
        
        if (this.modalCreateTrip){


        }

        if (this.modalUpdateTrip || this.modalUpdateOpp || this.modalUpdateContract || this.modalUpdateAccount){
    
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
            console.log ('acc à update' + JSON.stringify(this.objectToUdpate, null, 2));
                this.phoneEdit = event.target.value;
            }
            if(event.target.name=='stage'){
        
            this.stageEdit = event.target.value;
            }

            if(event.target.name=='closeDate'){
            
                this.closeDateEdit = event.target.value;
            }

            if(event.target.name=='amount'){
            
                this.amountEdit = event.target.value;
            }

            if(event.target.name=='destination'){
            console.log ('object à update' + JSON.stringify(this.objectToUdpate, null, 2));
            console.log ('ligne à update' + this.objectToUdpate.row.Status__c);
                this.destinationEdit = event.target.value;
            }

            if(event.target.name=='endDate'){
                this.endDateEdit = event.target.value;
            }
            if(event.target.name=='numberOfParticipants'){
                this.numberOfParticipantsEdit = event.target.value;
            }
           
            if(event.target.name=='contractTerm'){
            
                this.contractTermEdit = event.target.value;
            }

            if(event.target.name=='startDate'){
            console.log ('cont à update' + JSON.stringify(this.objectToUdpate, null, 2));
                this.startDateEdit = event.target.value;
            }
             if(event.target.name=='status'){
            console.log ('object à update' + JSON.stringify(this.objectToUdpate, null, 2));
            console.log ('ligne à update' + this.objectToUdpate.row.Status__c);
                this.statusEdit = event.target.value;
            }
        }
    }
    
    handleSaveClick(){

        if (this.modalCreateTripApex || this.modalCreateOppApex ||this.modalCreateContractApex || this.modalCreateAccountApex) {
            let objectString = JSON.stringify(this.fieldsValues);
            this.close(objectString);
        } 
        
        if (this.modalUpdateTrip){
            this.fieldsValues = {
                id:this.objectToUdpate.row.Id,
                status:this.statusEdit,
                destination:this.destinationEdit,
                startDate:this.startDateEdit,
                endDate:this.endDateEdit,
                numberOfParticipants:this.numberOfParticipantsEdit
        };
        let objectString = JSON.stringify(this.fieldsValues);
        this.close(objectString);
        }
        if (this.modalUpdateOpp){
            this.fieldsValues = {
                stage:this.stageEdit,
                closeDate:this.closeDateEdit,
                amount:this.amountEdit,
                Id:this.objectToUdpate.row.Id,
                destination:this.destinationEdit,
                startDate:this.startDateEdit,
                endDate:this.endDateEdit,
                numberOfParticipants:this.numberOfParticipantsEdit
        };
        let objectString = JSON.stringify(this.fieldsValues);
        this.close(objectString);
        }
        if (this.modalUpdateContract){
            this.fieldsValues = {
                status:this.statusEdit,
                currencyIsoCode:this.currencyIsoCodeEdit,
                startDate:this. startDateEdit,
                Id:this.objectToUdpate.row.Id,
                contractTerm:this.contractTermEdit,
        };
        let objectString = JSON.stringify(this.fieldsValues);
        this.close(objectString);
          
        }
        if (this.modalUpdateAccount){
            this.fieldsValues = {
                name:this.nameEdit,
                currencyIsoCode:this.currencyIsoCodeEdit,
                industry:this.industryEdit,
                id:this.objectToUdpate.row.Id,
                phone:this.phoneEdit,
            };
            let objectString = JSON.stringify(this.fieldsValues);
            this.close(objectString);
        }
    }

    handleSuccess(event) {
            this.newTripId = event.detail.id;
        if (this.newTripId) {
            this.close('success');
        }
    }

    handleCancelClick() {
        this.close(null);
    }

    handleCloseClick() {
        this.close('canceled');
    }
}

