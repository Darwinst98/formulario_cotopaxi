import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Form, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
export const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();

  const getBodegaId = () => {
    const params = new URLSearchParams(location.search);
    return params.get('Bodega_id');
  };

  const bodegaId = getBodegaId();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/productos/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data);
      const productosFiltrados = response.data.filter(producto => producto.bodega === bodegaId);
      console.log(productosFiltrados);
      setProductos(productosFiltrados);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      message.error('No se pudieron cargar los productos');
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.nombre.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Stock Minimo',
      dataIndex: 'stockMin',
      key: 'stockMin',
    },
    {
      title: 'Stock Maximo',
      dataIndex: 'stockMax',
      key: 'stockMax',
    },
    {
      title: 'Codigo',
      dataIndex: 'codigo',
      key: 'codigo',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Fecha de caducidad',
      dataIndex: 'fechaVencimiento',
      key: 'fechaVencimiento',
      render: (text) => formatDate(text),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/productos/${record._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Producto eliminado con éxito');
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      message.error('No se pudo eliminar el producto');
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem('token');
        const formattedValues = {
          ...values,
          fechaVencimiento: values.fechaVencimiento ? new Date(values.fechaVencimiento).toISOString().split('T')[0] : null
        };
        if (values._id) {
          // Actualizar producto existente
          const { _id, ...productData } = formattedValues; // Extraemos _id y el resto de los datos
          await axios.put(`http://localhost:5000/api/productos/${_id}`,
            { ...productData, bodega: bodegaId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          message.success('Producto actualizado con éxito');
        } else {
          // Crear nuevo producto
          await axios.post('http://localhost:5000/api/productos/register',
            { ...formattedValues, bodega: bodegaId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          message.success('Producto creado con éxito');
        }
        setIsModalVisible(false);
        form.resetFields();
        fetchProductos();
      } catch (error) {
        console.error('Error al guardar producto:', error);
        message.error('No se pudo guardar el producto');
      }
    });
  };

  const handleGoBack = () => {
    navigate(-1); // Navega a la vista anterior
  };


  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Volver
        </button>
      </div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar por nombre"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Producto
        </Button>
      </Space>
      <Table columns={columns} dataSource={productos} rowKey="_id" scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true
        }} />


      <Modal
        title="Producto"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="stockMin" label="Stock Minimo" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="stockMax" label="Stock Maximo" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="codigo" label="Codigo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="descripcion" label="Descripción">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="fechaVencimiento" label="Fecha de vencimiento" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};