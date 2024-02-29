import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'qrcode'; // Importa la librería para generar códigos QR
import '../styles/navbar.css'

const Formulario = () => {
  const [domicilios, setDomicilios] = useState([]);
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
  const [message, setMessage] = useState('');
  const [formErrors, setFormErrors] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    correoElectronico: '',
    edad: '',
    enfermedadesAlergias: '',
    medicamentos: ''
  });
  const handleCancel = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      cedula: '',
      correoElectronico: '',
      edad: '',
      enfermedadesAlergias: '',
      medicamentos: '',
      domicilio: ''
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
  }, []);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validarCedulaEcuatoriana = (cedula) => {
    // Verificar que la cédula tenga 10 dígitos numéricos
    if (!/^\d{10}$/.test(cedula)) {
      return false;
    }

    // Verificar el dígito verificador
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

  // Ejemplo de uso
  //const cedulaValida = validarCedulaEcuatoriana('0504102443');
  //console.log(cedulaValida); // Devuelve true si la cédula es válida, de lo contrario false


  const validateAge = (age) => {
    const parsedAge = parseInt(age);
    return !isNaN(parsedAge) && parsedAge >= 1 && parsedAge <= 120;
  };

  function validarMayusculaPrimeraLetra(frase) {
    var palabras = frase.split(" ");
    var esValido = true;

    for (var i = 0; i < palabras.length; i++) {
      var palabra = palabras[i];
      // Verificar si la palabra contiene solo letras, incluyendo tildes y la letra "ñ"
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
          errorMessage = 'La primera letra de cada palabra debe empesar con mayuscula, no debe ingresar números';
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

    // Validar aquí que no haya errores en el formulario antes de enviar los datos
    // Por ejemplo, puedes verificar que los campos no estén vacíos y que no haya errores en formErrors
    // Si hay algún error, muestra un mensaje al usuario y no envíes el formulario
    try {
      // Generar el código QR con la información del formulario
      const qrData = JSON.stringify(formData);
      const qrImage = await QRCode.toDataURL(qrData);

      // Subir la imagen del código QR a Cloudinary
      const cloudinaryResponse = await axios.post('https://api.cloudinary.com/v1_1/dlyytqayv/image/upload', {
        file: qrImage,
        upload_preset: 'QRCotopaxi'
      });

      // Guardar la URL de la imagen de Cloudinary en la base de datos
      await axios.post('https://sistema-cotopaxi-backend.onrender.com/api/personas', {
        ...formData,
        qrURL: cloudinaryResponse.data.secure_url // Agregar qrURL al objeto formData
      });

      setMessage('¡Persona registrada correctamente!');
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
      setMessage('Hubo un error al registrar la persona.');
    }
  };

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
              <input type="text" id="correo" name="correoElectronico" placeholder="pruba@gmail.com" value={formData.correoElectronico} onChange={handleChange} className="form-control" required />
              {formErrors.correoElectronico && <p className="text-danger">{formErrors.correoElectronico}</p>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="edad">Edad:</label>
              <input type="number" id="edad" name="edad" placeholder="Ingrese su edad en números" min="1"
                max="120" value={formData.edad} onChange={handleChange} className="form-control" required />
              {formErrors.edad && <p className="text-danger">{formErrors.edad}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="enfermedades">Enfermedades o Alergias:</label>
              <input type="text" id="enfermedades" name="enfermedadesAlergias" placeholder="Ingrese enfermedades o alergias que posea" value={formData.enfermedadesAlergias} onChange={handleChange} className="form-control" />
              {formErrors.enfermedadesAlergias && <p className="text-danger">{formErrors.enfermedadesAlergias}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="medicamento">Medicamento:</label>
              <input type="text" id="medicamento" name="medicamentos" placeholder="Ingrese el tipo demedicamento que toma" value={formData.medicamentos} onChange={handleChange} className="form-control" />
              {formErrors.medicamentos && <p className="text-danger">{formErrors.medicamentos}</p>}
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
            <button type="button" className="btn btn-secondary" onClick={handleCancel}> Cancelar</button>
          </div>
        </div>
        {message && <p className="text-success text-center">{message}</p>}
      </form >
    </div >
  );
};

export default Formulario;