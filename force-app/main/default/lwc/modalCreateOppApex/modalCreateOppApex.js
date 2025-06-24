import LightningModal from 'lightning/modal';
import {api} from 'lwc';

export default class ModalCreateOppApex extends LightningModal {

    @api modalCreateOppApex;
    @api modalCreateAccountApex;
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

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
       this.fieldsValues = {...this.fieldsValues, [name]: value};
    };

    handleSaveClick() {
        // fermer le modal en renvoyant les données saisies
        let oppString = JSON.stringify(this.fieldsValues);
        this.close(oppString);
    }

    handleCancelClick() {
        this.close(null);
    }
}