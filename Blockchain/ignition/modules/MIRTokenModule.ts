import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MIRTokenModule = buildModule("MIRTokenModule", (m) => {

  const MIRToken = m.contract("MIRToken",);

  return { MIRToken };
});

export default MIRTokenModule;
