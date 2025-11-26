import React, { useState } from "react";
import authUser from "@/hooks/authUser";
import { useForm } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import Layout from "@/Components/layouts/Layout";
import Clock from "@/Components/ui/Clock";
import { Clock as ClockIcon } from "lucide-react";

export default function Dashboard() {
    const user = authUser();
    const [nextType, setNextType] = useState('in');
    const { data, setData, post, processing } = useForm({
        type: nextType,
    });

    const getGreetingMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Cabeçalho com saudação */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                            {getGreetingMessage()}, <span className="text-blue-600 dark:text-blue-400">{user?.name || 'Usuário'}</span>! 👋
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            {new Date().toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>

                    {/* Informações adicionais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="shadow-md">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                                    <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    Horário Atual
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-slate-900 dark:text-white font-mono">
                                    <Clock />
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
