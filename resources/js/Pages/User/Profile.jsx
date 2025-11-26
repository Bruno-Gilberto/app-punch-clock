import React, { useState, useEffect } from "react";
import authUser from "@/hooks/authUser";
import { useForm, usePage } from "@inertiajs/react";
import Layout from "@/Components/layouts/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { AlertCircle, CheckCircle, Eye, EyeOff, User } from "lucide-react";
import { formatCEP, formatCPF } from "@/lib/formatters";
import { validateCPF } from "@/lib/validators";

export default function Profile({ profile }) {
    const user = authUser();
    const [cpfError, setCpfError] = useState("");
    const [activeTab, setActiveTab] = useState("info");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const profileForm = useForm({
        name: profile?.name || "",
        email: profile?.email || "",
        tax_id: profile?.tax_id || "",
        birth_date: profile?.birth_date || "",
        occupation: profile?.occupation || "",
        zipcode: profile?.zipcode || "",
        street: profile?.street || "",
        neighborhood: profile?.neighborhood || "",
        city: profile?.city || "",
        state: profile?.state || "",
    });

    const passwordForm = useForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    useEffect(() => {
        if (profile) {
            profileForm.setData({
                name: profile.name || "",
                email: profile.email || "",
                tax_id: profile.tax_id || "",
                birth_date: profile.birth_date || "",
                occupation: profile.occupation || "",
                zipcode: profile.zipcode || "",
                street: profile.street || "",
                neighborhood: profile.neighborhood || "",
                city: profile.city || "",
                state: profile.state || "",
            });
        }
    }, [profile]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        profileForm.setData(name, value);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        passwordForm.setData(name, value);
    };

    const handleSubmitProfile = (e) => {
        e.preventDefault();
        profileForm.put(`/user/profile/${user?.id}`, {
            onSuccess: () => {
                profileForm.reset();
            },
        });
    };

    const handleCPFChange = (value) => {
        const formatted = formatCPF(value);
        setData('tax_id', formatted);

        if (formatted.replace(/\D/g, '').length === 11) validateCPF(formatted, setCpfError);
    };

    const handleSubmitPassword = (e) => {
        e.preventDefault();

        if (passwordForm.data.new_password !== passwordForm.data.confirm_password) {
            alert("As senhas não coincidem!");
            return;
        }

        if (passwordForm.data.new_password.length < 6) {
            alert("A nova senha deve ter pelo menos 6 caracteres!");
            return;
        }

        passwordForm.put(`/user/profile/change-password/${user?.id}`, {
            onSuccess: () => {
                passwordForm.reset();
                setShowPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);
            },
        });
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return "";
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    if (!profile) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-slate-600 dark:text-slate-400">Carregando perfil...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                            Meu Perfil
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Gerencie suas informações pessoais e segurança
                        </p>
                    </div>

                    <Card className="shadow-lg">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="border-b border-slate-200 dark:border-slate-700">
                                <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
                                    <TabsTrigger
                                        value="info"
                                        className="rounded-none border-b-2 border-transparent px-6 py-4 text-base font-medium data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                                    >
                                        Informações Pessoais
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="password"
                                        className="rounded-none border-b-2 border-transparent px-6 py-4 text-base font-medium data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                                    >
                                        Alterar Senha
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="info" className="p-6">
                                <form onSubmit={handleSubmitProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                                                Nome Completo
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                value={profileForm.data.name}
                                                onChange={handleProfileChange}
                                                className="border-slate-300 dark:border-slate-600"
                                                placeholder="Seu nome completo"
                                            />
                                            {profileForm.errors.name && (
                                                <p className="text-red-600 dark:text-red-400 text-sm">{profileForm.errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={profileForm.data.email}
                                                onChange={handleProfileChange}
                                                className="border-slate-300 dark:border-slate-600"
                                                placeholder="seu.email@example.com"
                                            />
                                            {profileForm.errors.email && (
                                                <p className="text-red-600 dark:text-red-400 text-sm">{profileForm.errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="tax_id" className="text-slate-700 dark:text-slate-300">
                                                CPF
                                            </Label>
                                            <Input
                                                id="tax_id"
                                                name="tax_id"
                                                type="text"
                                                value={profileForm.data.tax_id}
                                                onChange={(e) => handleCPFChange(e.target.value)}
                                                placeholder="000.000.000-00"
                                                disabled
                                                className={profileForm.errors.tax_id || cpfError ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}
                                            />
                                            {(profileForm.errors.tax_id || cpfError) && (
                                                <p className="text-red-600 dark:text-red-400 text-sm">{profileForm.errors.tax_id || cpfError}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="birth_date" className="text-slate-700 dark:text-slate-300">
                                                Data de Nascimento
                                            </Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="birth_date"
                                                    name="birth_date"
                                                    type="date"
                                                    value={profileForm.data.birth_date}
                                                    onChange={handleProfileChange}
                                                    className="border-slate-300 dark:border-slate-600 flex-1"
                                                />
                                                {profileForm.data.birth_date && (
                                                    <div className="flex items-center px-3 bg-slate-100 dark:bg-slate-800 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        {calculateAge(profileForm.data.birth_date)} anos
                                                    </div>
                                                )}
                                            </div>
                                            {profileForm.errors.birth_date && (
                                                <p className="text-red-600 dark:text-red-400 text-sm">{profileForm.errors.birth_date}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="occupation" className="text-slate-700 dark:text-slate-300">
                                            Cargo
                                        </Label>
                                        <Input
                                            id="occupation"
                                            name="occupation"
                                            type="text"
                                            value={profileForm.data.occupation}
                                            onChange={handleProfileChange}
                                            className="border-slate-300 dark:border-slate-600"
                                            placeholder="Seu cargo/posição"
                                        />
                                        {profileForm.errors.occupation && (
                                            <p className="text-red-600 dark:text-red-400 text-sm">{profileForm.errors.occupation}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="zipcode" className="text-slate-700 dark:text-slate-300">
                                            CEP
                                        </Label>
                                        <Input
                                            id="zipcode"
                                            name="zipcode"
                                            type="text"
                                            value={profileForm.data.zipcode}
                                            onChange={(e) =>
                                                profileForm.setData("zipcode", formatCEP(e.target.value))
                                            }
                                            className="border-slate-300 dark:border-slate-600"
                                            placeholder="00000-000"
                                        />
                                        {profileForm.errors.zipcode && (
                                            <p className="text-red-600 dark:text-red-400 text-sm">{profileForm.errors.zipcode}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="street" className="text-slate-700 dark:text-slate-300">
                                            Rua
                                        </Label>
                                        <Input
                                            id="street"
                                            name="street"
                                            type="text"
                                            value={profileForm.data.street}
                                            onChange={handleProfileChange}
                                            className="border-slate-300 dark:border-slate-600"
                                            placeholder="Nome da rua"
                                        />
                                        {profileForm.errors.street && (
                                            <p className="text-red-600 dark:text-red-400 text-sm">{profileForm.errors.street}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="neighborhood" className="text-slate-700 dark:text-slate-300">
                                                Bairro
                                            </Label>
                                            <Input
                                                id="neighborhood"
                                                name="neighborhood"
                                                type="text"
                                                value={profileForm.data.neighborhood}
                                                onChange={handleProfileChange}
                                                className="border-slate-300 dark:border-slate-600"
                                                placeholder="Seu bairro"
                                            />
                                            {profileForm.errors.neighborhood && (
                                                <p className="text-red-600 dark:text-red-400 text-sm">{profileForm.errors.neighborhood}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="city" className="text-slate-700 dark:text-slate-300">
                                                Cidade
                                            </Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                type="text"
                                                value={profileForm.data.city}
                                                onChange={handleProfileChange}
                                                className="border-slate-300 dark:border-slate-600"
                                                placeholder="Sua cidade"
                                            />
                                            {profileForm.errors.city && (
                                                <p className="text-red-600 dark:text-red-400 text-sm">{profileForm.errors.city}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state" className="text-slate-700 dark:text-slate-300">
                                            Estado
                                        </Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            type="text"
                                            value={profileForm.data.state}
                                            onChange={(e) =>
                                                profileForm.setData("state", e.target.value.toUpperCase().slice(0, 2))
                                            }
                                            className="border-slate-300 dark:border-slate-600"
                                            placeholder="SP"
                                            maxLength="2"
                                        />
                                        {profileForm.errors.state && (
                                            <p className="text-red-600 dark:text-red-400 text-sm">{profileForm.errors.state}</p>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                profileForm.reset();
                                            }}
                                            className="border-slate-300 dark:border-slate-600"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {profileForm.processing ? "Salvando..." : "Salvar Informações"}
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="password" className="p-6">
                                <form onSubmit={handleSubmitPassword} className="max-w-md space-y-6">
                                    <Alert className="border-blue-600 bg-blue-50 dark:bg-blue-950">
                                        <AlertCircle className="h-4 w-4 text-blue-600" />
                                        <AlertDescription className="ml-4 text-blue-800 dark:text-blue-200">
                                            Por segurança, sua senha deve ter pelo menos 6 caracteres
                                        </AlertDescription>
                                    </Alert>

                                    <div className="space-y-2">
                                        <Label htmlFor="current_password" className="text-slate-700 dark:text-slate-300">
                                            Senha Atual
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="current_password"
                                                name="current_password"
                                                type={showPassword ? "text" : "password"}
                                                value={passwordForm.data.current_password}
                                                onChange={handlePasswordChange}
                                                className="border-slate-300 dark:border-slate-600 pr-10"
                                                placeholder="Digite sua senha atual"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {passwordForm.errors.current_password && (
                                            <p className="text-red-600 dark:text-red-400 text-sm">
                                                {passwordForm.errors.current_password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="new_password" className="text-slate-700 dark:text-slate-300">
                                            Nova Senha
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="new_password"
                                                name="new_password"
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwordForm.data.new_password}
                                                onChange={handlePasswordChange}
                                                className="border-slate-300 dark:border-slate-600 pr-10"
                                                placeholder="Digite sua nova senha"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {passwordForm.errors.new_password && (
                                            <p className="text-red-600 dark:text-red-400 text-sm">
                                                {passwordForm.errors.new_password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm_password" className="text-slate-700 dark:text-slate-300">
                                            Confirmar Nova Senha
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirm_password"
                                                name="confirm_password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={passwordForm.data.confirm_password}
                                                onChange={handlePasswordChange}
                                                className="border-slate-300 dark:border-slate-600 pr-10"
                                                placeholder="Confirme sua nova senha"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {passwordForm.errors.confirm_password && (
                                            <p className="text-red-600 dark:text-red-400 text-sm">
                                                {passwordForm.errors.confirm_password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => passwordForm.reset()}
                                            className="border-slate-300 dark:border-slate-600"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {passwordForm.processing ? "Alterando..." : "Alterar Senha"}
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
