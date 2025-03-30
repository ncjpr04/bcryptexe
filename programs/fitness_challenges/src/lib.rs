use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    program::invoke,
    system_instruction,
};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod fitness_challenges {
    use super::*;

    // Initialize a new challenge
    pub fn initialize_challenge(
        ctx: Context<InitializeChallenge>,
        challenge_id: String,
        title: String,
        entry_fee: u64,
        prize_pool: u64,
        max_participants: u32,
        deadline_timestamp: i64,
        start_timestamp: i64,
    ) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;
        let creator = &ctx.accounts.creator;

        // Initialize the challenge account
        challenge.creator = creator.key();
        challenge.challenge_id = challenge_id;
        challenge.title = title;
        challenge.entry_fee = entry_fee;
        challenge.prize_pool = prize_pool;
        challenge.max_participants = max_participants;
        challenge.current_participants = 0;
        challenge.deadline_timestamp = deadline_timestamp;
        challenge.start_timestamp = start_timestamp;
        challenge.is_active = true;
        challenge.is_cancelled = false;
        challenge.bump = *ctx.bumps.get("challenge").unwrap();

        // Log the creation for off-chain integration
        emit!(ChallengeCreatedEvent {
            challenge_pubkey: challenge.key(),
            challenge_id: challenge.challenge_id.clone(),
            creator: creator.key(),
            entry_fee,
            prize_pool,
            max_participants,
            deadline_timestamp,
            start_timestamp,
        });

        Ok(())
    }

    // Join a challenge by paying the entry fee
    pub fn join_challenge(ctx: Context<JoinChallenge>, user_firebase_uid: String) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;
        let participant = &mut ctx.accounts.participant;
        let user = &ctx.accounts.user;
        let system_program = &ctx.accounts.system_program;

        // Verify the challenge is still open
        require!(challenge.is_active, ErrorCode::ChallengeNotActive);
        require!(!challenge.is_cancelled, ErrorCode::ChallengeCancelled);
        
        // Check that the challenge is not full
        require!(
            challenge.current_participants < challenge.max_participants,
            ErrorCode::ChallengeFull
        );
        
        // Check deadline
        let clock = Clock::get()?;
        require!(
            clock.unix_timestamp <= challenge.deadline_timestamp,
            ErrorCode::DeadlinePassed
        );

        // Check that the user hasn't already joined
        require!(!participant.has_joined, ErrorCode::AlreadyJoined);

        // Transfer the entry fee from the user to the PDA
        invoke(
            &system_instruction::transfer(
                &user.key(),
                &challenge.key(),
                challenge.entry_fee,
            ),
            &[
                user.to_account_info(),
                challenge.to_account_info(),
                system_program.to_account_info(),
            ],
        )?;

        // Update the participant info
        participant.challenge = challenge.key();
        participant.user = user.key();
        participant.joined_at = clock.unix_timestamp;
        participant.has_joined = true;
        participant.has_completed = false;
        participant.firebase_uid = user_firebase_uid;
        participant.bump = *ctx.bumps.get("participant").unwrap();

        // Increment the participant count
        challenge.current_participants += 1;
        challenge.prize_pool += challenge.entry_fee;

        // Emit event for off-chain integration
        emit!(ChallengeJoinedEvent {
            challenge_pubkey: challenge.key(),
            challenge_id: challenge.challenge_id.clone(),
            user: user.key(),
            firebase_uid: participant.firebase_uid.clone(),
            entry_fee: challenge.entry_fee,
            joined_at: participant.joined_at,
        });

        Ok(())
    }

    // Complete a challenge (to be called by authorized oracle)
    pub fn complete_challenge(ctx: Context<CompleteChallenge>, winner_positions: Vec<Pubkey>) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;
        
        // Verify the challenge is active
        require!(challenge.is_active, ErrorCode::ChallengeNotActive);
        require!(!challenge.is_cancelled, ErrorCode::ChallengeCancelled);
        
        // Verify the caller is the creator
        require!(
            ctx.accounts.creator.key() == challenge.creator,
            ErrorCode::Unauthorized
        );
        
        // Mark the challenge as completed
        challenge.is_active = false;
        
        // Emit event with winners for off-chain processing
        emit!(ChallengeCompletedEvent {
            challenge_pubkey: challenge.key(),
            challenge_id: challenge.challenge_id.clone(),
            winner_positions,
        });
        
        Ok(())
    }

    // Distribute rewards to winners (to be called by authorized oracle)
    pub fn distribute_rewards(
        ctx: Context<DistributeRewards>, 
        winner_pubkeys: Vec<Pubkey>,
        reward_amounts: Vec<u64>,
    ) -> Result<()> {
        let challenge = &ctx.accounts.challenge;
        
        // Verify the challenge is not active (completed)
        require!(!challenge.is_active, ErrorCode::ChallengeStillActive);
        
        // Verify the caller is the creator
        require!(
            ctx.accounts.creator.key() == challenge.creator,
            ErrorCode::Unauthorized
        );
        
        // Verify input arrays have the same length
        require!(
            winner_pubkeys.len() == reward_amounts.len(),
            ErrorCode::InvalidInput
        );
        
        // Calculate total rewards to ensure we're not overspending
        let mut total_rewards = 0;
        for amount in &reward_amounts {
            total_rewards += amount;
        }
        
        // Ensure we're not distributing more than the prize pool
        require!(
            total_rewards <= challenge.prize_pool,
            ErrorCode::InsufficientFunds
        );
        
        // Distribute rewards
        for i in 0..winner_pubkeys.len() {
            // Get winner account
            let winner_info = winner_pubkeys[i];
            let reward_amount = reward_amounts[i];
            
            // Transfer reward to the winner
            // Note: In a production environment, these would need to be done with a CPI
            // For now, we'll just emit an event for off-chain processing
            
            emit!(RewardDistributedEvent {
                challenge_pubkey: challenge.key(),
                challenge_id: challenge.challenge_id.clone(),
                winner: winner_info,
                amount: reward_amount,
            });
        }
        
        Ok(())
    }

    // Cancel a challenge (only by creator)
    pub fn cancel_challenge(ctx: Context<CancelChallenge>) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;
        
        // Verify the challenge is still active
        require!(challenge.is_active, ErrorCode::ChallengeNotActive);
        
        // Verify the caller is the creator
        require!(
            ctx.accounts.creator.key() == challenge.creator,
            ErrorCode::Unauthorized
        );
        
        // Mark the challenge as cancelled
        challenge.is_active = false;
        challenge.is_cancelled = true;
        
        // Emit event for off-chain processing
        emit!(ChallengeCancelledEvent {
            challenge_pubkey: challenge.key(),
            challenge_id: challenge.challenge_id.clone(),
        });
        
        Ok(())
    }

    // Refund participants after cancellation
    pub fn refund_participant(ctx: Context<RefundParticipant>) -> Result<()> {
        let challenge = &ctx.accounts.challenge;
        let participant = &mut ctx.accounts.participant;
        let user = &ctx.accounts.user;
        
        // Verify the challenge is cancelled
        require!(challenge.is_cancelled, ErrorCode::ChallengeNotCancelled);
        
        // Verify the participant has joined and not been refunded
        require!(participant.has_joined, ErrorCode::NotParticipant);
        require!(!participant.has_completed, ErrorCode::AlreadyRefunded);
        
        // Mark the participant as refunded
        participant.has_completed = true;
        
        // Emit refund event for off-chain processing
        emit!(ParticipantRefundedEvent {
            challenge_pubkey: challenge.key(),
            challenge_id: challenge.challenge_id.clone(),
            user: user.key(),
            amount: challenge.entry_fee,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(challenge_id: String)]
pub struct InitializeChallenge<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + Challenge::SPACE,
        seeds = [b"challenge", challenge_id.as_bytes()],
        bump
    )]
    pub challenge: Account<'info, Challenge>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(user_firebase_uid: String)]
