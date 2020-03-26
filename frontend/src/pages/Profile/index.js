import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiPower, FiTrash2 } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';
import './styles.css'

import api from '../../services/api'

export default function Profile() {
    const [incidents, setIncidents] = useState([])
    const ongName = localStorage.getItem('ongName')
    const ongId = localStorage.getItem('ongId')

    const history = useHistory()
    const apiOptions = { headers: { Authorization: ongId } }
    const currency = Intl.NumberFormat('pt-BR', { style: 'currency', currency:'BRL' })

    useEffect(() => {
        api.get('profile', { headers: { Authorization: ongId } }).then(response =>  setIncidents(response.data))
    }, [ongId])

    async function handleDeleteIncident(id){
        try{
            await api.delete(`incidents/${id}`, apiOptions)
            setIncidents(incidents.filter(x=> x.id !== id))
        } catch{
            alert('Erro ao deletar caso, tente novamete')
        }
    }

    function handleLogout(){
        localStorage.clear()
        history.replace('/')
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero" />
                <span>Bem vinda, {ongName}</span>
                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            { incidents.length == 0 && <p>Você ainda não tem casos cadastrados.</p> }

            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p>

                        <strong>DESCRIÇÃO:</strong>
                        <p>{incident.description}</p>

                        <strong>VALOR:</strong>
                        <p>{currency.format(incident.value)}</p>

                        <button onClick={()=> handleDeleteIncident(incident.id)}>
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}