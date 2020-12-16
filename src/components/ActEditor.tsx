import React, { useState } from 'react';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { Act } from '../lib/types';
import { Button, Col, Divider, Input, notification, Row, Skeleton, Space, Typography } from 'antd';
import ContentEditor from './ContentEditor';
import ContentRenderer from './ContentRenderer';

interface ActEditorProps {
    id: string;
    worldId: string;
    campaignId: string;
}

const ActEditor = (props: ActEditorProps) => {
    const { id, worldId, campaignId } = props;
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [ordinal, setOrdinal] = useState(1);
    const actRef = useFirestore()
        .collection('worlds')
        .doc(worldId)
        .collection('campaigns')
        .doc(campaignId)
        .collection('acts')
        .doc(id);

    const { status, data } = useFirestoreDocData<Act>(actRef, { idField: 'id' });

    const onEditingChange = async (checked: boolean) => {
        if (checked) {
            setTitle(data.title);
            setSummary(data.summary);
            setOrdinal(data.ordinal);
        }

        if (!checked) {
            try {
                await actRef.update({
                    title,
                    summary,
                    ordinal
                });
            } catch (e) {
                notification.error({
                    message: 'Unable to save changes!',
                    description: e
                });
            }
        }

        setEditing(checked);
    }

    if (status === 'loading') {
        return <Skeleton active />
    }

    const viewAct = (
        <div>
            <Typography.Title>{data.title}</Typography.Title>
            <ContentRenderer content={data.summary} />

            <Divider />

            <Button onClick={() => onEditingChange(true)}>Edit Content</Button>
        </div>
    );

    const editAct = (
        <div>
            <Space direction="vertical" style={{width: '100%'}}>
                <Row gutter={4}>
                    <Col span={20}>
                        <Input size="large" value={title} onChange={e => setTitle(e.target.value)} />
                    </Col>
                    <Col span={4}>
                        <Input size="large" value={ordinal} onChange={e => setOrdinal(parseInt(e.target.value))} />
                    </Col>
                </Row>

                <ContentEditor value={summary} onChange={setSummary} theme="snow" />
            </Space>

            <Divider />

            <Button type="primary" onClick={() => onEditingChange(false)}>Save Changes</Button>
        </div>
    );

    return (
        <>
            {editing ? editAct : viewAct}
        </>
    )
};

export default ActEditor;