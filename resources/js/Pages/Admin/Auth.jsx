import React, { useState } from "react";
import { useForm, Link } from '@inertiajs/react'
import Layout from "@/Components/layouts/Layout";

export default function Auth() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/admin/login')
  }
  
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg bg-card text-card-foreground shadow-sm rounded-[--radius] overflow-hidden">

          {/* Lado direito - Formulário */}
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
              Acesse sua conta
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="E-mail"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="mt-1 w-full rounded-[--radius] text-foreground border border-input bg-background"
              />
              <input
                type="password"
                placeholder="Senha"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="mt-1 w-full rounded-[--radius] text-foreground border border-input bg-background"
              />
              {errors.password && <div className="text-destructive text-sm">{errors.password}</div>}

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-[--radius] transition-colors"
              >
                Acessar
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}