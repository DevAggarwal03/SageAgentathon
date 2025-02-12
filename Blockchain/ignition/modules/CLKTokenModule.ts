import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CLKTokenModule = buildModule("CLKTokenModule", (m) => {

  const CLKToken = m.contract("CLKToken",);

  return { CLKToken };
});

export default CLKTokenModule;
