import styles from './About.module.css';

function About(){
    return (
        <div className={styles.body}>
            <h2>Descripción de la Página</h2>
            <p>Nuestra plataforma es un sistema integral para la gestión de citas médicas que permite a los médicos
                registrar su perfil profesional y a los pacientes agendar consultas de manera rápida y sencilla. Con un
                enfoque en la accesibilidad y eficiencia, ofrecemos una experiencia fluida que conecta a profesionales
                de la salud con personas que requieren atención médica.</p>

            <h2>Visión</h2>
            <p>Ser la plataforma líder en la gestión de citas médicas en línea, facilitando la conexión entre pacientes
                y profesionales de la salud con un sistema intuitivo, seguro y eficiente que mejore el acceso a la
                atención médica.</p>

            <h2>Misión</h2>
            <p>Brindar una solución tecnológica innovadora que optimice la organización de consultas médicas,
                garantizando facilidad de uso para médicos y pacientes, reduciendo tiempos de espera y mejorando la
                calidad del servicio de salud.</p>
        </div>
    );
}
export default About;