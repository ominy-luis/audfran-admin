import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";
import InputMask from "react-input-mask";
import validator from "validator";
import PatientViewModal from "../popup/PatientViewModal";
import "../user/UserCrud.css";

const headerProps = {
    icon: 'user',
    title: 'Pacientes',
}

const baseUrl = 'http://localhost:7069/pacientes'
const dataAtual = new Date(Date.now()).toLocaleString().split(',')[0];
const initialState = {
    pacientes: {
        name: '',
        cpf: '',
        telefone: '',
        nascimento: '',
        endereco: '',
        lado: '',
        cadastro: dataAtual
    },
    list: []
}

export default class UserCrud extends Component {

    state = {
        ...initialState,
        isViewModalVisible: true,
        viewPatient: null,
    }

    openViewModal = (patient) => {
        this.setState({
            isViewModalVisible: true,
            viewPatient: patient,
        });
    };

    closeViewModal = () => {
        this.setState({
            isViewModalVisible: false,
            viewPatient: null,
        });
    };

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ pacientes: initialState.pacientes })
    }

    save() {
        const pacientes = this.state.pacientes
        const method = pacientes.id ? 'put' : 'post'
        const url = pacientes.id ? `${baseUrl}/${pacientes.id}` : baseUrl

        if (validator.isNumeric(pacientes.name)) {
            alert("O nome não pode conter números.");
            return;
        }

        if (pacientes.nascimento && pacientes.nascimento.length > 10) {
            alert("A ano de nascimento deve ter no máximo 4 caracteres.");
            return;
        }

        if (pacientes.telefone.length < 11) {
            alert("Por favor, termine de preencher o número de telefone")
        }

        if (pacientes.cpf.length < 11) {
            alert("Por favor, termine de preencher o campo CPF")
        }

        if (!this.validateFields(pacientes)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        axios[method](url, pacientes)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ pacientes: initialState.pacientes, list })
            })
    }

    validateFields(pacientes) {
        const requiredFields = ['name', 'cpf', 'telefone', 'nascimento', 'endereco', 'lado'];
        for (const field of requiredFields) {
            if (!pacientes[field]) {
                return false;
            }
        }
        return true;
    }

    getUpdatedList(pacientes, add = true) {
        const list = this.state.list.filter(u => u.id !== pacientes.id)
        if (add) list.unshift(pacientes)
        return list
    }

    updateField(event) {
        const pacientes = { ...this.state.pacientes }
        pacientes[event.target.name] = event.target.value
        this.setState({ pacientes })

        const { name, value } = event.target;
        const formattedValue = value.replace(/[^0-9]/g, ""); // Remove caracteres não numéricos

        // Aplicar a máscara para o campo de telefone
        if (name === "telefone") {
            this.setState({ pacientes: { ...this.state.pacientes, [name]: formattedValue } });
        }
        // Aplicar a máscara para o campo de CPF
        else if (name === "cpf") {
            this.setState({ pacientes: { ...this.state.pacientes, [name]: formattedValue } });
        }
        // Para outros campos, atualize diretamente
        else {
            this.setState({ pacientes: { ...this.state.pacientes, [name]: value } });
        }
    }

    updateFilter(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-m-6">
                        <div className="form-group">
                            <label htmlFor="">Nome</label>
                            <input type="text" className="form-control"
                                name="name"
                                value={this.state.pacientes.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome" />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>CPF</label>
                            <InputMask mask="999.999.999-99" type="text" className="form-control"
                                name="cpf"
                                value={this.state.pacientes.cpf}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o CPF" />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Telefone</label>
                            <InputMask mask="(99)99999-9999" type="text" className="form-control"
                                name="telefone"
                                value={this.state.pacientes.telefone}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o Telefone" />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Data de Nascimento</label>
                            <input type="date" className="form-control"
                                name="nascimento"
                                value={this.state.pacientes.nascimento}
                                onChange={e => this.updateField(e)} />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Endereço</label>
                            <input type="text" className="form-control"
                                name="endereco"
                                value={this.state.pacientes.endereco}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o endereço" />
                        </div>
                    </div>
                    <div className="col-6 col-md-4">
                        <center>
                            <label for="lado">Unilateral</label> <br />
                            <input type="radio"
                                name="lado"
                                value="Unilateral"
                                onChange={e => this.updateField(e)} />
                        </center>
                    </div>
                    <div>
                        <center>
                            <label for="lado">Bilateral</label>
                            <br />
                            <input type="radio"
                                name="lado"
                                value="Bilateral"
                                onChange={e => this.updateField(e)} />
                        </center>
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
                <div className="col-12 col-md-3">
                    <div className="form-group">
                        <label>Nome</label>
                        <select
                            className="form-control"
                            name="filterName"
                            value={this.state.filterName}
                            onChange={e => this.updateFilter(e)}
                        >
                            <option value="">Todos</option>
                            {onlyNames.map((name, index) => (
                                <option key={index} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="form-group">
                        <label>CPF</label>
                        <input
                            type="text"
                            className="form-control"
                            name="filterCpf"
                            value={this.state.filterCpf}
                            onChange={e => this.updateFilter(e)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="form-group">
                        <label>Ano de Nascimento</label>
                        <input
                            type="text"
                            className="form-control"
                            name="filterNascimento"
                            value={this.state.filterNascimento}
                            onChange={e => this.updateFilter(e)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="form-group">
                        <label>Endereço</label>
                        <input
                            type="text"
                            className="form-control"
                            name="filterEndereco"
                            value={this.state.filterEndereco}
                            onChange={e => this.updateFilter(e)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="form-group">
                        <label>Data de Cadastro</label>
                        <input
                            type="text"
                            className="form-control"
                            name="filterCadastro"
                            value={this.state.filterCadastro}
                            onChange={e => this.updateFilter(e)}
                        />
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="form-group">
                        <label>Aparelho</label>
                        <select
                            className="form-control"
                            name="filterAparelho"
                            value={this.state.filterAparelho}
                            onChange={e => this.updateFilter(e)}
                        >
                            <option value="">Todos</option>
                            <option value="Unilateral">Unilateral</option>
                            <option value="Bilateral">Bilateral</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    load(pacientes) {
        this.setState({ pacientes })
    }

    remove(pacientes) {
        axios.delete(`${baseUrl}/${pacientes.id}`).then(resp => {
            const list = this.getUpdatedList(pacientes, false)
            this.setState({ list })
        })
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th className="cell">Nome</th>
                        <th className="cell">CPF</th>
                        <th className="cell">Telefone</th>
                        <th className="cell">Dt. Nasc.</th>
                        <th className="cell">Endereço</th>
                        <th className="cell">Dt. Cadastro</th>
                        <th className="cell">Uni ou Bi</th>
                        <th className="cell-actions">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>

        )
    }

    renderRows() {
        const { filterName, filterCpf, filterNascimento, filterEndereco, filterCadastro, filterAparelho } = this.state;
        const filteredList = this.state.list.filter(pacientes => {
            return (
                (filterName === '' || pacientes.name.includes(filterName)) ||
                (filterCpf === '' || pacientes.cpf.includes(filterCpf)) ||
                (filterNascimento === '' || pacientes.nascimento.includes(filterNascimento)) ||
                (filterEndereco === '' || pacientes.endereco.includes(filterEndereco)) ||
                (filterCadastro === '' || pacientes.cadastro.includes(filterCadastro)) ||
                (filterAparelho === '' || pacientes.lado === filterAparelho)
            );
        });

        const finalList = (
            !filterName &&
            !filterCpf &&
            !filterNascimento &&
            !filterEndereco &&
            !filterCadastro &&
            !filterAparelho
        ) ? this.state.list : filteredList;



        return finalList.map(pacientes => {
            const dataNascimento = new Date(pacientes.nascimento).toLocaleDateString('pt-BR');
            const telefone = this.formatTelefone(pacientes.telefone)
            const CPF = this.formatCPF(pacientes.cpf);
            return (
                <tr key={pacientes.id}>
                    <td className="cell">{pacientes.name}</td>
                    <td className="cell">{CPF}</td>
                    <td className="cell">{telefone}</td>
                    <td className="cell">{dataNascimento}</td>
                    <td className="cell">{pacientes.endereco}</td>
                    <td className="cell">{pacientes.cadastro}</td>
                    <td className="cell">{pacientes.lado}</td>
                    <td className="cell">
                        <button className="btn btn-warning"
                            onClick={() => this.load(pacientes)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(pacientes)}>
                            <i className="fa fa-trash"></i>
                        </button>
                        <button className="btn btn-primary ml-2"
                            onClick={() => this.openViewModal(pacientes)}
                        >
                            <i className="fa fa-eye"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    formatCPF(cpf) {
        return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    formatTelefone(telefone) {
        return telefone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    render() {
        const { isViewModalVisible, viewPatient } = this.state;

        return (
            <Main {...headerProps}>
                <div>
                    <div className="separador">
                        <p>CADASTRO DE PACIENTES</p>
                    </div>

                    <div className="container">
                        <div className="formulario">
                            {this.renderForm()}
                        </div>
                    </div>

                    <div className="separador">
                        <p>PACIENTES</p>
                    </div>

                    <div className="container">
                        <div className="filtros">
                            {this.renderFilters()}
                        </div>
                    </div>

                    {isViewModalVisible && viewPatient && (
                        <PatientViewModal
                            patient={viewPatient}
                            onClose={this.closeViewModal}
                        />
                    )}
                </div>
                {this.renderTable()}
            </Main>
        )
    }
}