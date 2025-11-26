import React, { useState, useEffect, useMemo } from "react";
import authUser from "@/hooks/authUser";
import { useForm, usePage, router } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import Layout from "@/Components/layouts/Layout";
import { Edit, Trash2, Plus, Search, AlertCircle, Loader } from 'lucide-react';
import { getUsersByPage } from "@/lib/api";
import { formatCPF, formatCEP } from "@/lib/formatters";
import PaginationControls from '@/Components/ui/PaginationControls';

export default function Users({ currentPage, total_pages, users }) {
    const user = authUser();
    const [usersList, setUsersList] = useState(users || []);
    const [page, setPage] = useState(currentPage);
    const [totalPages, setTotalPages] = useState(total_pages);

    // Estados de diálogos
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Estados de filtro
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Estados para validação
    const [cpfError, setCpfError] = useState('');
    const [cepLoading, setCepLoading] = useState(false);
    const [cepError, setCepError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getUsersByPage(page, 20).then(result => {
            setUsersList(result.users);
            setTotalPages(result.total_pages);
        }).catch(apiError => {
            console.warn('Erro ao carregar produtos:', apiError);
            setLoading(false);
        }).finally(() => {
            setLoading(false);
        });
    }, [page]);

    // Form para adicionar/editar
    const { data, setData, post, put, processing, reset } = useForm({
        admin_id: user?.id || 1,
        name: '',
        email: '',
        tax_id: '',
        birth_date: '',
        occupation: '',
        zipcode: '',
        street: '',
        state: '',
        city: '',
        neighborhood: '',
        password: '',
    });

    // Validar CPF
    const validateCPF = (cpf) => {
        const cleanCPF = cpf.replace(/\D/g, '');

        if (cleanCPF.length !== 11) {
            setCpfError('CPF deve conter 11 dígitos');
            return false;
        }

        if (/^(\d)\1{10}$/.test(cleanCPF)) {
            setCpfError('CPF inválido');
            return false;
        }

        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
        }

        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanCPF.substring(9, 10))) {
            setCpfError('CPF inválido');
            return false;
        }

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
        }

        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanCPF.substring(10, 11))) {
            setCpfError('CPF inválido');
            return false;
        }

        setCpfError('');
        return true;
    };

    // Buscar endereço pelo CEP
    const fetchAddressByCEP = async (cep) => {
        const cleanCEP = cep.replace(/\D/g, '');

        if (cleanCEP.length !== 8) {
            setCepError('CEP deve conter 8 dígitos');
            return;
        }

        setCepLoading(true);
        setCepError('');

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
            const addressData = await response.json();

            if (addressData.erro) {
                setCepError('CEP não encontrado');
                setCepLoading(false);
                return;
            }

            setData({
                ...data,
                zipcode: cleanCEP,
                street: addressData.logradouro || '',
                neighborhood: addressData.bairro || '',
                city: addressData.localidade || '',
                state: addressData.uf || '',
            });

            setCepLoading(false);
        } catch (error) {
            setCepError('Erro ao buscar CEP');
            setCepLoading(false);
        }
    };

    const handleCEPChange = (value) => {
        const formatted = formatCEP(value);
        setData('zipcode', formatted);

        if (formatted.replace(/\D/g, '').length === 8) {
            fetchAddressByCEP(formatted);
        }
    };

    const handleCPFChange = (value) => {
        const formatted = formatCPF(value);
        setData('tax_id', formatted);

        if (formatted.replace(/\D/g, '').length === 11) validateCPF(formatted, setCpfError);
    };

    const handlePageChange = (event) => {
        setPage(event.selected + 1);
        window.scrollTo(0, 0);
    };

    // Filtrar usuários baseado em busca e data
    const filteredUsers = useMemo(() => {
        return usersList.filter(u => {
            const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.occupation.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesDate = true;
            if (startDate || endDate) {
                const createdAt = new Date(u.created_at);
                if (startDate) {
                    const start = new Date(startDate);
                    matchesDate = createdAt >= start;
                }
                if (endDate && matchesDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59);
                    matchesDate = createdAt <= end;
                }
            }

            return matchesSearch && matchesDate;
        });
    }, [usersList, searchTerm, startDate, endDate]);

    const openAddDialog = () => {
        reset();
        setSelectedUser(null);
        setFormErrors({});
        setCpfError('');
        setCepError('');
        setShowAddDialog(true);
    };

    const openEditDialog = (userToEdit) => {
        setSelectedUser(userToEdit);
        setData({
            admin_id: userToEdit.admin_id,
            name: userToEdit.name,
            email: userToEdit.email,
            tax_id: userToEdit.tax_id,
            birth_date: userToEdit.birth_date,
            occupation: userToEdit.occupation,
            zipcode: userToEdit.zipcode,
            street: userToEdit.street,
            state: userToEdit.state,
            city: userToEdit.city,
            neighborhood: userToEdit.neighborhood,
            password: '',
        });
        setFormErrors({});
        setCpfError('');
        setCepError('');
        setShowEditDialog(true);
    };

    const openDeleteDialog = (userToDelete) => {
        setSelectedUser(userToDelete);
        setShowDeleteDialog(true);
    };

    const validateForm = () => {
        const errors = {};

        if (!data.name.trim()) errors.name = 'Nome é obrigatório';
        if (!data.email.trim()) errors.email = 'Email é obrigatório';
        if (!data.tax_id.trim()) errors.tax_id = 'CPF é obrigatório';
        if (cpfError) errors.tax_id = cpfError;
        if (!data.birth_date) errors.birth_date = 'Data de nascimento é obrigatória';
        if (!data.occupation.trim()) errors.occupation = 'Cargo é obrigatório';
        if (!data.zipcode.trim()) errors.zipcode = 'CEP é obrigatório';
        if (!data.street.trim()) errors.street = 'Rua é obrigatória';
        if (!data.state.trim()) errors.state = 'Estado é obrigatório';
        if (!data.city.trim()) errors.city = 'Cidade é obrigatória';
        if (!data.neighborhood.trim()) errors.neighborhood = 'Bairro é obrigatório';
        if (!selectedUser && !data.password) errors.password = 'Senha é obrigatória';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddUser = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        post('/admin/user', {
            onSuccess: () => {
                setShowAddDialog(false);
                reset();
            }
        });
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        put(`/admin/user/${selectedUser.id}`, {
            onSuccess: () => {
                setShowEditDialog(false);
                reset();
            }
        });
    };

    const handleDeleteUser = () => {
        if (selectedUser) {
            router.delete(`/admin/user/${selectedUser.id}`, {
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setSelectedUser(null);
                }
            });
        }
    };

    return (
        <Layout>
            <div className="min-h-screen mx-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                        Gerenciar Usuários
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Total de {filteredUsers.length} usuários encontrados
                    </p>
                </div>

                {/* Botão Adicionar */}
                <div className="mb-6">
                    <Button
                        onClick={openAddDialog}
                        className="transition-all duration-200 hover:scale-105"
                        size="lg"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Adicionar Novo Usuário
                    </Button>
                </div>

                {/* Filtros */}
                <Card className="mb-6 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Filtros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label className="mb-2 block">Buscar por Nome ou Cargo</Label>
                                <Input
                                    placeholder="Digite o nome ou cargo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-fit"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Data de Início</Label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-fit"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Data de Término</Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-fit"
                                />
                            </div>
                        </div>
                        {(searchTerm || startDate || endDate) && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => {
                                    setSearchTerm('');
                                    setStartDate('');
                                    setEndDate('');
                                }}
                            >
                                {loading ? 'Carregando...' : 'Limpar Filtros'}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Tabela */}
                <Card className="shadow-lg overflow-hidden">
                    <CardHeader className="bg-slate-100 dark:bg-slate-800 border-b">
                        <CardTitle>{loading ? 'Carregando usuários...' : 'Lista de usuários'}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        {filteredUsers.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-slate-500 dark:text-slate-400">
                                    {loading ? 'Carregando usuário...' : 'Nenhum usuário encontrado'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-900 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">ID</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Nome</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">CPF</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Idade</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Email</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Cargo</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Gestor</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">CEP</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Rua</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Cidade</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Bairro</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Estado</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u) => (
                                            <tr
                                                key={u.id}
                                                className="border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-semibold">#{u.id}</td>
                                                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{u.name}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{u.tax_id}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.age}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.email}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.occupation}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.adminManager}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.zipcode}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.street}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.city}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.neighborhood}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.state}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => openEditDialog(u)}
                                                            className="text-blue-600 hover:text-blue-700"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => openDeleteDialog(u)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {totalPages > 1 && (
                                    <PaginationControls
                                        pageCount={totalPages}
                                        currentPage={page}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Dialog Adicionar Usuário */}
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                            <DialogDescription>
                                Preencha todos os dados do novo funcionário
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            {/* Linha 1: Nome e Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Nome Completo *</Label>
                                    <Input
                                        id="name"
                                        placeholder="João Silva"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={formErrors.name ? 'border-red-500' : ''}
                                    />
                                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="joao@example.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={formErrors.email ? 'border-red-500' : ''}
                                    />
                                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                                </div>
                            </div>

                            {/* Linha 2: CPF e Data Nascimento */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="tax_id">CPF *</Label>
                                    <Input
                                        id="tax_id"
                                        placeholder="000.000.000-00"
                                        value={data.tax_id}
                                        onChange={(e) => handleCPFChange(e.target.value)}
                                        className={formErrors.tax_id || cpfError ? 'border-red-500' : ''}
                                    />
                                    {(formErrors.tax_id || cpfError) && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.tax_id || cpfError}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="birth_date">Data de Nascimento *</Label>
                                    <Input
                                        id="birth_date"
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                        className={formErrors.birth_date ? 'border-red-500' : ''}
                                    />
                                    {formErrors.birth_date && <p className="text-red-500 text-sm mt-1">{formErrors.birth_date}</p>}
                                </div>
                            </div>

                            {/* Linha 3: Cargo */}
                            <div>
                                <Label htmlFor="occupation">Cargo *</Label>
                                <Input
                                    id="occupation"
                                    placeholder="Desenvolvedor"
                                    value={data.occupation}
                                    onChange={(e) => setData('occupation', e.target.value)}
                                    className={formErrors.occupation ? 'border-red-500' : ''}
                                />
                                {formErrors.occupation && <p className="text-red-500 text-sm mt-1">{formErrors.occupation}</p>}
                            </div>

                            {/* Linha 4: CEP */}
                            <div>
                                <Label htmlFor="zipcode">CEP *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="zipcode"
                                        placeholder="00000-000"
                                        value={data.zipcode}
                                        onChange={(e) => handleCEPChange(e.target.value)}
                                        className={formErrors.zipcode || cepError ? 'border-red-500' : ''}
                                    />
                                    {cepLoading && <Loader className="h-10 w-10 animate-spin text-blue-600" />}
                                </div>
                                {(formErrors.zipcode || cepError) && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.zipcode || cepError}</p>
                                )}
                            </div>

                            {/* Linha 5: Rua */}
                            <div>
                                <Label htmlFor="street">Rua *</Label>
                                <Input
                                    id="street"
                                    placeholder="Rua Principal"
                                    value={data.street}
                                    onChange={(e) => setData('street', e.target.value)}
                                    className={formErrors.street ? 'border-red-500' : ''}
                                />
                                {formErrors.street && <p className="text-red-500 text-sm mt-1">{formErrors.street}</p>}
                            </div>

                            {/* Linha 6: Bairro */}
                            <div>
                                <Label htmlFor="neighborhood">Bairro *</Label>
                                <Input
                                    id="neighborhood"
                                    placeholder="Centro"
                                    value={data.neighborhood}
                                    onChange={(e) => setData('neighborhood', e.target.value)}
                                    className={formErrors.neighborhood ? 'border-red-500' : ''}
                                />
                                {formErrors.neighborhood && <p className="text-red-500 text-sm mt-1">{formErrors.neighborhood}</p>}
                            </div>

                            {/* Linha 7: Cidade e Estado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">Cidade *</Label>
                                    <Input
                                        id="city"
                                        placeholder="São Paulo"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className={formErrors.city ? 'border-red-500' : ''}
                                    />
                                    {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="state">Estado *</Label>
                                    <Input
                                        id="state"
                                        placeholder="SP"
                                        maxLength="2"
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value.toUpperCase())}
                                        className={formErrors.state ? 'border-red-500' : ''}
                                    />
                                    {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
                                </div>
                            </div>

                            {/* Linha 8: Senha */}
                            <div>
                                <Label htmlFor="password">Senha *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={formErrors.password ? 'border-red-500' : ''}
                                />
                                {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddDialog(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : 'Salvar'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Dialog Editar Usuário */}
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Editar Usuário</DialogTitle>
                            <DialogDescription>
                                Atualize os dados do funcionário
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            {/* Linha 1: Nome e Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="edit-name">Nome Completo *</Label>
                                    <Input
                                        id="edit-name"
                                        placeholder="João Silva"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={formErrors.name ? 'border-red-500' : ''}
                                    />
                                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="edit-email">Email *</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        placeholder="joao@example.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={formErrors.email ? 'border-red-500' : ''}
                                    />
                                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                                </div>
                            </div>

                            {/* Linha 2: CPF e Data Nascimento */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="edit-tax_id">CPF *</Label>
                                    <Input
                                        id="edit-tax_id"
                                        placeholder="000.000.000-00"
                                        value={data.tax_id}
                                        onChange={(e) => handleCPFChange(e.target.value)}
                                        className={formErrors.tax_id || cpfError ? 'border-red-500' : ''}
                                    />
                                    {(formErrors.tax_id || cpfError) && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.tax_id || cpfError}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="edit-birth_date">Data de Nascimento *</Label>
                                    <Input
                                        id="edit-birth_date"
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                        className={formErrors.birth_date ? 'border-red-500' : ''}
                                    />
                                    {formErrors.birth_date && <p className="text-red-500 text-sm mt-1">{formErrors.birth_date}</p>}
                                </div>
                            </div>

                            {/* Linha 3: Cargo */}
                            <div>
                                <Label htmlFor="edit-occupation">Cargo *</Label>
                                <Input
                                    id="edit-occupation"
                                    placeholder="Desenvolvedor"
                                    value={data.occupation}
                                    onChange={(e) => setData('occupation', e.target.value)}
                                    className={formErrors.occupation ? 'border-red-500' : ''}
                                />
                                {formErrors.occupation && <p className="text-red-500 text-sm mt-1">{formErrors.occupation}</p>}
                            </div>

                            {/* Linha 4: CEP */}
                            <div>
                                <Label htmlFor="edit-zipcode">CEP *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="edit-zipcode"
                                        placeholder="00000-000"
                                        value={data.zipcode}
                                        onChange={(e) => handleCEPChange(e.target.value)}
                                        className={formErrors.zipcode || cepError ? 'border-red-500' : ''}
                                    />
                                    {cepLoading && <Loader className="h-10 w-10 animate-spin text-blue-600" />}
                                </div>
                                {(formErrors.zipcode || cepError) && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.zipcode || cepError}</p>
                                )}
                            </div>

                            {/* Linha 5: Rua */}
                            <div>
                                <Label htmlFor="edit-street">Rua *</Label>
                                <Input
                                    id="edit-street"
                                    placeholder="Rua Principal"
                                    value={data.street}
                                    onChange={(e) => setData('street', e.target.value)}
                                    className={formErrors.street ? 'border-red-500' : ''}
                                />
                                {formErrors.street && <p className="text-red-500 text-sm mt-1">{formErrors.street}</p>}
                            </div>

                            {/* Linha 6: Bairro */}
                            <div>
                                <Label htmlFor="edit-neighborhood">Bairro *</Label>
                                <Input
                                    id="edit-neighborhood"
                                    placeholder="Centro"
                                    value={data.neighborhood}
                                    onChange={(e) => setData('neighborhood', e.target.value)}
                                    className={formErrors.neighborhood ? 'border-red-500' : ''}
                                />
                                {formErrors.neighborhood && <p className="text-red-500 text-sm mt-1">{formErrors.neighborhood}</p>}
                            </div>

                            {/* Linha 7: Cidade e Estado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="edit-city">Cidade *</Label>
                                    <Input
                                        id="edit-city"
                                        placeholder="São Paulo"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className={formErrors.city ? 'border-red-500' : ''}
                                    />
                                    {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="edit-state">Estado *</Label>
                                    <Input
                                        id="edit-state"
                                        placeholder="SP"
                                        maxLength="2"
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value.toUpperCase())}
                                        className={formErrors.state ? 'border-red-500' : ''}
                                    />
                                    {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
                                </div>
                            </div>

                            {/* Linha 8: Senha */}
                            <div>
                                <Label htmlFor="edit-password">Senha (deixe em branco para manter a atual)</Label>
                                <Input
                                    id="edit-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowEditDialog(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Atualizando...' : 'Atualizar'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Dialog Confirmar Deleção */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Confirmar Exclusão</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja remover este usuário?
                            </DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Atenção</AlertTitle>
                                <AlertDescription>
                                    Você está prestes a remover <strong>{selectedUser.name}</strong>. Esta ação é irreversível.
                                </AlertDescription>
                            </Alert>
                        )}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowDeleteDialog(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDeleteUser}
                                disabled={processing}
                            >
                                {processing ? 'Removendo...' : 'Remover'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
}
