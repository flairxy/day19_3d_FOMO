const { expectRevert, time } = require("@openzeppelin/test-helpers");
const Fomo3D = artifacts.require("Fomo3D.sol");

const balances = async (addresses) => {
  const balanceResults = await Promise.all(
    addresses.map((address) => web3.eth.getBalance(address))
  );
  return balanceResults.map((balance) => web3.utils.toBN(balance));
};

contract("Fomo3D", (accounts) => {
  let fomo3D;
  beforeEach(async () => {
    fomo3D = await Fomo3D.new();
  });

  it("Should NOT create kickstart if state not inactive", async () => {
    await fomo3D.kickStart(),
      await expectRevert(fomo3D.kickStart(), "not possible in current state");
  });

  it("Should kickstart", async () => {
    await fomo3D.kickStart();
    const currentState = await fomo3D.currentState();
    const totalKeys = await fomo3D.totalKeys();
    assert(totalKeys.toNumber() === 0);
    assert(currentState.toNumber() === 1);
  });

  it("Should NOT bet if not in state BETTING", async () => {
    await expectRevert(
      fomo3D.bet({ value: 100, from: accounts[1] }),
      "not possible in current state"
    );
  });
});
