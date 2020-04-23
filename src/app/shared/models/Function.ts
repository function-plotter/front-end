export enum FunctionType {
  INTEGRAL = 'integral',
  ADDITION = 'add',
  MULTIPLICATION = 'mult',
  VARIABLE = 'var',
  CONSTANT = 'const',
}

export interface FunctionData {
  name: string;
  args: { accepts?: FunctionType[]; exclude?: FunctionType[] }[];
}
export const Functions: { [key in FunctionType]: FunctionData } = {
  [FunctionType.INTEGRAL]: {
    name: 'Integral',
    args: [{ exclude: [FunctionType.INTEGRAL] }],
  },
  [FunctionType.ADDITION]: {
    name: 'Addition',
    args: [{ exclude: [FunctionType.INTEGRAL] }, { exclude: [FunctionType.INTEGRAL] }],
  },
  [FunctionType.MULTIPLICATION]: {
    name: 'Multiplication',
    args: [{ exclude: [FunctionType.INTEGRAL] }, { exclude: [FunctionType.INTEGRAL] }],
  },
  [FunctionType.VARIABLE]: {
    name: 'Variable',
    args: [],
  },
  [FunctionType.CONSTANT]: {
    name: 'Constant',
    args: [],
  },
};