pub struct JoinChallenge<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + Participant::SPACE,
        seeds = [b"participant", challenge.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub participant: Account<'info, Participant>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteChallenge<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,
    
    #[account(
        constraint = creator.key() == challenge.creator @ ErrorCode::Unauthorized
    )]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DistributeRewards<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,
    
    #[account(
        constraint = creator.key() == challenge.creator @ ErrorCode::Unauthorized
    )]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelChallenge<'info> {
    #[account(
        mut,
        constraint = challenge.creator == creator.key() @ ErrorCode::Unauthorized
    )]
    pub challenge: Account<'info, Challenge>,
    
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RefundParticipant<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,
    
    #[account(
        mut,
        seeds = [b"participant", challenge.key().as_ref(), user.key().as_ref()],
        bump = participant.bump,
        constraint = participant.user == user.key() @ ErrorCode::Unauthorized
    )]
    pub participant: Account<'info, Participant>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Challenge {
    pub creator: Pubkey,
    #[max_len(64)]
    pub challenge_id: String,  // Firebase ID
    #[max_len(100)]
    pub title: String,
    pub entry_fee: u64,
    pub prize_pool: u64,
    pub max_participants: u32,
    pub current_participants: u32,
    pub deadline_timestamp: i64,
    pub start_timestamp: i64,
    pub is_active: bool,
    pub is_cancelled: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Participant {
    pub challenge: Pubkey,
    pub user: Pubkey,
    pub joined_at: i64,
    pub has_joined: bool,
    pub has_completed: bool,
    #[max_len(64)]
    pub firebase_uid: String, // Firebase user ID
    pub bump: u8,
}

