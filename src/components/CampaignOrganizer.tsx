import React, { ReactText, useState } from 'react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { Act, Chapter, Section } from '../lib/types';
import { Button, Col, notification, Row, Spin, Tree } from 'antd';
import ActEditor from './ActEditor';
import ChapterEditor from './ChapterEditor';
import SectionEditor from './SectionEditor';

type NodeType = 'act' | 'chapter' | 'section';

interface CampaignOrganizerProps {
    worldId: string;
    campaignId: string;
}

interface SectionStructure extends Section {
    leaf: true;
    key: string;
}

interface ChapterStructure extends Chapter {
    children: SectionStructure[];
    key: string;
    leaf: false;
}

interface ActStructure extends Act {
    children: ChapterStructure[];
    key: string;
    leaf: false;
}

interface EditorState {
    type: NodeType;
    data: ActStructure | ChapterStructure | SectionStructure;
    active: boolean;
}

interface ActiveEditorStateAct extends EditorState {
    type: 'act';
    data: ActStructure;
}

interface ActiveEditorStateChapter extends EditorState {
    type: 'chapter';
    data: ChapterStructure;
}

interface ActiveEditorStateSection extends EditorState {
    type: 'section';
    data: SectionStructure;
}

type ActiveEditorState = ActiveEditorStateAct | ActiveEditorStateChapter | ActiveEditorStateSection;

function convertToTree(acts: Act[], chapters: Chapter[], sections: Section[]): ActStructure[] {
    return acts
        .sort((a, b) => a.ordinal - b.ordinal)
        .map(act => {
        return {
            ...act,
            leaf: false,
            key: act.id,
            children: chapters
                .filter(c => c.actId === act.id)
                .sort((a, b) => a.ordinal - b.ordinal)
                .map(chapter => {
                    return {
                        ...chapter,
                        leaf: false,
                        key: chapter.id,
                        children: sections
                            .filter(s => s.chapterId === chapter.id)
                            .sort((a, b) => a.ordinal - b.ordinal)
                            .map(section => {
                            return {
                                ...section,
                                leaf: true,
                                key: section.id
                            };
                        })
                    };
                })
        };
    });
}

const CampaignOrganizer = (props: CampaignOrganizerProps) => {
    const { worldId, campaignId } = props;
    const [editorState, setEditorState] = useState<ActiveEditorState | null>(null);
    const actsRef = useFirestore()
        .collection('worlds')
        .doc(worldId)
        .collection('campaigns')
        .doc(campaignId)
        .collection('acts');

    const chaptersRef = useFirestore()
        .collection('worlds')
        .doc(worldId)
        .collection('campaigns')
        .doc(campaignId)
        .collection('chapters');

    const sectionsRef = useFirestore()
        .collection('worlds')
        .doc(worldId)
        .collection('campaigns')
        .doc(campaignId)
        .collection('sections');

    const { status: actsStatus, data: actsData } = useFirestoreCollectionData<Act>(actsRef, { idField: 'id' });
    const { status: chaptersStatus, data: chaptersData } = useFirestoreCollectionData<Chapter>(chaptersRef, { idField: 'id' });
    const { status: sectionsStatus, data: sectionsData } = useFirestoreCollectionData<Section>(sectionsRef, { idField: 'id' });

    const onTreeSelect = (selectedKeys: ReactText[], e: any) => {
        const depth = e.node.pos.split('-').length;
        const type: NodeType = depth === 2 ? 'act' : depth === 3 ? 'chapter' : 'section';

        setEditorState({
            type,
            data: e.node,
            active: e.selected
        });
    };

    const createAct = async () => {
        try {
            await actsRef.add({
                title: 'New Act',
                summary: '',
                ordinal: Math.max(...actsData.map(a => a.ordinal)) + 1
            });
        } catch (e) {
            notification.error({
                message: 'Error Creating Act!',
                description: e
            });
        }
    }

    const createChapter = async () => {
        if (editorState?.active && editorState.type === 'act') {
            const actId = editorState.data.id;

            try {
                await chaptersRef.add({
                    title: 'New Chapter',
                    summary: '',
                    ordinal: Math.max(...chaptersData.map(a => a.ordinal)) + 1,
                    actId
                });
            } catch (e) {
                notification.error({
                    message: 'Error Creating Chapter!',
                    description: e
                });
            }
        }
    }

    const createSection = async () => {
        if (editorState?.active && editorState.type === 'chapter') {
            const chapterId = editorState.data.id;

            try {
                await sectionsRef.add({
                    title: 'New Section',
                    content: '',
                    ordinal: Math.max(...sectionsData.map(a => a.ordinal)) + 1,
                    chapterId
                });
            } catch (e) {
                notification.error({
                    message: 'Error Creating Section!',
                    description: e
                });
            }
        }
    }

    const isLoading = actsStatus === 'loading' || chaptersStatus === 'loading' || sectionsStatus === 'loading';

    return (
        <Spin spinning={isLoading}>
            <Row>
                <Col span={6}>
                    {actsData && chaptersData && sectionsData && (
                        <>
                            <Tree
                                treeData={convertToTree(actsData, chaptersData, sectionsData)}
                                defaultExpandAll={true}
                                onSelect={onTreeSelect}
                            />

                            {!editorState?.active && (
                                <Button type="link" onClick={createAct}>+ Create Act</Button>
                            )}

                            {editorState?.active && editorState.type === 'act' && (
                                <Button type="link" onClick={createChapter}>+ Create Chapter</Button>
                            )}

                            {editorState?.active && editorState.type === 'chapter' && (
                                <Button type="link" onClick={createSection}>+ Create Section</Button>
                            )}
                        </>
                    )}
                </Col>
                <Col span={18}>
                    {editorState?.active && editorState.type === 'act' && <ActEditor id={editorState.data.id} worldId={worldId} campaignId={campaignId} />}
                    {editorState?.active && editorState.type === 'chapter' && <ChapterEditor id={editorState.data.id} worldId={worldId} campaignId={campaignId} />}
                    {editorState?.active && editorState.type === 'section' && <SectionEditor id={editorState.data.id} worldId={worldId} campaignId={campaignId} />}
                </Col>
            </Row>
        </Spin>
    )
};

export default CampaignOrganizer;