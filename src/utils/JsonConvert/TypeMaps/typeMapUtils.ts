/* eslint-disable @typescript-eslint/explicit-function-return-type */
export function array(typ: unknown) {
  return { arrayItems: typ };
}

export function union(...typs: unknown[]) {
  return { unionMembers: typs };
}

export function object(properties: unknown[], additional: unknown) {
  return { properties, additional };
}

export function reference(name: string) {
  return { reference: name };
}

