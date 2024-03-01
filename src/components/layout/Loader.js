import styles from './Loader.module.css'

import loading from '../../img/loading.svg'

function Loader(){
    return (
        <div className={styles.loader_container}>
            <img className={styles.loader} src={loading} alt='loading'/>
        </div>
    )
}

export default Loader