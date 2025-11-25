<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'admin_id' => 1,
            'name' => 'João Silva',
            'email' => 'joao@example.com',
            'tax_id' => '123.456.789-10',
            'birth_date' => Carbon::parse('1990-05-15'),
            'occupation' => 'Desenvolvedor',
            'zipcode' => '01310100',
            'street' => 'Avenida Paulista',
            'state' => 'SP',
            'city' => 'São Paulo',
            'neighborhood' => 'Bela Vista',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'admin_id' => 1,
            'name' => 'Maria Santos',
            'email' => 'maria@example.com',
            'tax_id' => '987.654.321-09',
            'birth_date' => Carbon::parse('1992-08-22'),
            'occupation' => 'Analista de Sistemas',
            'zipcode' => '20040020',
            'street' => 'Avenida Rio Branco',
            'state' => 'RJ',
            'city' => 'Rio de Janeiro',
            'neighborhood' => 'Centro',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'admin_id' => 1,
            'name' => 'Pedro Oliveira',
            'email' => 'pedro@example.com',
            'tax_id' => '456.789.123-45',
            'birth_date' => Carbon::parse('1988-03-10'),
            'occupation' => 'Gerente de Projetos',
            'zipcode' => '30130100',
            'street' => 'Rua da Bahia',
            'state' => 'MG',
            'city' => 'Belo Horizonte',
            'neighborhood' => 'Centro',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        User::factory(7)->create();
    }
}
