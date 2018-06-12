interface IMemory {
  get: (address: number) => number;
  set: (address: number, data: number) => void;
}

const memory: IMemory = {} as IMemory;

class LoadInstruction {
  constructor(
    readonly to: IWritable,
    readonly from: IReadable,
    readonly cycles: number,
  ) {}

  public execute() {
    this.to.write(this.from.read());
  }
}

interface IReadable {
  read: () => number;
}

interface IWritable {
  write: (data: number) => void;
}

function getMSB(data: number) {
  return data >> 4;
}

function getLSB(data: number) {
  return data & 0xff;
}

class Register implements IReadable, IWritable {
  private value: number = 0;

  public read() {
    return this.value;
  }

  public write(data: number) {
    this.value = data;
  }
}

class SixteenBitRegister implements IReadable, IWritable {
  constructor(readonly LSB: Register, readonly MSB: Register) {}

  public read() {
    return (this.MSB.read() << 4) & this.LSB.read();
  }

  public write(data: number) {
    this.MSB.write(getMSB(data));
    this.LSB.write(getLSB(data));
  }
}

const EIGHT_BIT_LITERAL: IReadable = {
  read() {
    PC += 0x1;
    return memory.get(PC);
  },
};

const A = new Register();
const B = new Register();
const C = new Register();
const D = new Register();
const E = new Register();
const F = new Register();
const H = new Register();
const L = new Register();

let SP = 0xfffe;
let PC = 0x100;

const INSTRUCTIONS = {
  [0x06]: new LoadInstruction(B, EIGHT_BIT_LITERAL, 8),
  [0x0e]: new LoadInstruction(C, EIGHT_BIT_LITERAL, 8),
  [0x16]: new LoadInstruction(D, EIGHT_BIT_LITERAL, 8),
  [0x1e]: new LoadInstruction(E, EIGHT_BIT_LITERAL, 8),
  [0x26]: new LoadInstruction(H, EIGHT_BIT_LITERAL, 8),
  [0x2e]: new LoadInstruction(L, EIGHT_BIT_LITERAL, 8),

  [0x7f]: new LoadInstruction(A, A, 4),
  [0x78]: new LoadInstruction(A, B, 4),
  [0x79]: new LoadInstruction(A, C, 4),
  [0x7a]: new LoadInstruction(A, D, 4),
  [0x7b]: new LoadInstruction(A, E, 4),
  [0x7c]: new LoadInstruction(A, H, 4),
  [0x7d]: new LoadInstruction(A, L, 4),
  [0x7e]: new LoadInstruction(A, L, 4),
};
