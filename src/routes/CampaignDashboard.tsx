import React from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { Divider, notification, Spin, Typography } from 'antd';
import { Campaign } from '../lib/types';
import CampaignOrganizer from '../components/CampaignOrganizer';

const CampaignDashboard = () => {
    const { id, cid } = useParams<{ id: string, cid: string }>();
    const campaignRef = useFirestore()
        .collection('worlds')
        .doc(id)
        .collection('campaigns')
        .doc(cid);
    const { status, data } = useFirestoreDocData<Campaign>(campaignRef, { idField: 'id' });

    const updateField = async (field: 'name' | 'sentence', value: string) => {
        try {
            await campaignRef.update({
                [field]: value
            });
        } catch (e) {
            notification.error({
                message: 'Error Updating Campaign!',
                description: JSON.stringify(e)
            });
        }
    };

    const onNameChange = (newName: string) => {
        if (newName) {
            updateField('name', newName);
        }
    };

    const onSentenceChange = (newDesc: string) => {
        if (newDesc) {
            updateField('sentence', newDesc);
        }
    };

    return (
        <Spin spinning={status === 'loading'}>
            {status === 'success' && (
                <>
                    <Typography.Title
                        style={{ textAlign: 'center', marginTop: 10 }}
                        editable={{
                            onChange: onNameChange
                        }}
                    >{data.name}</Typography.Title>

                    <Typography.Paragraph
                        style={{ textAlign: 'center', margin: 'auto', width: '50%' }}
                        editable={{
                            onChange: onSentenceChange,
                            autoSize: { maxRows: 5, minRows: 3 }
                        }}
                    >
                        {data.sentence}
                    </Typography.Paragraph>

                    <Divider />

                    <CampaignOrganizer worldId={id} campaignId={cid} />
                </>
            )}
        </Spin>
    )
};

export default CampaignDashboard;