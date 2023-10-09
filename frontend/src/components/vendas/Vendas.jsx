import React, { Component } from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import Main from "../template/Main";
import InputMask from "react-input-mask";
import validator from "validator";
import "../user/UserCrud.css";

const headerProps = {
    icon: 'money',
    title: 'Vendas',
}

const baseUrl = 'http://localhost:7069/vendas'
const initialState = {
    vendas: {
        paciente: '',
        produto: '',
        preco: '',
        quantidade: '',
    },
    list: []
}

export default class Vendas extends Component {

    state = {
        ...initialState,
    }

    componentDidMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data });
        });
    }

    clear() {
        this.setState({ vendas: initialState.vendas })
    }

    resetFilter() {
        window.location.reload();
    }

    save() {
        const vendas = this.state.vendas
        const method = vendas.id ? 'put' : 'post'
        const url = vendas.id ? `${baseUrl}/${vendas.id}` : baseUrl

        if (validator.isNumeric(vendas.paciente)) {
            alert("O nome do paciente não pode conter números.");
            return;
        }

        if (validator.isNumeric(vendas.produto)) {
            alert("O nome do produto não pode conter números.");
            return;
        }

        if (!validator.isNumeric(vendas.preco)) {
            alert("O preço não pode conter letras.");
            return;
        }

        if (!this.validateFields(vendas)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        axios[method](url, vendas)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ vendas: initialState.vendas, list })
            })
    }

    validateFields(vendas) {
        const requiredFields = ['paciente', 'produto', 'quantidade', 'preco'];
        for (const field of requiredFields) {
            if (!vendas[field]) {
                return false;
            }
        }
        return true;
    }

    getUpdatedList(vendas, add = true) {
        const list = this.state.list.filter(u => u.id !== vendas.id)
        if (add) list.unshift(vendas)
        return list
    }

    updateField(event) {
        const vendas = { ...this.state.vendas }
        vendas[event.target.name] = event.target.value
        this.setState({ vendas })

        const { name, value } = event.target;
        const formattedValue = value.replace(/[^0-9]/g, ""); // Remove caracteres não numéricos

        this.setState({ vendas: { ...this.state.vendas, [name]: value } });
    }

    updatePriceField(event) {
        const { name, value } = event.target;
        const numericValue = value.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
        this.setState({ vendas: { ...this.state.vendas, [name]: numericValue } });
    }

    updateFilter(event) {
        const { paciente, value } = event.target;
        this.setState({ [paciente]: value });
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-6 col-m-2">
                        <div className="form-group">
                            <label htmlFor="">Paciente</label>
                            <input
                                className="form-control"
                                name="paciente"
                                value={this.state.vendas.paciente}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome" />
                        </div>
                    </div>
                    <div className="col-6 col-m-2">
                        <div className="form-group">
                            <label htmlFor="">Produto</label>
                            <input
                                className="form-control"
                                name="produto"
                                value={this.state.vendas.produto}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome" />
                        </div>
                    </div>
                    <div className="col-6 col-m-2">
                        <div className="form-group">
                            <label>Preço</label>
                            <input
                                className="form-control"
                                name="preco"
                                value={this.state.vendas.preco}
                                onChange={e => this.updatePriceField(e)}
                                placeholder="Digite o preço do produto"
                            />
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-group">
                            <label>Quantidade</label>
                            <input
                                className="form-control"
                                type="number"
                                name="quantidade"
                                value={this.state.vendas.quantidade}
                                onChange={e => this.updateField(e)}
                            />
                        </div>
                    </div>

                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Limpar/Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    getOnlyNames() {
        const onlyNames = [...new Set(this.state.list.map(paciente => paciente.name))];
        return onlyNames;
    }

    renderFilters() {
        const onlyNames = this.getOnlyNames();
        return (
            <div className="row">
                <div className="col-6 col-m-2">
                    <div className="form-group">
                        <label>Paciente</label>
                        <select
                            className="form-control"
                            name="filterPaciente"
                            value={this.state.filterPaciente}
                            onChange={e => this.updateFilter(e)}
                        >
                            <option value="">Todos</option>
                            {onlyNames.map((paciente, index) => (
                                <option key={index} value={paciente}>
                                    {paciente}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-6 col-m-2">
                    <div className="form-group">
                        <label>Preço</label>
                        <input
                            className="form-control"
                            name="filterPreco"
                            value={this.state.filterPreco}
                            onChange={e => this.updateFilter(e)}
                        />
                    </div>
                </div>
                <button className="btn btn-danger ml-3"
                    onClick={this.resetFilter}>
                    Limpar Filtro
                </button>
            </div>
        );
    }

    load(vendas) {
        this.setState({ vendas })
    }

    remove(vendas) {
        axios.delete(`${baseUrl}/${vendas.id}`).then(resp => {
            const list = this.getUpdatedList(vendas, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th className="cell-name">Paciente</th>
                        <th className="cell">Produto</th>
                        <th className="cell">Preço</th>
                        <th className="cell">Quantidade</th>
                        <th className="cell-products">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>

        )
    }

    renderRows() {
        const { filterPaciente, filterPreco } = this.state;
        const filteredList = this.state.list.filter(vendas => {
            return (
                (filterPaciente === '' || vendas.paciente.includes(filterPaciente)) ||
                (filterPreco === '' || vendas.preco.includes(filterPreco))
            );
        });

        const finalList = (
            !filterPaciente &&
            !filterPreco
        ) ? this.state.list : filteredList;



        return finalList.map(vendas => {
            return (
                <tr key={vendas.id}>
                    <td className="cell">{vendas.paciente}</td>
                    <td className="cell">{vendas.produto}</td>
                    <td className="cell">{vendas.preco}</td>
                    <td className="cell">{vendas.quantidade}</td>
                    <td className="cell">
                        <button className="btn btn-warning"
                            onClick={() => this.load(vendas)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(vendas)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                <div>
                    <div className="separador">
                        <p>CADASTRO DE VENDAS</p>
                    </div>

                    <div className="container">
                        <div className="formulario">
                            {this.renderForm()}
                        </div>
                    </div>

                    <div className="separador">
                        <p>VENDAS</p>
                    </div>

                    <div className="container">
                        <div className="filtros">
                            {this.renderFilters()}
                        </div>
                    </div>
                </div>
                {this.renderTable()}
            </Main>
        )
    }
}