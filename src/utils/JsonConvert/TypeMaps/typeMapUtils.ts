export function array<Type = unknown>(typ: Type): { arrayItems: Type } {
  return { arrayItems: typ };
}

export function union<Type = unknown>(
  ...typs: Type[]
): { unionMembers: Type[] } {
  return { unionMembers: typs };
}

export function object<TProperties = unknown, TAdditional = unknown>(
  properties: TProperties[],
  additional: TAdditional
): {
  properties: TProperties[];
  additional: TAdditional;
} {
  return { properties, additional };
}

export function reference(name: string): { reference: string } {
  return { reference: name };
}
