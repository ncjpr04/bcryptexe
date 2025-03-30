import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { FitnessChallenges } from "../target/types/fitness_challenges";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { expect } from "chai";
import { BN } from "bn.js";

describe("fitness_challenges", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FitnessChallenges as Program<FitnessChallenges>;
  const creator = anchor.web3.Keypair.generate();
  const user = anchor.web3.Keypair.generate();
  
  // Challenge details
  const challengeId = "test-challenge-123";
  const title = "30-Day Fitness Challenge";
  const entryFee = new BN(1000000); // 0.001 SOL in lamports
  const prizePool = new BN(5000000); // 0.005 SOL in lamports
  const maxParticipants = 10;
  const now = Math.floor(Date.now() / 1000);
  const startTimestamp = now;
  const deadlineTimestamp = now + 86400 * 7; // 7 days from now
  
  // User details
  const userFirebaseUid = "firebase-user-123";
  
  // PDA for challenge
  let challengePda: PublicKey;
  let challengeBump: number;
  
  // PDA for participant
  let participantPda: PublicKey;
  let participantBump: number;
  
  before(async () => {
    // Airdrop SOL to creator and user
    await provider.connection.requestAirdrop(
      creator.publicKey,
      100 * anchor.web3.LAMPORTS_PER_SOL
    );
    
    await provider.connection.requestAirdrop(
      user.publicKey,
      100 * anchor.web3.LAMPORTS_PER_SOL
    );
    
    // Sleep to allow time for the airdrop to complete
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // Derive PDAs
    [challengePda, challengeBump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("challenge"),
        Buffer.from(challengeId),
      ],
      program.programId
    );
    
    [participantPda, participantBump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("participant"),
        challengePda.toBuffer(),
        user.publicKey.toBuffer(),
      ],
      program.programId
    );
  });

  it("Initialize Challenge", async () => {
    try {
      const tx = await program.methods
        .initializeChallenge(
          challengeId,
          title,
          entryFee,
          prizePool,
          maxParticipants,
          new BN(deadlineTimestamp),
          new BN(startTimestamp)
        )
        .accounts({
          challenge: challengePda,
          creator: creator.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
      
      console.log("Challenge initialized with transaction signature", tx);
      
      // Fetch the challenge account
      const challengeAccount = await program.account.challenge.fetch(challengePda);
      
      // Verify the data
      expect(challengeAccount.challengeId).to.equal(challengeId);
      expect(challengeAccount.title).to.equal(title);
      expect(challengeAccount.entryFee.toString()).to.equal(entryFee.toString());
      expect(challengeAccount.prizePool.toString()).to.equal(prizePool.toString());
      expect(challengeAccount.maxParticipants).to.equal(maxParticipants);
      expect(challengeAccount.currentParticipants).to.equal(0);
      expect(challengeAccount.deadlineTimestamp.toString()).to.equal(new BN(deadlineTimestamp).toString());
      expect(challengeAccount.startTimestamp.toString()).to.equal(new BN(startTimestamp).toString());
      expect(challengeAccount.isActive).to.be.true;
      expect(challengeAccount.isCancelled).to.be.false;
      expect(challengeAccount.creator.toString()).to.equal(creator.publicKey.toString());
    } catch (err) {
      console.error("Error initializing challenge:", err);
      throw err;
    }
  });

  it("Join Challenge", async () => {
    try {
      const tx = await program.methods
        .joinChallenge(userFirebaseUid)
        .accounts({
          challenge: challengePda,
          participant: participantPda,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();
      
      console.log("Challenge joined with transaction signature", tx);
      
      // Fetch the challenge account
      const challengeAccount = await program.account.challenge.fetch(challengePda);
      
      // Verify the data
      expect(challengeAccount.currentParticipants).to.equal(1);
      expect(challengeAccount.prizePool.toString()).to.equal(
        (new BN(prizePool).add(entryFee)).toString()
      );
      
      // Fetch the participant account
      const participantAccount = await program.account.participant.fetch(participantPda);
      
      // Verify the data
      expect(participantAccount.challenge.toString()).to.equal(challengePda.toString());
      expect(participantAccount.user.toString()).to.equal(user.publicKey.toString());
      expect(participantAccount.hasJoined).to.be.true;
      expect(participantAccount.hasCompleted).to.be.false;
      expect(participantAccount.firebaseUid).to.equal(userFirebaseUid);
    } catch (err) {
      console.error("Error joining challenge:", err);
      throw err;
    }
  });

  it("Should fail if user tries to join twice", async () => {
    try {
      await program.methods
        .joinChallenge(userFirebaseUid)
        .accounts({
          challenge: challengePda,
          participant: participantPda,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();
      
      // If we reach here, the test should fail
      expect.fail("Expected error for already joined challenge");
    } catch (err) {
      // Expect an error with a specific message
      expect(err.toString()).to.include("AlreadyJoined");
    }
  });

  it("Complete Challenge", async () => {
    // Create a list of winner positions (just the user in this case)
    const winnerPositions = [user.publicKey];
    
    try {
      const tx = await program.methods
        .completeChallenge(winnerPositions)
        .accounts({
          challenge: challengePda,
          creator: creator.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
      
      console.log("Challenge completed with transaction signature", tx);
      
      // Fetch the challenge account
      const challengeAccount = await program.account.challenge.fetch(challengePda);
      
      // Verify the data
      expect(challengeAccount.isActive).to.be.false;
    } catch (err) {
      console.error("Error completing challenge:", err);
      throw err;
    }
  });

  it("Cancel Challenge (should fail as already completed)", async () => {
    try {
      await program.methods
        .cancelChallenge()
        .accounts({
          challenge: challengePda,
          creator: creator.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
      
      // If we reach here, the test should fail
      expect.fail("Expected error for already completed challenge");
    } catch (err) {
      // Expect an error with a specific message
      expect(err.toString()).to.include("ChallengeNotActive");
    }
  });

  // Test for a new challenge that gets cancelled
  it("Initialize and Cancel a Challenge", async () => {
    // Create a new challenge with a different ID
    const cancelChallengeId = "cancel-test-challenge";
    
    const [cancelChallengePda] = await PublicKey.findProgramAddress(
      [
        Buffer.from("challenge"),
        Buffer.from(cancelChallengeId),
      ],
      program.programId
    );
    
    // Initialize the challenge
    await program.methods
      .initializeChallenge(
        cancelChallengeId,
        title,
        entryFee,
        prizePool,
        maxParticipants,
        new BN(deadlineTimestamp),
        new BN(startTimestamp)
      )
      .accounts({
        challenge: cancelChallengePda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();
    
    // Cancel the challenge
    try {
      const tx = await program.methods
        .cancelChallenge()
        .accounts({
          challenge: cancelChallengePda,
          creator: creator.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
      
      console.log("Challenge cancelled with transaction signature", tx);
      
      // Fetch the challenge account
      const challengeAccount = await program.account.challenge.fetch(cancelChallengePda);
      
      // Verify the data
      expect(challengeAccount.isActive).to.be.false;
      expect(challengeAccount.isCancelled).to.be.true;
    } catch (err) {
      console.error("Error cancelling challenge:", err);
      throw err;
    }
  });
}); 