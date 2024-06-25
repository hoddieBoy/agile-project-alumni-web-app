import React, {useState} from 'react';
import {Button, message, Popconfirm, Table} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import Footer from "../../components/Footer";
import Header from "../../components/Header";

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
        // Logic for creating a new user
        const newUser: User = {key: `${users.length + 1}`, username: `user${users.length + 1}`, roles: ['viewer']};
        setUsers([...users, newUser]);
        message.success('New user created successfully');
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: string[]) => roles.join(', '),
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
            <main>
                <h1 className="user-management-title">User Management</h1>
                <Table dataSource={users} columns={columns} pagination={false} className="user-management-table"/>
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