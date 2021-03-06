import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg'

import './styles.css'

import api from '../../services/api'

export default function NewIncident() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [value, setValue] = useState('')

    const history = useHistory()
    const ongId = localStorage.getItem('ongId') || ''

    async function handleNewIncident(e) {
        e.preventDefault()

        try {
            const data = { title, description, value }
            await api.post('incidents', data, { headers: { Authorization: ongId } })
            history.push('/profile')
        } catch (error) {
            alert(error.response.data.error)
        }
    }

    return (
        <div className="new-incident-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="Be the hero" />

                    <h1>Cadastrar novo caso</h1>
                    <p>Descreva o caso detalhadamentte para encontrar um herói para resolver isso.</p>
                    <Link className="back-link" to="/profile">
                        <FiArrowLeft size="16" color="#e02041" />
                        Voltar para home
                    </Link>
                </section>

                <form onSubmit={handleNewIncident}>
                    <input
                        placeholder="título do caso"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required />

                    <textarea
                        placeholder="Descrição"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required />

                    <input
                        type="number"
                        placeholder="Valor em reais"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        required />

                    <button type="submit" className="button">Cadastrar</button>
                </form>
            </div>
        </div>
    )
}