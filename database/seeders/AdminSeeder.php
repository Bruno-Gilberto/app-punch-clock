<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'name' => 'Ederson Silva',
            'tax_id' => '123.456.789-20',
            'birth_date' => Carbon::parse('1998-11-22'),
            'occupation' => 'Administrador',
            'zipcode' => '01310100',
            'street' => 'Avenida Paulista',
            'state' => 'SP',
            'city' => 'São Paulo',
            'neighborhood' => 'Bela Vista',
            'email' => 'test@example.com',
            'password' => Hash::make('12345'),
        ]);
    }
}
