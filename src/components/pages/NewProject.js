import ProjectForm from '../project/ProjectForm'

import {useNavigate} from 'react-router-dom'

import styles from './NewProject.module.css'



function NewProject(){

    const navigate = useNavigate()

    function createPost(project) {

        project.cost  = 0
        project.services = []

        fetch('http://localhost:6500/projects', {
            method: "POST",
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify(project),
        })
        .then((res) => res.json())
        .then((data) =>{
            console.log(data);
            // redirect
            const state = { message: "Projeto criado com sucesso!" };
            navigate("/projects", {state});
        })
        .catch((err) => console.log(err))

    }

    return(
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <ProjectForm handleSubmit={createPost} BtnText="Criar Novo Projeto" />
        </div>
    )
}

export default NewProject