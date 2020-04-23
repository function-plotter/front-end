export enum FunctionType {
  VARIABLE = 'var',
  CONSTANT = 'const',
  ADDITION = 'add',
  MULTIPLICATION = 'mult',
  DIVISION = 'div',
  SIN = 'sin',
  COS = 'cos',
  POW = 'pow',
  INTEGRAL = 'integral',
}

export interface FunctionData {
  name: string;
  args: number;
}
export const Functions: { [key in FunctionType]: FunctionData } = {
  [FunctionType.INTEGRAL]: {
    name: 'integral',
    args: 1,
  },
  [FunctionType.ADDITION]: {
    name: '+',
    args: 2,
  },
  [FunctionType.MULTIPLICATION]: {
    name: '*',
    args: 2,
  },
  [FunctionType.DIVISION]: {
    name: '/',
    args: 2,
  },
  [FunctionType.SIN]: {
    name: 'sin',
    args: 1,
  },
  [FunctionType.COS]: {
    name: 'cos',
    args: 1,
  },
  [FunctionType.POW]: {
    name: 'pow',
    args: 2,
  },
  [FunctionType.VARIABLE]: {
    name: 'x (variable)',
    args: 0,
  },
  [FunctionType.CONSTANT]: {
    name: 'constant',
    args: 0,
  },
};
