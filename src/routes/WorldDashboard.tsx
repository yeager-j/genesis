import React from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { notification, Spin, Typography } from 'antd';
import { World } from '../lib/types';

const WorldDashboard = () => {
    const { id } = useParams<{ id: string }>();
    const worldRef = useFirestore().collection('worlds').doc(id);
    const { status, data } = useFirestoreDocData<World>(worldRef);

    const updateField = async (field: 'name' | 'description', value: string) => {
        try {
            await worldRef.update({
                [field]: value
            });
        } catch (e) {
            notification.error({
                message: 'Error Updating World!',
                description: JSON.stringify(e)
            });
        }
    };

    const onNameChange = (newName: string) => {
        if (newName) {
            updateField('name', newName);
        }
    };

    const onDescriptionChange = (newDesc: string) => {
        if (newDesc) {
            updateField('description', newDesc);
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
                            onChange: onDescriptionChange,
                            autoSize: { maxRows: 5, minRows: 3 }
                        }}
                    >
                        {data.description}
                    </Typography.Paragraph>
                </>
            )}
        </Spin>
    );
};

export default WorldDashboard;