const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEPLOY_SCRIPT = `
console.log("Deploying Fitness Challenges contract to Solana...");

// Build the program
try {
  console.log("\\nBuilding the program...");
  execSync("anchor build", { stdio: "inherit" });
  console.log("✅ Build successful");
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}

// Get the program ID
let programId;
try {
  console.log("\\nReading program ID...");
  const targetPath = path.join(__dirname, "target/idl/fitness_challenges.json");
  const idlContent = fs.readFileSync(targetPath, "utf8");
  const idlJson = JSON.parse(idlContent);
  programId = idlJson.metadata.address;
  console.log("✅ Program ID:", programId);
} catch (error) {
  console.error("❌ Failed to read program ID:", error);
  process.exit(1);
}

// Deploy to devnet
try {
  console.log("\\nDeploying to Solana devnet...");
  execSync("anchor deploy --provider.cluster devnet", { stdio: "inherit" });
  console.log("\\n✅ Deployment successful!");
  
  // Copy IDL to the frontend directory
  const idlSource = path.join(__dirname, "target/idl/fitness_challenges.json");
  const idlDest = path.join(__dirname, "src/lib/idl/fitness_challenges.json");
  
  // Ensure the destination directory exists
  const idlDir = path.dirname(idlDest);
  if (!fs.existsSync(idlDir)) {
    fs.mkdirSync(idlDir, { recursive: true });
  }
  
  fs.copyFileSync(idlSource, idlDest);
  console.log("✅ IDL file copied to frontend:");
  console.log(idlDest);
  
  // Update the program ID in the frontend code
  const solanaClientPath = path.join(__dirname, "src/lib/solanaClient.ts");
  let solanaClientContent = fs.readFileSync(solanaClientPath, "utf8");
  
  // Replace the program ID
  solanaClientContent = solanaClientContent.replace(
    /const PROGRAM_ID = new PublicKey\((['"]).*?\1\);/,
    `const PROGRAM_ID = new PublicKey('${programId}');`
  );
  
  fs.writeFileSync(solanaClientPath, solanaClientContent);
  console.log("✅ Program ID updated in solanaClient.ts");
  
  console.log("\n🚀 Deployment complete! Your contract is now live on Solana devnet.");
  console.log(`Program ID: ${programId}`);
} catch (error) {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
}
`;

// Create the deploy script file
fs.writeFileSync('deploy.js', DEPLOY_SCRIPT);
console.log('Deployment script created at ./deploy.js');
console.log('Run with: node deploy.js'); 