import React, { useState } from 'react';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { Chapter } from '../lib/types';
import { Button, Col, Divider, Input, notification, Row, Skeleton, Space, Typography } from 'antd';
import ContentRenderer from './ContentRenderer';
import ContentEditor from './ContentEditor';

interface ChapterEditorProps {
    id: string;
    worldId: string;
    campaignId: string;
}

// Before you say anything, I anticipate adding behavior that differentiates Chapters and Acts.
// I could, if I wanted, combine this into one Component that supports both.
const ChapterEditor = (props: ChapterEditorProps) => {
    const { id, worldId, campaignId } = props;
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [ordinal, setOrdinal] = useState(1);
    const chapterRef = useFirestore()
        .collection('worlds')
        .doc(worldId)
        .collection('campaigns')
        .doc(campaignId)
        .collection('chapters')
        .doc(id);

    const { status, data } = useFirestoreDocData<Chapter>(chapterRef, { idField: 'id' });

    const onEditingChange = async (checked: boolean) => {
        if (checked) {
            setTitle(data.title);
            setSummary(data.summary);
            setOrdinal(data.ordinal);
        }

        if (!checked) {
            try {
                await chapterRef.update({
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

    const viewChapter = (
        <div>
            <Typography.Title>{data.title}</Typography.Title>
            <ContentRenderer content={data.summary} />

            <Divider />

            <Button onClick={() => onEditingChange(true)}>Edit Content</Button>
        </div>
    );

    const editChapter = (
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
            {editing ? editChapter : viewChapter}
        </>
    )
};

export default ChapterEditor;