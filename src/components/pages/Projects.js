import Message from "../layout/Message"
import Container from '../layout/Container'
import LinkButton from '../layout/LinkButton'
import Card from '../project/ProjectCard'
import Loader from "../layout/Loader"


import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

import styles from './Projects.module.css'


function Projects(){
    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)
    const [projectMessage, setProjectMessage] = useState("")

    const location = useLocation()
    let message = ''
    if(location.state) {
        message = location.state.message
    }

    useEffect(() =>{
        setTimeout(()=>{
            fetch('http://localhost:6500/projects', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            }).then(res => res.json())
            .then(data =>{
                setProjects(data)
                setRemoveLoading(true)
            })
            .catch(err => console.log(err))
        }, 300)
    }, [])

    function removeProject(id){
        setProjectMessage('')
        fetch(`http://localhost:6500/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
        .then(() => {
            setProjects(projects.filter((project) => project.id !== id))
            setProjectMessage(' Projeto removido com sucesso! ')
        })
        .catch((err) => console.log(err))
    }


    return(
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>Projects</h1>
                <LinkButton to='/newproject' text='criar projeto' />
            </div>
            {message && <Message type="success" msg={message}/>}
            {projectMessage && <Message type="success" msg={projectMessage}/>}
            <Container customClass="start">
                {projects.length > 0 &&
                    projects.map((project) =>(
                        <Card 
                            id={project.id}
                            name={project.name}
                            valorTotal={project.valorTotal}
                            category={project.category.name}
                            key={project.id}
                            handleRemove={removeProject}
                        />
                    ))
                }
                {!removeLoading && <Loader/>}
                {removeLoading && projects.length === 0 &&(
                    <p>Não há projetos cadastrados!!</p>
                )}
            </Container>            
        </div>
    )
}

export default Projects