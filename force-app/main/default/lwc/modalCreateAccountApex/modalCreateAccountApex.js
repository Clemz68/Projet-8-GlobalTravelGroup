import LightningModal from 'lightning/modal';

export default class ModalCreateContractApex extends LightningModal {

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