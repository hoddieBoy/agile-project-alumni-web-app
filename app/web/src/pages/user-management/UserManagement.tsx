import React, {useState} from 'react';
import {Button, message, Popconfirm, Table, Tag} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import Footer from "components/Footer";
import Header from "components/Header";
import 'pages/user-management/UserManagement.css';

interface User {
    key: string;
    username: string;
    roles: string[];
}

const initialUsers: User[] = [
    {key: '1', username: 'user1', roles: ['admin']},
    {key: '2', username: 'user2', roles: ['editor']},
    {key: '3', username: 'user3', roles: ['viewer']},
];

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);

    const handleDelete = (key: string) => {
        setUsers(users.filter(user => user.key !== key));
        message.success('User deleted successfully');
    };

    const handleCreateUser = () => {
        const newUser: User = {key: `${users.length + 1}`, username: `user${users.length + 1}`, roles: ['viewer']};
        setUsers([...users, newUser]);
        message.success('New user created successfully');
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            // No need to hide; we keep this column visible
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: string[]) => (
                <>
                    {roles.map(role => {
                        let color = 'green';
                        if (role === 'editor') {
                            color = 'blue';
                        } else if (role === 'admin') {
                            color = 'red';
                        }
                        return (
                            <Tag color={color} key={role}>
                                {role.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: User) => (
                <Popconfirm title="Are you sure to delete this user?" onConfirm={() => handleDelete(record.key)}>
                    <Button icon={<DeleteOutlined/>} type="link" danger/>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <Header/>
            <main className="user-management-main">
                <h1 className="user-management-title">Gestion des Utilisateurs</h1>
                <div className="table-responsive">
                    <Table
                        dataSource={users}
                        columns={columns}
                        bordered={true}
                        className="user-management-table"
                        scroll={{x: 600}} // Allow horizontal scroll on small screens
                    />
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    onClick={handleCreateUser}
                    style={{marginTop: 16}}
                    className="create-user-button"
                >
                    Create New User
                </Button>
            </main>
            <Footer/>
        </>
    );
};

export default UserManagementPage;