import React, { useState } from 'react';
import { Button, Card, Divider, Empty, Form, Input, List, Modal, notification, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { World } from '../lib/types';

interface CreateWorldForm {
    name: string;
    description: string;
}

const WorldList = () => {
    const worldListRef = useFirestore().collection('worlds');
    const { status, data } = useFirestoreCollectionData<World>(worldListRef, { idField: 'id' });

    const [createWorldForm] = Form.useForm();
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [createModalLoading, setCreateModalLoading] = useState(false);
    const [deletingWorld, setDeletingWorld] = useState<World | undefined>();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteModalLoading, setDeleteModalLoading] = useState(false);

    const showCreateModal = () => {
        setCreateModalVisible(true);
    };

    const showDeleteModal = (id: string) => {
        if (data) {
            setDeletingWorld(data.find(w => w.id === id));
            setDeleteModalVisible(true);
        }
    };

    const handleCreateCancel = () => {
        setCreateModalVisible(false);
        setDeletingWorld(undefined);
    };

    const onCreateWorld = async (data: CreateWorldForm) => {
        setCreateModalLoading(true);

        try {
            await worldListRef.add(data);
        } catch (e) {
            notification.error({
                message: 'Error Creating World!',
                description: e
            });
        } finally {
            setCreateModalLoading(false);
            setCreateModalVisible(false);
            createWorldForm.resetFields();
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalVisible(false);
    };

    const onDeleteWorld = async () => {
        setDeleteModalLoading(true);

        try {
            await worldListRef.doc(deletingWorld?.id).delete();
        } catch (e) {
            notification.error({
                message: 'Error Deleting World!',
                description: e
            });
        } finally {
            setDeleteModalLoading(false);
            setDeleteModalVisible(false);
            setDeletingWorld(undefined);
        }
    };

    return (
        <>
            <Modal
                title="Create World"
                visible={createModalVisible}
                onOk={createWorldForm.submit}
                onCancel={handleCreateCancel}
                confirmLoading={createModalLoading}
            >
                <Form
                    form={createWorldForm}
                    onFinish={onCreateWorld}
                    layout="vertical"
                    name="test"
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Are you sure?"
                visible={deleteModalVisible}
                onOk={onDeleteWorld}
                onCancel={handleDeleteCancel}
                confirmLoading={deleteModalLoading}
            >
                Deleting a World is irreversible. Are you sure you want to delete your World?
            </Modal>

            <Typography.Title style={{ textAlign: 'center' }}>Welcome to Genesis</Typography.Title>

            <List
                grid={{ gutter: 16, column: 4 }}
                loading={status === 'loading'}
                dataSource={data}
                locale={{
                    emptyText: <Empty description="There are no Worlds. Why not make one?" />
                }}
                renderItem={item => (
                    <List.Item>
                        <Card
                            actions={[
                                <Link to={'/worlds/' + item.id}>
                                    <EyeOutlined />
                                </Link>,
                                <DeleteOutlined onClick={() => showDeleteModal(item.id)} />
                            ]}
                        >
                            <List.Item.Meta
                                title={item.name}
                                description={item.description}
                            />
                        </Card>
                    </List.Item>
                )}
            />

            <Divider>
                <Button shape="circle" size="large" onClick={showCreateModal}>
                    <PlusOutlined />
                </Button>
            </Divider>
        </>
    )
}

export default WorldList;