import { useEffect, useState } from 'react';

import styles from './projectForm.module.css'
import Input from '../form/Input';
import Select from '../form/Select';
import SubmitBtn from '../form/SubmitBtn';

function ProjectForm({handleSubmit, BtnText, projectData}) {

    const [categorias, setCategorias] = useState([])
    const [project, setProject] = useState(projectData || {})

    useEffect(() => {
        fetch("http://localhost:6500/categories", {
        method: "GET",
        headers:{
            'Content-Type': 'application/jason',
       },
    })
        .then((res) => res.json())
        .then((data) =>{
            setCategorias(data)
        })
        .catch((err) => console.log(err))
    }, [])

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(project)
    }

    function handleChange(e) {
        setProject({ ...project, [e.target.name]: e.target.value})
    }

    function handleSelect(e) {
        setProject({ ...project, category:{
            id: e.target.value,
            name: e.target.options[e.target.selectedIndex].text,
            },
        })

    }
    
    return (
        <form onSubmit={submit} className={styles.form}>
            <Input type="text" text="Nome Do Projeto" name="name"  placeholder="Insira o nome do projeto" handleOnChange={handleChange} value={project.name ? project.name : ''}/>
            <Input type="number" text="Orçamento Do Projeto" name="valorTotal"  placeholder="Insira o orçamento" handleOnChange={handleChange} value={project.valorTotal ? project.valorTotal : ''}/>
            <Select name="categoriaId" text="Selecione uma categoria" options={categorias} handleOnChange={handleSelect} value={project.category ? project.category.id : ''}/>
            <SubmitBtn text={BtnText}/>
        </form>
    )
}

export default ProjectForm;