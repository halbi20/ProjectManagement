import styles from './Project.module.css'
import Loader from '../layout/Loader'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../services/ServiceForm'
import ServiceCard from '../services/ServiceCard'


import { parse, v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Project(){
    const {id} = useParams()

    const [project,setProject] = useState([])
    const [services,setServices] = useState([])
    const [showProjectForm,setShowProjectForm] = useState(false)
    const [showServiceForm,setShowServiceForm] = useState(false)
    const [message,setMessage] = useState()
    const [messageType,setMessageType] = useState()

    useEffect(() =>{
        setTimeout(()=>{
            fetch(`http://localhost:6500/projects/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            }).then(res => res.json())
            .then(data =>{
                setProject(data)
            })
            .catch(err => console.log(err))       
        }, 300)
    }, [id])

    function editPost(project){
        setMessage('')

        if(project.valorTotal < project.cost){
            setMessage('O orçamento não pode ser menor que o custo do projeto')
            setMessageType("error")
            return false
        }

        fetch(`http://localhost:6500/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then(res => res.json())
        .then((data) =>{
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto atualizado com sucesso')
            setMessageType("success")
        })
        .catch((err) => console.log(err))
    }
    function createService(project){
        setMessage('')

        const lastService = project.services[project.services.length -1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if(newCost > parseFloat(project.valorTotal)){
            setMessage('Orçamento ultrapassado')
            setMessageType('error')
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:6500/projects/${project.id}`, {
            method: 'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(project)
        }).then((res) => res.json())
        .then((data) =>{
            setServices(data.services)
            setShowServiceForm(false)
        })
        .catch(err => console.log(err))
    }

    function removeService(id, cost){
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        )
        
        const projectUpdated = project

        projectUpdated.services = servicesUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:6500/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(projectUpdated)
        }).then((res) => res.json)
        .then((data) =>{
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso')
            setMessageType('success')
        })
        .catch(err => console.log(err))

    }
    
    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm(){
        setShowServiceForm(!showServiceForm)

    }

    

    return(
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={messageType} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar Projeto': 'Concluir Edição'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento:</span> R${project.valorTotal}
                                    </p>
                                    <p>
                                        <span>Total Utilizado:</span> R${project.cost}
                                    </p>
                                </div>
                            ):(
                                <div className={styles.project_info}>
                                    <ProjectForm handleSubmit={editPost} BtnText="Concluir edição" projectData={project} />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                                <h2>Adicione um serviço:</h2>
                                <button onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar Serviço': 'Concluir Edição'}
                                </button>
                                <div className={styles.project_info}>
                                    {showServiceForm && (
                                        <ServiceForm 
                                            handleSubmit={createService}
                                            btnText="Add Serviço"
                                            projectData={project}
                                        />
                                    )}
                                </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {services.length === 0 && <p>Não há serviços cadastrados</p>}
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard 
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            
                        </Container>
                    </Container>
                </div>
            ): (
                <Loader />
            )}
        </>
    )
}

export default Project