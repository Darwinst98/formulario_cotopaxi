import React from 'react';
import AlertRoja from '../imagenes/alert_roja.jpeg';
import AlertAmarilla from '../imagenes/alert_amarillo.jpg';
import AlertNaranja from '../imagenes/alert_naranja.jpg';

const Inicio = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div>
                        <h1>Volcán Cotopaxi</h1>
                        <p>El volcan Cotopaxi ha presentado cinco grandes periodos eruptivos: 1532-1534, 1742-1744, 1766-1768, 1853-1854 y 1877-1880. 
                            Dentro de cierto rango, todos los episodios han dado lugar a fenómenos volcánicos muy peligrosos, y no hay duda de que episodios similares volverán a repetirse en el plazo de las décadas. 
                            Los cuatro últimos periodos han dado lugar a muy importantes pérdidas socio-económicas en el Ecuador.</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div id="carouselExampleIndicators" className="carousel slide position-relative" data-ride="carousel">
                        <ol className="carousel-indicators">
                            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                        </ol>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img className="d-block w-100" src={AlertAmarilla} alt="First slide" />
                                <div className="carousel-caption d-none d-md-block">
                                    <h5 className="text-warning">Alerta Amarilla</h5>
                                    <p>Se sugiere preparar y revisar los planes de contingencia y familiar. 
                                        Es necesario tener lista una mochila de emergencia en el caso de las poblaciones o localidades cercanas al volcán.</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img className="d-block w-100" src={AlertNaranja} alt="Second slide" />
                                <div className="carousel-caption d-none d-md-block">
                                    <h5 >Alerta Naranja</h5>
                                    <p>Este nivel anuncia la preparación para una erupción inminente. 
                                        En este grado se recomienda seguir las instrucciones dadas por las autoridades, 
                                        evacuar si se es parte de un grupo vulnerable o si se desea hacerlo voluntariamente.</p>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img className="d-block w-100" src={AlertRoja} alt="Third slide" />
                                <div className="carousel-caption d-none d-md-block">
                                    <h5 className="text-danger">Alerta Roja</h5>
                                    <p> Grado de alerta que significa un aviso de erupción volcánica en curso. 
                                        Las sugerencias son cubrirse y evacuar hacia sitios seguros, aplicar plan de contingencia y llevar mochila de emergencia.</p>
                                </div>
                            </div>
                        </div>
                        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inicio;
