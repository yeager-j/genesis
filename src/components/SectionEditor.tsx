import React, { useState } from 'react';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { Section } from '../lib/types';
import { Button, Col, Divider, Image, Input, notification, Row, Skeleton, Space, Typography } from 'antd';
import ContentEditor from './ContentEditor';
import ContentRenderer from './ContentRenderer';

interface SectionEditorProps {
    id: string;
    worldId: string;
    campaignId: string;
}

const SectionEditor = (props: SectionEditorProps) => {
    const { id, worldId, campaignId } = props;
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [ordinal, setOrdinal] = useState(1);
    const [mapUrl, setMapUrl] = useState('');
    const sectionRef = useFirestore()
        .collection('worlds')
        .doc(worldId)
        .collection('campaigns')
        .doc(campaignId)
        .collection('sections')
        .doc(id);

    const { status, data } = useFirestoreDocData<Section>(sectionRef, { idField: 'id' });

    const onEditingChange = async (checked: boolean) => {
        if (checked) {
            setTitle(data.title);
            setContent(data.content);
            setOrdinal(data.ordinal);
            setMapUrl(data.mapUrl);
        }

        if (!checked) {
            try {
                await sectionRef.update({
                    title,
                    content,
                    ordinal,
                    mapUrl
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

    const viewSection = (
        <div>
            <Typography.Title>{data.title}</Typography.Title>

            {data.mapUrl && (
                <Row gutter={8}>
                    <Col span={12}>
                        <ContentRenderer content={data.content} />
                    </Col>
                    <Col span={12}>
                        <Image src={data.mapUrl} />
                    </Col>
                </Row>
            )}

            {!data.mapUrl && (
                <ContentRenderer content={data.content} />
            )}

            <Divider />

            <Button onClick={() => onEditingChange(true)}>Edit Content</Button>
        </div>
    );

    const editSection = (
        <div>
            <Space direction="vertical" style={{width: '100%'}}>
                <Row gutter={4}>
                    <Col span={12}>
                        <Input size="large" value={title} onChange={e => setTitle(e.target.value)} />
                    </Col>
                    <Col span={6}>
                        <Input size="large" value={ordinal} onChange={e => setOrdinal(parseInt(e.target.value))} />
                    </Col>
                    <Col span={6}>
                        <Input size="large" value={mapUrl} onChange={e => setMapUrl(e.target.value)} />
                    </Col>
                </Row>

                <ContentEditor value={content} onChange={setContent} theme="snow" />
            </Space>

            <Divider />

            <Button type="primary" onClick={() => onEditingChange(false)}>Save Changes</Button>
        </div>
    );

    return (
        <>
            {editing ? editSection : viewSection}
        </>
    )
};

export default SectionEditor;