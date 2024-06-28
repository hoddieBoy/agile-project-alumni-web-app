import React, {useState,} from 'react';
import {Button, Form, Input, message, Modal, Popconfirm, Select, Table, Tag} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import Footer from 'components/Footer';
import Header from 'components/Header';
import 'pages/user-management/UserManagement.css';
import {useLoaderData} from 'react-router-dom';
import {UserResponse} from '../../payload/response/UserResponse';
import axiosConfig from 'config/axiosConfig';
import AuthenticateResponse from "../../payload/response/AuthenticateResponse";
import {getAccessToken} from "../../utils/Token";

const {Option} = Select;

const createUser = async (user: {
    username: string;
    password: string;
    role: string
}): Promise<AuthenticateResponse> => {
    const response = await axiosConfig.post<AuthenticateResponse>('/auth/register', user, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });

    return response.data;
};

const deleteUser = async (userId: string): Promise<void> => {
    await axiosConfig.delete(`/users/delete-user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${getAccessToken()}`
        }
    });
};

const UserManagementPage: React.FC = () => {
    const initialUsers = useLoaderData() as { users: UserResponse[] };
    const [users, setUsers] = useState<UserResponse[]>(initialUsers.users);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const handleDelete = async (key: string) => {
        try {
            await deleteUser(key);
            setUsers(users.filter(user => user.id !== key));
            message.success('L\'utilisateur a été supprimé avec succès');
        } catch (error) {
            message.error('Échec de la suppression de l\'utilisateur');
        }
    };

    const handleCreateUser = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const newUser = await createUser({
                username: values.username,
                password: values.password,
                role: values.role
            });
            setUsers([...users, {id: newUser.user_id, username: newUser.username, role: form.getFieldValue('role')}]);
            form.resetFields();
            setIsModalVisible(false);
            message.success('Un nouvel utilisateur a été créé avec succès');
        } catch (info) {
            console.log('Validate Failed:', info);
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Utilisateur',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                let color = 'geekblue';
                if (role === 'ADMIN') {
                    color = 'volcano';
                } else if (role === 'USER') {
                    color = 'green';
                }
                return (
                    <Tag color={color} key={role}>
                        {role}
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: any, record: { id: string }) => (
                <Popconfirm
                    title="Êtes-vous sûr de vouloir supprimer cet utilisateur?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Oui"
                    cancelText="Non"
                >
                    <Button
                        type="primary"
                        icon={<DeleteOutlined/>}
                        danger
                    >
                        Supprimer
                    </Button>
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
                        rowKey="id"
                        bordered={true}
                        className="user-management-table"
                        scroll={{x: 600}} // Allow horizontal scroll on small screens
                    />
                </div>
                <div className="create-user-button-container">
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={handleCreateUser}
                        className="create-user-button"
                    >
                        Créer un nouvel utilisateur
                    </Button>
                </div>
            </main>
            <Footer/>
            <Modal
                title="Créer un nouvel utilisateur"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Créer"
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="userForm"
                >
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            {required: true, message: 'Veuillez entrer le nom d\'utilisateur!'},
                            {min: 3, message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères!'},
                            {max: 20, message: 'Le nom d\'utilisateur doit contenir au plus 20 caractères!'}
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {required: true, message: 'Veuillez entrer le mot de passe!'},
                            {min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères!'},
                            {max: 20, message: 'Le mot de passe doit contenir au plus 20 caractères!'},
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,20}$/,
                                message: 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, et un chiffre!'
                            }
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[
                            {required: true, message: 'Veuillez confirmer le mot de passe!'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Les deux mots de passe ne correspondent pas!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{required: true, message: 'Please select the role!'}]}
                    >
                        <Select placeholder="Select a role">
                            <Option value="ADMIN">ADMIN</Option>
                            <Option value="USER">USER</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserManagementPage;
