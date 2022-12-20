export declare function array<Type = unknown>(typ: Type): {
    arrayItems: Type;
};
export declare function union<Type = unknown>(...typs: Type[]): {
    unionMembers: Type[];
};
export declare function object<TProperties = unknown, TAdditional = unknown>(properties: TProperties[], additional: TAdditional): {
    properties: TProperties[];
    additional: TAdditional;
};
export declare function reference(name: string): {
    reference: string;
};
