import React, { CSSProperties } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, useParams, Link, useRouteMatch } from 'react-router-dom';
import WorldList from './routes/WorldList';

import 'antd/dist/antd.css';
import 'react-quill/dist/quill.snow.css';
import { Layout, Menu } from 'antd';
import { BookOutlined, HomeOutlined } from '@ant-design/icons';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { World } from './lib/types';
import WorldDashboard from './routes/WorldDashboard';
import CampaignList from './routes/CampaignList';
import CampaignDashboard from './routes/CampaignDashboard';

const layoutStyles: CSSProperties = {
    height: '100vh'
};

const contentStyles: CSSProperties = {
    backgroundColor: 'white',
    padding: 20
};

const logoStyles: CSSProperties = {
    color: 'white',
    fontFamily: '"Nodesto Caps Condensed", Helvetica, sans-serif',
    fontSize: '3em',
    userSelect: 'none',
    cursor: 'pointer',
    textAlign: 'center'
};

const RootWrapper = (props: { children: any }) => {
    return (
        <Layout style={layoutStyles}>
            <Layout.Content style={{padding: '50px'}}>
                {props.children}
            </Layout.Content>
            <Layout.Footer style={{textAlign: 'center'}}>Created by Jackson Yeager</Layout.Footer>
        </Layout>
    );
};

const WorldWrapper = (props: { children: any }) => {
    const asPath = useRouteMatch();
    const { id } = useParams<{ id: string }>();
    const worldRef = useFirestore().collection('worlds').doc(id);
    const { status, data } = useFirestoreDocData<World>(worldRef);

    const routes = [
        { href: `/worlds/${id}`, title: 'Home', icon: <HomeOutlined /> },
        { href: `/worlds/${id}/campaigns`, title: 'Campaigns', icon: <BookOutlined /> },
        // { href: `/worlds/${id}/organizations`, title: 'Organizations', icon: <CrownOutlined /> },
        // { href: `/worlds/${id}/npcs`, title: 'NPCs', icon: <UserOutlined /> },
        // { href: `/worlds/${id}/monsters`, title: 'Monsters', icon: <BugOutlined /> },
        // { href: `/worlds/${id}/articles`, title: 'Articles', icon: <FileOutlined /> }
    ];

    return (
        <Layout style={layoutStyles}>
            <Layout.Sider>
                <Link to="/">
                    <div style={logoStyles}>{ status === 'success' ? data.name : 'Loading...' }</div>
                </Link>
                <Menu theme="dark" mode="vertical" selectedKeys={[asPath.url]}>
                    {routes.map(route => (
                        <Menu.Item key={route.href} icon={route.icon}>
                            <Link to={route.href}>
                                {route.title}
                            </Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Layout.Sider>

            <Layout>
                <Layout.Content style={{ padding: '50px' }}>
                    <div style={contentStyles}>
                        {props.children}
                    </div>
                </Layout.Content>
                <Layout.Footer style={{ textAlign: 'center' }}>Created by Jackson Yeager</Layout.Footer>
            </Layout>
        </Layout>
    )
}

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact>
                    <RootWrapper>
                        <WorldList/>
                    </RootWrapper>
                </Route>

                <Route path="/worlds/:id" exact>
                    <WorldWrapper>
                        <WorldDashboard />
                    </WorldWrapper>
                </Route>

                <Route path="/worlds/:id/campaigns" exact>
                    <WorldWrapper>
                        <CampaignList />
                    </WorldWrapper>
                </Route>

                <Route path="/worlds/:id/campaigns/:cid" exact>
                    <WorldWrapper>
                        <CampaignDashboard />
                    </WorldWrapper>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
