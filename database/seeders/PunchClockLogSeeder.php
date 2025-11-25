<?php

namespace Database\Seeders;

use App\Models\PunchClockLogs;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PunchClockLogSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            // Entrada manhã
            PunchClockLogs::create([
                'user_id' => $user->id,
                'time' => Carbon::now()->setTime(8, 30, 0),
                'type' => 'in',
            ]);

            // Saída almoço
            PunchClockLogs::create([
                'user_id' => $user->id,
                'time' => Carbon::now()->setTime(12, 0, 0),
                'type' => 'out',
            ]);

            // Entrada depois do almoço
            PunchClockLogs::create([
                'user_id' => $user->id,
                'time' => Carbon::now()->setTime(13, 0, 0),
                'type' => 'in',
            ]);

            // Saída final
            PunchClockLogs::create([
                'user_id' => $user->id,
                'time' => Carbon::now()->setTime(17, 30, 0),
                'type' => 'out',
            ]);
        }
    }
}
