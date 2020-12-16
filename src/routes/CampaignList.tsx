import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { Campaign } from '../lib/types';
import { Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

const CampaignList = () => {
    const { id } = useParams<{ id: string }>();
    const campaignsRef = useFirestore()
        .collection('worlds')
        .doc(id)
        .collection('campaigns');
    const { status, data } = useFirestoreCollectionData<Campaign>(campaignsRef, { idField: 'id' });

    const columns: ColumnsType<Campaign> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 300
        },
        {
            title: 'Nemesis NPC',
            dataIndex: 'nemesisNPC',
            key: 'nemesisNPC',
            render: (text, record) => record.nemesisNPC.name,
            width: 150
        },
        {
            title: 'Sentence',
            dataIndex: 'sentence',
            key: 'sentence'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: Campaign) => <Link to={`/worlds/${id}/campaigns/${record.id}`}>View</Link>
        }
    ];

    return (
        <>
            <Typography.Title>Campaigns</Typography.Title>

            <Table columns={columns} dataSource={data} loading={status === 'loading'} rowKey="id" />
        </>
    )
};

export default CampaignList;