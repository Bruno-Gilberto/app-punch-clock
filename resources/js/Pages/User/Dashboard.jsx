import React, { useState } from "react";
import authUser from "@/hooks/authUser";
import { useForm } from '@inertiajs/react'
import { Button } from "@/Components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import Layout from "@/Components/layouts/Layout";
import Clock from "@/Components/ui/Clock";
import { CheckCircle2, Clock as ClockIcon, AlertCircle } from "lucide-react";

export default function Dashboard({ type }) {
  const user = authUser();
  const [nextType, setNextType] = useState(type);
  const [showMessage, setShowMessage] = useState(false);
  const [messageData, setMessageData] = useState(null);
  const { data, setData, post, processing } = useForm({
    type: nextType,
  });

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getEncouragingMessage = (type) => {
    const messages = {
      in: [
        "Vamos começar! 💪",
        "Bom trabalho! Você vai arrasar hoje 🚀",
        "Que comece o espetáculo! 🎯",
        "Dia promissor pela frente! ✨",
        "Preparado para conquistar? ��",
      ],
      out: [
        "Aproveite seu intervalo! ☕",
        "Descanse e recarregue as energias 🔋",
        "Pausa merecida! 🌟",
        "Aproveite bem seu tempo livre 🎉",
        "Volte com energia redobrada! 💚",
      ],
    };

    const typeMessages = messages[type] || messages.in;
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  };

  const handlePunchClock = (e) => {
    e.preventDefault();

    post(`/user/punch/clock/${user.id}`, {
      onSuccess: (page) => {
        const result = page.props.response;
        const nextTypeResult = result?.nextType === 'in' ? 'out' : 'in';

        // Mostrar mensagem de incentivo
        const encouragement = getEncouragingMessage(nextType);

        setMessageData({
          type: nextType,
          message: encouragement,
          nextType: nextTypeResult
        });

        setShowMessage(true);

        // Atualizar tipo para próximo
        setNextType(nextTypeResult);

        // Esconder mensagem após 5 segundos
        setTimeout(() => setShowMessage(false), 5000);
      }
    });
  };

  const getStatusInfo = () => {
    if (nextType === 'in') {
      return {
        title: 'Você está saído',
        description: 'Clique para registrar sua entrada',
        icon: '📍',
        buttonText: 'Bater Ponto - ENTRADA',
        color: 'bg-blue-50 dark:bg-blue-950',
        textColor: 'text-blue-900 dark:text-blue-100'
      };
    }
    return {
      title: 'Você está trabalhando',
      description: 'Clique para registrar sua saída',
      icon: '⏱️',
      buttonText: 'Bater Ponto - SAÍDA',
      color: 'bg-green-50 dark:bg-green-950',
      textColor: 'text-green-900 dark:text-green-100'
    };
  };

  const status = getStatusInfo();

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

          {/* Mensagem de incentivo após bater ponto */}
          {showMessage && messageData && (
            <Alert className="mb-6 border-2 border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-400">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-lg font-semibold text-green-800 dark:text-green-300">
                {messageData.type === 'in' ? '✅ Entrada Registrada' : '✅ Saída Registrada'}
              </AlertTitle>
              <AlertDescription className="text-base text-green-700 dark:text-green-200 font-medium mt-2">
                {messageData.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Card principal - Status e Ação */}
          <Card className="mb-8 border-2 shadow-lg overflow-hidden">
            <CardHeader className={`${status.color}`}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl md:text-6xl">{status.icon}</span>
                <div>
                  <CardTitle className={`text-2xl md:text-3xl ${status.textColor}`}>{status.title}</CardTitle>
                  <CardDescription className={`text-base ${status.textColor} opacity-75`}>{status.description}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handlePunchClock} className="space-y-4">
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full text-lg py-6 font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                  size="lg"
                  variant={nextType === 'in' ? 'default' : 'secondary'}
                >
                  {processing ? '⏳ Registrando...' : status.buttonText}
                </Button>
              </form>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                Clique acima para registrar sua {nextType === 'in' ? 'entrada' : 'saída'}
              </p>
            </CardContent>
          </Card>

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

            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Status Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {nextType === 'in' ? (
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-2">
                      <span className="h-3 w-3 bg-red-600 dark:bg-red-400 rounded-full animate-pulse"></span>
                      Ausente
                    </span>
                  ) : (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-2">
                      <span className="h-3 w-3 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></span>
                      Trabalhando
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Rodapé com dicas */}
          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>💡 Dica: Mantenha seu ponto registrado para um controle preciso de sua jornada</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
