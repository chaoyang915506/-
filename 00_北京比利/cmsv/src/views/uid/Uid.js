export class UidExtra {
    constructor() {
        this.id = 0;
        this.hotelId = 0;
        this.specId = 0;
        this.value = '';
    }
}

export class UidExtraSpec {
    constructor() {
        this.id = 0;
        this.key = '';
        this.valueType = 'text';
        this.defValue = '';
        this.name = '';
        this.desc = '';
    }
}

export const ExtraValueType = {
    Text: 'text', Number: 'number', Color: 'color'
}

export class Uid {
    constructor() {
        this.id = 0;
        this.baseType = 0;
        this.configType = 0;
        this.uid = '';
        this.uri = '';
        this.name = '';
        this.desc = ''
        this.specs = [];
    }
}
