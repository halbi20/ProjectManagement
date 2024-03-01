import LinkButton from '../layout/LinkButton'
import styles from './Home.module.css'


function Home(){
    return(
        <section className={styles.home_container}>
            <h1>Bem vindo ao <span>Project Management</span></h1>
            <p>Gerenciamento de Projetos</p>
            <LinkButton to='/newproject' text='criar projeto' />
        </section>
    )
}

export default Home