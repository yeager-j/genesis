import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const onNPCChange = functions
    .firestore
    .document('/worlds/{worldId}/npcs/{npcId}')
    .onWrite(async (change, context) => {
        const newNpcData = change.after.data();

        if (newNpcData && newNpcData.nemesisForCampaign) {
            const campaignRef = db
                .collection('worlds')
                .doc(context.params.worldId)
                .collection('campaigns')
                .doc(newNpcData.nemesisForCampaign);

            await db.runTransaction(async transaction => {
                transaction.update(campaignRef, {
                    nemesisNPC: {
                        ...newNpcData,
                        id: context.params.npcId
                    }
                });
            });
        }
    });