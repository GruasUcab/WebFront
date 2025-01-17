import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Pagination } from 'antd';
import './sidebar.css';
import Sidebar from '../sidebar';
import Header from '../header';

function VehiculoCRUD() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    marca: '',
    modelo: '',
    placa: '',
    proveedorId: '',
    capacidad: '',
    activo: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const fetchVehiculos = () => {
    fetch(`${API_BASE_URL}/vehiculo`)
      .then((response) => response.json())
      .then((data) => setVehiculos(data))
      .catch((error) => console.error('Error al cargar vehículos:', error));
  };

  const fetchProveedores = () => {
    fetch(`${API_BASE_URL}/proveedor`)
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((error) => console.error('Error al cargar proveedores:', error));
  };

  const handleOpenPopover = (
    data = {
      id: '',
      marca: '',
      modelo: '',
      placa: '',
      proveedorId: '',
      capacidad: '',
      activo: true,
    },
    editing = false
  ) => {
    setFormData(data);
    setIsEditing(editing);
    setIsPopoverOpen(true);

    if (!editing) {
      fetchProveedores();
    }
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
    setFormData({
      id: '',
      marca: '',
      modelo: '',
      placa: '',
      proveedorId: '',
      capacidad: '',
      activo: true,
    });
    setIsEditing(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `${API_BASE_URL}/vehiculo/${formData.id}`
      : `${API_BASE_URL}/vehiculo`;

    const body = isEditing
      ? {
          id: formData.id,
          marca: formData.marca,
          modelo: formData.modelo,
          placa: formData.placa,
          capacidad: parseInt(formData.capacidad, 10),
          activo: formData.activo,
        }
      : {
          marca: formData.marca,
          modelo: formData.modelo,
          placa: formData.placa,
          proveedorId: formData.proveedorId,
          capacidad: parseInt(formData.capacidad, 10),
          activo: formData.activo,
        };

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error al enviar los datos');
        if (response.status !== 204) return response.json();
      })
      .then(() => {
        fetchVehiculos();
        toast.success(isEditing ? 'Vehículo editado exitosamente' : 'Vehículo creado exitosamente');
      })
      .catch((error) => {
        console.error('Error en la operación:', error);
        toast.error('Error al realizar la operación');
      });

    handleClosePopover();
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/vehiculo/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error al eliminar el vehículo');
        fetchVehiculos();
        toast.success('Vehículo eliminado exitosamente');
      })
      .catch((error) => {
        console.error('Error al eliminar el vehículo:', error);
        toast.error('Error al eliminar el vehículo');
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentData = vehiculos.slice(startIndex, startIndex + pageSize);

  return (
    <div className="container">
      <Sidebar />
      <Header />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="main-content">
        <h2>Gruas</h2>
        <div className="add-user-btn-container">
          <button className="add-user-btn" onClick={() => handleOpenPopover()}>
            Agregar Grua
          </button>
        </div>
        <table className="crud-table">
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Placa</th>
              <th>Capacidad</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((vehiculo) => (
              <tr key={vehiculo.id}>
                <td>{vehiculo.marca}</td>
                <td>{vehiculo.modelo}</td>
                <td>{vehiculo.placa}</td>
                <td>{vehiculo.capacidad}</td>
                <td>{vehiculo.activo ? 'Sí' : 'No'}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleOpenPopover(vehiculo, true)}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(vehiculo.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={vehiculos.length}
          onChange={handlePageChange}
        />
      </div>
      {isPopoverOpen && (
        <div className="popover">
          <div className="popover-content">
            <h3>{isEditing ? 'Editar Vehículo' : 'Crear Vehículo'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="marca">Marca</label>
                <input
                  id="marca"
                  name="marca"
                  className="form-input"
                  value={formData.marca}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="modelo">Modelo</label>
                <input
                  id="modelo"
                  name="modelo"
                  className="form-input"
                  value={formData.modelo}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="placa">Placa</label>
                <input
                  id="placa"
                  name="placa"
                  className="form-input"
                  value={formData.placa}
                  onChange={handleFormChange}
                  required
                />
              </div>
              {!isEditing && (
                <div className="form-group">
                  <label htmlFor="proveedorId">Proveedor</label>
                  <select
                    id="proveedorId"
                    name="proveedorId"
                    className="form-input"
                    value={formData.proveedorId}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map((proveedor) => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="capacidad">Capacidad</label>
                <input
                  id="capacidad"
                  name="capacidad"
                  type="number"
                  className="form-input"
                  value={formData.capacidad}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="activo">Activo</label>
                <input
                  id="activo"
                  name="activo"
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData({ ...formData, activo: e.target.checked })
                  }
                />
              </div>
              <button type="submit" className="submit-btn">
                {isEditing ? 'Guardar Cambios' : 'Crear'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleClosePopover}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehiculoCRUD;
