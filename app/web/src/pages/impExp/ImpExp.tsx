import React, {useState} from 'react';
import Header from 'components/Header';
import Footer from 'components/Footer';
import {getAccessToken} from 'utils/Token';
import axiosConfig from '../../config/axiosConfig';
import {Button, Form, Input, message, Modal, Table, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import Papa from 'papaparse';
import './ImpExp.css';

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: string;
    record: any;
    handleSave: (record: any) => void;
}

const generateCSV = async (selectedYear: number) => {
    const accessToken = getAccessToken();
    return await axiosConfig.get(`/generate-csv?year=${selectedYear}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: 'application/octet-stream',
        },
    }).then((response) => {
        return new Blob([response.data], {type: 'text/csv'});
    }).catch((error) => {
        console.error(error);
        return null;
    });
};

const EditableCell: React.FC<EditableCellProps> = ({
                                                       title,
                                                       editable,
                                                       children,
                                                       dataIndex,
                                                       record,
                                                       handleSave,
                                                       ...restProps
                                                   }) => {
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({[dataIndex]: record[dataIndex]});
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form form={form} style={{margin: 0}}>
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input onPressEnter={save} onBlur={save}/>
                </Form.Item>
            </Form>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{paddingRight: 24}}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const AlumniImportExport: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState<number>(2014);
    const [promotionYear, setPromotionYear] = useState<number>(2014);
    const [fileDownload, setFileDownload] = useState<Blob | null>(null);
    const [isErrorOnDownload, setIsErrorOnDownload] = useState<boolean>(false);
    const [fileUpload, setFileUpload] = useState<File | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [csvData, setCsvData] = useState<any[]>([]);

    const handleDownload = async () => {
        const csv = await generateCSV(selectedYear);
        setFileDownload(csv);

        if (csv === null) {
            setIsErrorOnDownload(true);
        }
    };

    const handleFileChange = (info: any) => {
        const file = info.file;
        setFileUpload(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
            Papa.parse(e.target.result, {
                header: true,
                complete: (result) => {
                    const data = result.data.map((row: any) => ({
                        ...row,
                        Sexe: row.Sexe || 'M',
                        Pays: row.Pays || 'FRANCE',
                    }));
                    setCsvData(data);
                    setIsModalVisible(true);
                },
                error: (error) => {
                    message.error(`Error parsing CSV file: ${error.message}`);
                },
            });
        };

        if (file) {
            reader.readAsText(file);
        }
    };

    const handleUpload = async () => {
        if (fileUpload) {
            const accessToken = getAccessToken();
            const formData = new FormData();
            // Save the new file from csvData
            const newFile = new Blob([Papa.unparse(csvData)], {type: 'text/csv'});
            console.log(newFile);
            formData.append('file', newFile);
            formData.append('promotion', promotionYear.toString());

            try {
                await axiosConfig.post('/upload-csv', formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                message.success('File uploaded successfully', 5);
                setIsModalVisible(false);
            } catch (error) {
                message.error('Failed to upload file');
                console.error(error);
            }
        } else {
            message.error('No file selected');
        }
    };

    const handleSave = (row: any) => {
        const newData = [...csvData];
        const index = newData.findIndex((item) => row.Email === item.Email);
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row});
        setCsvData(newData);
    };

    const columns = [
        {title: 'Prenom', dataIndex: 'Prenom', key: 'Prenom', editable: true},
        {title: 'Nom', dataIndex: 'Nom', key: 'Nom', editable: true},
        {title: 'Email', dataIndex: 'Email', key: 'Email', editable: true},
        {title: 'Sexe', dataIndex: 'Sexe', key: 'Sexe', editable: true},
        {
            title: 'Entreprise durant la formation',
            dataIndex: 'Entreprise durant la formation',
            key: 'Entreprise durant la formation',
            editable: true
        },
        {title: 'Entreprise actuelle', dataIndex: 'Entreprise actuelle', key: 'Entreprise actuelle', editable: true},
        {title: 'Site Web', dataIndex: 'Site Web', key: 'Site Web', editable: true},
        {title: 'Ville', dataIndex: 'Ville', key: 'Ville', editable: true},
        {title: 'Pays', dataIndex: 'Pays', key: 'Pays', editable: true},
    ];

    const components = {
        body: {
            cell: EditableCell,
        },
    };

    const columnsWithEdit = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });

    return (
        <>
            <Header />
            <div className="alumni-import-export container text-center my-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="export-section">
                            <h1 className="import-export-title" style={{ color: '#003366' }}>Export</h1>
                            <div className="form-group">
                                <label htmlFor="yearSelect" style={{ color: '#003366' }}>Promotion de l'année: </label>
                                <input
                                    type="number"
                                    id="yearSelect"
                                    className="form-control d-inline-block w-auto mx-2"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                                />
                                <button onClick={handleDownload} className="custom-btn mr-2">
                                    Exporter
                                </button>
                                {fileDownload && (
                                    <a
                                        href={URL.createObjectURL(fileDownload)}
                                        download={`alumni-${selectedYear}.csv`}
                                    >
                                        {`Télécharger alumni-${selectedYear}.csv`}
                                    </a>
                                )}
                                {isErrorOnDownload && (
                                    <p className="text-danger">Nous n'avons pas pu générer le fichier pour l'année
                                        sélectionnée.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="import-section">
                            <h1 className="import-export-title" style={{ color: '#003366' }}>Import</h1>
                            <div className="form-group">
                                <label htmlFor="promotionYear" style={{color: '#003366'}}>Promotion Year: </label>
                                <input
                                    type="number"
                                    id="promotionYear"
                                    className="form-control d-inline-block w-auto mx-2"
                                    value={promotionYear}
                                    onChange={(e) => setPromotionYear(parseInt(e.target.value, 10))}
                                />
                                <Upload
                                    accept=".csv"
                                    beforeUpload={() => false}
                                    onChange={handleFileChange}
                                    maxCount={1}
                                >
                                    <Button icon={<UploadOutlined/>}>Select File</Button>
                                </Upload>
                                <button onClick={handleUpload} className="custom-btn custom-btn-validate mt-3">
                                    Valider
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="CSV Data"
                visible={isModalVisible}
                onOk={handleUpload}
                onCancel={() => setIsModalVisible(false)}
                okText="Upload"
                width="80%"
            >
                <Table
                    components={components}
                    columns={columnsWithEdit}
                    dataSource={csvData}
                    rowKey="Email"
                    pagination={false}
                />
            </Modal>
            <Footer />
        </>
    );
}

export default AlumniImportExport;
