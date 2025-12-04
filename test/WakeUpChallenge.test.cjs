const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WakeUpChallenge Contract", function () {
    let wakeUpChallenge;
    let owner, user1, user2, user3;
    const DEPOSIT = ethers.parseEther("0.1");
    const DURATION = 7; // 7 days
    const WAKE_UP_TIME = 28800; // 8:00 AM UTC in seconds

    beforeEach(async function () {
        [owner, user1, user2, user3] = await ethers.getSigners();

        const WakeUpChallenge = await ethers.getContractFactory("WakeUpChallenge");
        wakeUpChallenge = await WakeUpChallenge.deploy();
    });

    describe("Challenge Creation", function () {
        it("Should allow user to create a challenge", async function () {
            const tx = await wakeUpChallenge.connect(user1).createChallenge(
                DEPOSIT,
                WAKE_UP_TIME,
                DURATION,
                { value: DEPOSIT }
            );

            expect(tx).to.emit(wakeUpChallenge, "ChallengeCreated");

            const profile = await wakeUpChallenge.getUserProfile(user1.address);
            expect(profile.totalDeposited).to.equal(DEPOSIT);
        });

        it("Should reject if incorrect deposit amount", async function () {
            await expect(
                wakeUpChallenge.connect(user1).createChallenge(
                    DEPOSIT,
                    WAKE_UP_TIME,
                    DURATION,
                    { value: ethers.parseEther("0.05") }
                )
            ).to.be.revertedWith("Incorrect deposit amount");
        });

        it("Should reject if invalid duration", async function () {
            await expect(
                wakeUpChallenge.connect(user1).createChallenge(
                    DEPOSIT,
                    WAKE_UP_TIME,
                    0,
                    { value: DEPOSIT }
                )
            ).to.be.revertedWith("Invalid duration");
        });
    });

    describe("Wake-Up Confirmation", function () {
        beforeEach(async function () {
            await wakeUpChallenge.connect(user1).createChallenge(
                DEPOSIT,
                WAKE_UP_TIME,
                DURATION,
                { value: DEPOSIT }
            );
        });

        it("Should confirm user woke up on time", async function () {
            const tx = await wakeUpChallenge.connect(user1).confirmWakeUp(0);
            expect(tx).to.emit(wakeUpChallenge, "WakeUpConfirmed");

            const challenge = await wakeUpChallenge.getChallenge(0);
            expect(challenge.daysCompleted).to.equal(1);
        });

        it("Should prevent duplicate confirmation same day", async function () {
            await wakeUpChallenge.connect(user1).confirmWakeUp(0);
            await expect(
                wakeUpChallenge.connect(user1).confirmWakeUp(0)
            ).to.be.revertedWith("Already confirmed for today");
        });

        it("Should reject if not challenge owner", async function () {
            await expect(
                wakeUpChallenge.connect(user2).confirmWakeUp(0)
            ).to.be.revertedWith("Not challenge owner");
        });
    });

    describe("Challenge Finalization", function () {
        beforeEach(async function () {
            await wakeUpChallenge.connect(user1).createChallenge(
                DEPOSIT,
                WAKE_UP_TIME,
                1,
                { value: DEPOSIT }
            );
        });

        it("Should return deposit if all days completed", async function () {
            // Confirm wake-up
            await wakeUpChallenge.connect(user1).confirmWakeUp(0);

            // Move time forward past challenge end
            const challengeData = await wakeUpChallenge.getChallenge(0);
            // Advance time past challenge end (add 8 days to be safe)
            await ethers.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            const userBalanceBefore = await ethers.provider.getBalance(user1.address);

            // Finalize challenge
            const tx = await wakeUpChallenge.connect(user1).finalizeChallenge(0);
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;

            const userBalanceAfter = await ethers.provider.getBalance(user1.address);
            expect(userBalanceAfter).to.be.closeTo(
                userBalanceBefore + DEPOSIT - gasUsed,
                ethers.parseEther("0.001")
            );
        });

        it("Should burn deposit if days missed", async function () {
            // Don't confirm any wake-ups
            
            const userBalanceBefore = await ethers.provider.getBalance(user1.address);

            // Wait for challenge to end
            const challengeData = await wakeUpChallenge.getChallenge(0);
            // Advance time past challenge end (add 8 days to be safe)
            await ethers.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);

            const tx = await wakeUpChallenge.connect(user1).finalizeChallenge(0);

            const profile = await wakeUpChallenge.getUserProfile(user1.address);
            expect(profile.totalBurned).to.equal(DEPOSIT);
        });
    });

    describe("Social Challenge", function () {
        it("Should create social challenge", async function () {
            const participants = [user1.address, user2.address, user3.address];
            const totalDeposit = DEPOSIT * BigInt(3);

            const tx = await wakeUpChallenge.createSocialChallenge(
                participants,
                DEPOSIT,
                WAKE_UP_TIME,
                DURATION,
                { value: totalDeposit }
            );

            expect(tx).to.emit(wakeUpChallenge, "SocialChallengeCreated");
        });

        it("Should reject social challenge with < 2 participants", async function () {
            const participants = [user1.address];

            await expect(
                wakeUpChallenge.createSocialChallenge(
                    participants,
                    DEPOSIT,
                    WAKE_UP_TIME,
                    DURATION,
                    { value: DEPOSIT }
                )
            ).to.be.revertedWith("Need at least 2 participants");
        });
    });

    describe("User Profile", function () {
        it("Should track user statistics correctly", async function () {
            // Create challenge
            await wakeUpChallenge.connect(user1).createChallenge(
                DEPOSIT,
                WAKE_UP_TIME,
                1,
                { value: DEPOSIT }
            );

            // Complete wake-up
            await wakeUpChallenge.connect(user1).confirmWakeUp(0);

            // Advance time and finalize
            await ethers.provider.send("evm_increaseTime", [8 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine", []);
            await wakeUpChallenge.connect(user1).finalizeChallenge(0);

            const profile = await wakeUpChallenge.getUserProfile(user1.address);
            expect(profile.totalDeposited).to.equal(DEPOSIT);
            expect(profile.successfulChallenges).to.equal(1);
            expect(profile.totalReturned).to.equal(DEPOSIT);
        });
    });

    describe("Oracle Functions", function () {
        it("Should only allow oracle to confirm social wake-up", async function () {
            const participants = [user1.address, user2.address];
            const totalDeposit = DEPOSIT * BigInt(2);

            await wakeUpChallenge.createSocialChallenge(
                participants,
                DEPOSIT,
                WAKE_UP_TIME,
                DURATION,
                { value: totalDeposit }
            );

            // Owner should be able to call (default oracle)
            await expect(
                wakeUpChallenge.confirmSocialWakeUp(0, user1.address)
            ).to.not.be.reverted;

            // Non-oracle should fail
            await expect(
                wakeUpChallenge.connect(user1).confirmSocialWakeUp(0, user1.address)
            ).to.be.revertedWith("Only oracle can call");
        });

        it("Should allow setting new oracle address", async function () {
            await wakeUpChallenge.setOracleAddress(user1.address);

            // Now user1 should be able to call oracle functions
            const participants = [user2.address, user3.address];
            const totalDeposit = DEPOSIT * BigInt(2);

            await wakeUpChallenge.connect(user2).createSocialChallenge(
                participants,
                DEPOSIT,
                WAKE_UP_TIME,
                DURATION,
                { value: totalDeposit }
            );

            await expect(
                wakeUpChallenge.connect(user1).confirmSocialWakeUp(0, user2.address)
            ).to.not.be.reverted;
        });
    });
});