#[event]
pub struct ChallengeCreatedEvent {
    pub challenge_pubkey: Pubkey,
    pub challenge_id: String,
    pub creator: Pubkey,
    pub entry_fee: u64,
    pub prize_pool: u64,
    pub max_participants: u32,
    pub deadline_timestamp: i64,
    pub start_timestamp: i64,
}

#[event]
pub struct ChallengeJoinedEvent {
    pub challenge_pubkey: Pubkey,
    pub challenge_id: String,
    pub user: Pubkey,
    pub firebase_uid: String,
    pub entry_fee: u64,
    pub joined_at: i64,
}

#[event]
pub struct ChallengeCompletedEvent {
    pub challenge_pubkey: Pubkey,
    pub challenge_id: String,
    pub winner_positions: Vec<Pubkey>,
}

#[event]
pub struct RewardDistributedEvent {
    pub challenge_pubkey: Pubkey,
    pub challenge_id: String,
    pub winner: Pubkey,
    pub amount: u64,
}

#[event]
pub struct ChallengeCancelledEvent {
    pub challenge_pubkey: Pubkey,
    pub challenge_id: String,
}

#[event]
pub struct ParticipantRefundedEvent {
    pub challenge_pubkey: Pubkey,
    pub challenge_id: String,
    pub user: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Challenge is not active")]
    ChallengeNotActive,
    
    #[msg("Challenge has been cancelled")]
    ChallengeCancelled,
    
    #[msg("Challenge is full")]
    ChallengeFull,
    
    #[msg("Deadline has passed")]
    DeadlinePassed,
    
    #[msg("Already joined this challenge")]
    AlreadyJoined,
    
    #[msg("Not authorized to perform this action")]
    Unauthorized,
    
    #[msg("Challenge is still active")]
    ChallengeStillActive,
    
    #[msg("Invalid input")]
    InvalidInput,
    
    #[msg("Insufficient funds")]
    InsufficientFunds,
    
    #[msg("Challenge is not cancelled")]
    ChallengeNotCancelled,
    
    #[msg("Not a participant")]
    NotParticipant,
    
    #[msg("Already refunded")]
    AlreadyRefunded,
} 