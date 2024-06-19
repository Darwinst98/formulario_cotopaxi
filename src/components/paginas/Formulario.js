import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import '../styles/navbar.css';

const Formulario = () => {
  const [domicilios, setDomicilios] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    correoElectronico: '',
    edad: '',
    enfermedadesAlergias: '',
    medicamentos: '',
    lugarResidencia: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    correoElectronico: '',
    edad: '',
    enfermedadesAlergias: '',
    medicamentos: ''
  });
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorRegistroModalVisible, setErrorRegistroModalVisible] = useState(false);

  const handleCancel = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      cedula: '',
      correoElectronico: '',
      edad: '',
      enfermedadesAlergias: '',
      medicamentos: '',
      lugarResidencia: ''
    });
    setFormErrors({
      nombres: '',
      apellidos: '',
      cedula: '',
      correoElectronico: '',
      edad: '',
      enfermedadesAlergias: '',
      medicamentos: ''
    });
  };

  useEffect(() => {
    const fetchDomicilios = async () => {
      try {
        const response = await axios.get('https://sistema-cotopaxi-backend.onrender.com/api/domicilios');
        setDomicilios(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching domicilios:', error);
      }
    };

    fetchDomicilios();

    const fetchPersonas = async () => {
      try {
        const response = await axios.get('https://sistema-cotopaxi-backend.onrender.com/api/personas');
        setPersonas(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching personas:', error);
      }
    };

    fetchPersonas();
  }, []);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validarCedulaEcuatoriana = (cedula) => {
    if (!/^\d{10}$/.test(cedula)) {
      return false;
    }

    const digitoVerificador = parseInt(cedula.substring(9, 10));
    let suma = 0;
    const longitud = cedula.length - 1;
    for (let i = 0; i < longitud; i++) {
      let numero = parseInt(cedula.charAt(i));
      if (i % 2 === 0) {
        numero *= 2;
        if (numero > 9) {
          numero -= 9;
        }
      }
      suma += numero;
    }

    const resultado = suma % 10 ? 10 - (suma % 10) : 0;

    return resultado === digitoVerificador;
  };

  const validateAge = (age) => {
    const parsedAge = parseInt(age);
    return !isNaN(parsedAge) && parsedAge >= 1 && parsedAge <= 120;
  };

  function validarMayusculaPrimeraLetra(frase) {
    var palabras = frase.split(" ");
    var esValido = true;

    for (var i = 0; i < palabras.length; i++) {
      var palabra = palabras[i];
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+$/.test(palabra)) {
        esValido = false;
        break;
      }
      var primeraLetra = palabra.charAt(0);
      if (primeraLetra !== primeraLetra.toUpperCase()) {
        esValido = false;
        break;
      }
    }

    return esValido;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';

    switch (name) {
      case 'nombres':
      case 'apellidos':
      case 'enfermedadesAlergias':
      case 'medicamentos':
        if (!validarMayusculaPrimeraLetra(value)) {
          errorMessage = 'La primera letra de cada palabra debe empezar con mayúscula y no debe ingresar números';
        }
        break;
      case 'cedula':
        if (!validarCedulaEcuatoriana(value)) {
          errorMessage = 'Ingrese una cédula válida';
        }
        break;
      case 'correoElectronico':
        if (!validateEmail(value)) {
          errorMessage = 'Ingrese un correo electrónico válido';
        }
        break;
      case 'edad':
        if (!validateAge(value)) {
          errorMessage = 'Ingrese una edad válida (entre 1 y 120)';
        }
        break;
      default:
        break;
    }

    setFormData({
      ...formData,
      [name]: value
    });

    setFormErrors({
      ...formErrors,
      [name]: errorMessage
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    Object.values(formErrors).forEach((error) => {
      if (error.length > 0) {
        isValid = false;
      }
    });

    if (!isValid) {
      setErrorModalVisible(true);
      return;
    }

    try {
      const qrData = JSON.stringify(formData);
      const qrImage = await QRCode.toDataURL(qrData);

      const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/dlyytqayv/image/upload', {
        file: qrImage,
        upload_preset: 'QRCotopaxi'
      });

      await axios.post('https://sistema-cotopaxi-backend.onrender.com/api/personas', {
        ...formData,
        qrURL: cloudinaryResponse.data.secure_url
      });

      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        setModalVisible2(true);
      }, 2500);

      setFormData({
        nombres: '',
        apellidos: '',
        cedula: '',
        correoElectronico: '',
        edad: '',
        enfermedadesAlergias: '',
        medicamentos: '',
        lugarResidencia: ''
      });
      setFormErrors({
        nombres: '',
        apellidos: '',
        cedula: '',
        correoElectronico: '',
        edad: '',
        enfermedadesAlergias: '',
        medicamentos: ''
      });
    } catch (error) {
      console.error('Error al registrar persona:', error);
      setErrorRegistroModalVisible(true);
    }
  };

  const [modalVisible2, setModalVisible2] = useState(false);

  return (
    <div className="container mt-5">
      <h2>Regístrate en nuestro sistema</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input type="text" id="nombre" name="nombres" placeholder="Ingrese sus nombres separados por un espacio" value={formData.nombres} onChange={handleChange} className="form-control" required />
              {formErrors.nombres && <p className="text-danger">{formErrors.nombres}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido:</label>
              <input type="text" id="apellido" name="apellidos" placeholder="Ingrese sus apellidos separado por un espacio" value={formData.apellidos} onChange={handleChange} className="form-control" required />
              {formErrors.apellidos && <p className="text-danger">{formErrors.apellidos}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="cedula">Cédula:</label>
              <input type="text" maxLength="10" id="cedula" name="cedula" placeholder="05XXXXXXXX" value={formData.cedula} onChange={handleChange} className="form-control" required />
              {formErrors.cedula && <p className="text-danger">{formErrors.cedula}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico:</label>
              <input type="text" id="correo" name="correoElectronico" placeholder="prueba@gmail.com" value={formData.correoElectronico} onChange={handleChange} className="form-control" required />
              {formErrors.correoElectronico && <p className="text-danger">{formErrors.correoElectronico}</p>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="edad">Edad:</label>
              <input type="number" id="edad" name="edad" placeholder="Ingrese su edad en números" min="1" max="120" value={formData.edad} onChange={handleChange} className="form-control" required />
              {formErrors.edad && <p className="text-danger">{formErrors.edad}</p>}
            </div>
           {/*Select Enfermedades */} 
            <div className="form-group">
              <label htmlFor="enfermedades">Enfermedades o Alergias:</label>
              <select
                id="enfermedades"
                name="enfermedadesAlergias"
                value={formData.enfermedadesAlergias}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Seleccione enfermedad o alergia</option>
                {loading ? (
                  <option disabled>Cargando...</option>
                ) : (
                  personas.map((enfermedad) => (
                    <option key={enfermedad._id} value={enfermedad._id}>
                      {enfermedad.enfermedadesAlergias}
                    </option>
                  ))
                )}
              </select>
            </div>
            {/* Select Medicaentos*/}
            <div className="form-group">
              <label htmlFor="medicamento">Medicamento:</label>
              <select
                id="medicamento"
                name="medicamentos"
                value={formData.medicamentos}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Seleccione su medicamento</option>
                {loading ? (
                  <option disabled>Cargando medicamentos...</option>
                ) : (
                  personas.map((medicamento) => (
                    <option key={medicamento._id} value={medicamento._id}>
                      {medicamento.medicamentos}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="residencia">Lugar de Residencia:</label>
              <select
                id="residencia"
                name="lugarResidencia"
                value={formData.lugarResidencia}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Seleccione su localidad</option>
                {loading ? (
                  <option disabled>Cargando domicilios...</option>
                ) : (
                  domicilios.map((domicilio) => (
                    <option key={domicilio._id} value={domicilio._id}>
                      {domicilio.nombre}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>
        <div className="form-group text-center">
          <div className="button-container">
            <button type="submit" className="btn btn-success">Registrar</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
          </div>
        </div>
      </form>

      {/* Modal de éxito */}
      <div className={`modal fade ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">¡Registro exitoso!</h5>
              <button type="button" className="btn-close" onClick={() => setModalVisible(false)}></button>
            </div>
            <div className="modal-body">
              <p>Felicidades, te has registrado con éxito.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setModalVisible(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de éxito 2 */}
      <div className={`modal fade ${modalVisible2 ? 'show' : ''}`} style={{ display: modalVisible2 ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">¡Recomendación!</h5>
              <button type="button" className="btn-close" onClick={() => setModalVisible2(false)}></button>
            </div>
            <div className="modal-body">
              <p>Recuerda los datos ingresados en los campos Nombre y Cédula son tus credenciales de acceso a la App Móvil.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setModalVisible2(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de error */}
      <div className={`modal fade ${errorModalVisible ? 'show' : ''}`} style={{ display: errorModalVisible ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">¡Error!</h5>
              <button type="button" className="btn-close" onClick={() => setErrorModalVisible(false)}></button>
            </div>
            <div className="modal-body">
              <p>No cumples con todas las restricciones.</p>
              <p>Intenta nuevamente.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setErrorModalVisible(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de error de registro */}
      <div className={`modal fade ${errorRegistroModalVisible ? 'show' : ''}`} style={{ display: errorRegistroModalVisible ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">¡Error de Registro!</h5>
              <button type="button" className="btn-close" onClick={() => setErrorRegistroModalVisible(false)}></button>
            </div>
            <div className="modal-body">
              <p>Este usuario ya se encuentra registrado en el sistema.</p>
              <p>Verifica tu número de cédula o correo electrónico</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setErrorRegistroModalVisible(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formulario;
