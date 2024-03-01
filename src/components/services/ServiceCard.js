import { BsFillTrashFill } from 'react-icons/bs'
import styles from '../project/ProjectCard.module.css'

function ServiceCard({id, name, cost, description, handleRemove}){

    function remove(e){
        e.preventDefault()
        handleRemove(id, cost)
    }

    return(
        <div className={styles.card}>
            <h4>{name}</h4>
            <p>
                <span>Valor Total:</span>R${cost}
            </p>
            <p>{description}</p>
            <div className={styles.card_actions}>
                <button onClick={remove}>
                    <BsFillTrashFill/>
                    Excluir
                </button>
            </div>
        </div>
    )
}

export default ServiceCard