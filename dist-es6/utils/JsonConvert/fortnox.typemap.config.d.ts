declare const _default: {
    FortnoxFile: {
        properties: ({
            json: string;
            js: string;
            typ: {
                unionMembers: (string | undefined)[];
            };
        } | {
            json: string;
            js: string;
            typ: {
                unionMembers: ({
                    unionMembers: (string | null)[];
                } | undefined)[];
            };
        } | {
            json: string;
            js: string;
            typ: {
                unionMembers: (number | undefined)[];
            };
        })[];
        additional: boolean;
    };
    Article: {
        properties: {
            json: string;
            js: string;
            typ: {
                unionMembers: (string | undefined)[];
            };
        }[];
        additional: boolean;
    };
    Invoice: {
        properties: ({
            json: string;
            js: string;
            typ: {
                unionMembers: (string | undefined)[];
            };
        } | {
            json: string;
            js: string;
            typ: {
                unionMembers: (number | undefined)[];
            };
        } | {
            json: string;
            js: string;
            typ: {
                unionMembers: (boolean | undefined)[];
            };
        } | {
            json: string;
            js: string;
            typ: {
                unionMembers: (DateConstructor | undefined)[];
            };
        } | {
            json: string;
            js: string;
            typ: {
                unionMembers: ({
                    reference: string;
                } | undefined)[];
            };
        } | {
            json: string;
            js: string;
            typ: {
                arrayItems: {
                    reference: string;
                };
            };
        })[];
        additional: boolean;
    };
    EDIInformation: {
        properties: {
            json: string;
            js: string;
            typ: {
                unionMembers: (string | undefined)[];
            };
        }[];
        additional: boolean;
    };
    InvoiceRow: {
        properties: ({
            json: string;
            js: string;
            typ: {
                unionMembers: (number | undefined)[];
            };
        } | {
            json: string;
            js: string;
            typ: {
                unionMembers: (string | undefined)[];
            };
        } | {
            json: string;
            js: string;
            typ: {
                unionMembers: (boolean | undefined)[];
            };
        })[];
        additional: boolean;
    };
    Label: {
        properties: {
            json: string;
            js: string;
            typ: number;
        }[];
        additional: boolean;
    };
    Default: {
        properties: {
            json: string;
            js: string;
            typ: {
                unionMembers: (string | undefined)[];
            };
        }[];
        additional: boolean;
    };
};
export default _default;
