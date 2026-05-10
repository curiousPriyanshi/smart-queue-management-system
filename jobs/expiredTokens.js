const cron = require("node-cron");
const Token = require("../models/Token")

const markExpiredTokens = async()=>{
    cron.schedule("*/5 * * * *", async()=>{
        console.log("running cron job to mark expired tokens...")
        const now = new Date();
        const token = await Token.find({status:"missed", rejoinWindowExpiresAt: { $lte: now } });
        if(token.length > 0){

            await Token.updateMany({status:"missed", rejoinWindowExpiresAt: { $lte: now } }, { $set: { status: "expired" } });
            console.log(`updated status of ${token.length} missed tokens.`);
        }else{
            console.log("No expired tokens found.");
        }
    })
}

const cleanupExpiredTokens = async()=>{
    cron.schedule("0 0 * * *", async()=>{
        console.log("running cron job to delete expired tokens...")
        const now = new Date();
        const token = await Token.find({status:"missed", rejoinWindowExpiresAt: { $lte: now } });
        if(token.length > 0){

            await Token.deleteMany({status:"expired", rejoinWindowExpiresAt: { $lte: now } });
            console.log(`deleted status of ${token.length} expired tokens.`);
        }else{
            console.log("No expired tokens found.");
        }
    })
}

module.exports = {markExpiredTokens, cleanupExpiredTokens}