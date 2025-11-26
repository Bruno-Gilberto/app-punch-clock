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

        // Simular 5 semanas de registros de ponto
        $daysToSimulate = 35; // 5 semanas

        foreach ($users as $user) {
            for ($i = 0; $i < $daysToSimulate; $i++) {
                // Pular finais de semana (sábado = 6, domingo = 0)
                $date = Carbon::today()->subDays($i);
                if ($date->dayOfWeek === 0 || $date->dayOfWeek === 6) continue;
                
                // Entrada da manhã (8:00 - 8:45)
                PunchClockLogs::create([
                    'user_id' => $user->id,
                    'time' => $date->clone()->setTime(
                        8,
                        rand(0, 45),
                        rand(0, 59)
                    ),
                    'type' => 'in',
                ]);

                // Saída para almoço (12:00 - 12:45)
                PunchClockLogs::create([
                    'user_id' => $user->id,
                    'time' => $date->clone()->setTime(
                        12,
                        rand(0, 45),
                        rand(0, 59)
                    ),
                    'type' => 'out',
                ]);

                // Entrada depois do almoço (13:00 - 13:30)
                PunchClockLogs::create([
                    'user_id' => $user->id,
                    'time' => $date->clone()->setTime(
                        13,
                        rand(0, 30),
                        rand(0, 59)
                    ),
                    'type' => 'in',
                ]);

                // Saída final (17:00 - 18:00)
                PunchClockLogs::create([
                    'user_id' => $user->id,
                    'time' => $date->clone()->setTime(
                        rand(17, 18),
                        rand(0, 59),
                        rand(0, 59)
                    ),
                    'type' => 'out',
                ]);

                // Ocasionalmente adicionar alguns registros extras (horas extras)
                if (rand(1, 100) > 80) { // 20% de chance
                    PunchClockLogs::create([
                        'user_id' => $user->id,
                        'time' => $date->clone()->setTime(
                            19,
                            rand(0, 59),
                            rand(0, 59)
                        ),
                        'type' => 'in',
                    ]);

                    PunchClockLogs::create([
                        'user_id' => $user->id,
                        'time' => $date->clone()->setTime(
                            rand(19, 22),
                            rand(0, 59),
                            rand(0, 59)
                        ),
                        'type' => 'out',
                    ]);
                }
            }
        }
    }
}
