import React, { useState, useMemo, useEffect } from "react";
import { Search } from 'lucide-react';
import authUser from "@/hooks/authUser";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import Layout from "@/Components/layouts/Layout";
import { getUserLogsByDateRange } from "@/lib/api";
import PaginationControls from '@/Components/ui/PaginationControls';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function RegisterList({ currentPage, total_pages, registers }) {
    const user = authUser();
    const [page, setPage] = useState(currentPage);
    const [totalPages, setTotalPages] = useState(total_pages);
    const [logs, setLogs] = useState(registers || []);
    // Estados de filtro
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch logs quando as datas mudarem
    useEffect(() => {
        setLoading(true);
        getUserLogsByDateRange(page, 20, startDate, endDate).then(result => {
            setLogs(result.registers);
            setTotalPages(result.total_pages);
        }).catch(apiError => {
            console.warn('Erro ao carregar produtos:', apiError);
            setLoading(false);
        }).finally(() => {
            setLoading(false);
        });
    }, [page, startDate, endDate]);

    // Filtrar logs baseado em busca (SEM chamada à API)
    const filteredLogs = useMemo(() => {
        return logs.filter(l => {
            const matchesSearch = l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.userOccupation.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [logs, searchTerm]);

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '-';
        const date = new Date(dateTime);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const handlePageChange = (event) => {
        setPage(event.selected + 1);
        fetchRegisters(event.selected + 1);
        window.scrollTo(0, 0);
    };

    return (
        <Layout>
            <div className="min-h-screen mx-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                        Registros de Ponto
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Total de {logs.length} registros encontrados
                    </p>
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
                                <Label className="mb-2 block">Data de Início</Label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-fit"
                                    disabled={loading}
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block">Data de Término</Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-fit"
                                    disabled={loading}
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
                                    setLogs(registers || []);
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Carregando...' : 'Limpar Filtros'}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Tabela */}
                <Card className="shadow-lg overflow-hidden">
                    <CardHeader className="bg-slate-100 dark:bg-slate-800 border-b">
                        <CardTitle>{loading ? 'Carregando registros...' : 'Lista de Registros'}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        {logs.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-slate-500 dark:text-slate-400">
                                    {loading ? 'Carregando registros...' : 'Nenhum registro encontrado'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-900 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">ID</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Nome</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Cargo</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Idade</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Gestor</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">Data e Hora</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLogs.map((log) => (
                                            <tr
                                                key={log.id}
                                                className="border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-semibold">#{log.id}</td>
                                                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{log.fullName}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{log.userOccupation}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{log.userAge}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{log.adminManager}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono text-xs">
                                                    {formatDateTime(log.registerTime)}
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
            </div>
        </Layout>
    );
}
