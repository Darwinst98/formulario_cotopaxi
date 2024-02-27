// Procesos.js

// Función para calcular la distancia entre dos puntos geográficos utilizando la fórmula de Haversine
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const radioTierra = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = radioTierra * c; // Distancia en kilómetros
    return distancia;
};

// Función para calcular el albergue más cercano
const calcularAlbergueMasCercano = (formData, albergues) => {
    const { lugarResidencia } = formData;

    // Obtener las coordenadas del domicilio
    const coordenadasDomicilio = albergues.find(albergue => albergue._id === lugarResidencia);
    const latitudDomicilio = coordenadasDomicilio.coordenadaX;
    const longitudDomicilio = coordenadasDomicilio.coordenadaY;

    // Calcular la distancia a cada albergue y encontrar el más cercano
    let albergueMasCercano;
    let distanciaMinima = Number.MAX_SAFE_INTEGER;

    albergues.forEach(albergue => {
        const distancia = calcularDistancia(latitudDomicilio, longitudDomicilio, albergue.coordenadaX, albergue.coordenadaY);
        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            albergueMasCercano = albergue;
        }
    });

    return albergueMasCercano;
};

export default calcularAlbergueMasCercano;
