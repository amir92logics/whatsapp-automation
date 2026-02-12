import { PrismaClient } from './src/lib/generated/prisma';

const prisma = new PrismaClient();

async function checkCampaigns() {
    const campaigns = await prisma.campaign.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            notifications: {
                take: 3
            }
        }
    });

    console.log("Recent Campaigns:");
    campaigns.forEach(c => {
        console.log(`[${c.createdAt.toISOString()}] ID: ${c.id} Type: ${c.campaignType} Sent: ${c.sentCount} Failed: ${c.failedCount}`);
        c.notifications.forEach(n => {
            console.log(`  - Notification: ${n.status} (${n.errorMessage || 'No valid error'}) Provider: ${n.providerUsed}`);
        });
    });
}

checkCampaigns()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
