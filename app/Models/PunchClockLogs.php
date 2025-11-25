<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PunchClockLogs extends Model
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'time',
        'type',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userLogs()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public static function listQuery($start = null, $end = null, $userId = null)
    {
        $baseQuery = 'SELECT 
                p.id,
                p.time AS registerTime,
                p.type AS type, -- Adicionei o tipo de log aqui, se precisar
                u.name AS fullName,
                u.birth_date,
                TIMESTAMPDIFF(YEAR, u.birth_date, CURDATE()) AS userAge,
                u.occupation AS userOccupation,
                a.name AS adminManager
            FROM
                punch_clock_logs AS p
            JOIN
                users AS u ON p.user_id = u.id
            LEFT JOIN
                users_admin AS a ON u.admin_id = a.id';

        // Se nenhum filtro for aplicado, retorne a query base
        if (is_null($userId) && is_null($start) && is_null($end)) return DB::select($baseQuery);

        // --- Tratamento de Filtros ---
        $bindings = [];
        $whereClauses = [];

        if (!is_null($userId)) {
            $bindings[] = $userId;
            $whereClauses[] = 'p.user_id = ?';
        }

        // Certifique-se de que start e end sejam definidos juntos para BETWEEN
        if (!is_null($start) && !is_null($end)) {
            $whereClauses[] = 'p.time BETWEEN ? AND ?';
            // Garante que a data menor vá primeiro (formato MySQL)
            $bindings[] = min($start, $end)->startOfDay()->format('Y-m-d H:i:s');
            $bindings[] = max($start, $end)->endOfDay()->format('Y-m-d H:i:s');
        }

        // Combina a query base com as cláusulas WHERE
        if (!empty($whereClauses)) {
            // Junta as cláusulas WHERE com ' AND '
            $query = $baseQuery . ' WHERE ' . implode(' AND ', $whereClauses);
            return DB::select($query, $bindings);
        }

        // Caso não coberto acima, apenas retorna a base
        return DB::select($baseQuery);
    }
}