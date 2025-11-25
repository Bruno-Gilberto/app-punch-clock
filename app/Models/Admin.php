<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Notifications\Notifiable;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'users_admin';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'tax_id',
        'birth_date',
        'occupation',
        'zipcode',
        'street',
        'state',
        'city',
        'neighborhood',
        'email',
        'password',
    ];
    
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'email_verified_at',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = ['age'];

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

    protected function age(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->birth_date ? Carbon::parse($this->birth_date)->age : null,
        );
    }
    
    public function listUsers()
    {
        return $this->hasMany(User::class);
    }

    public function listRegisters()
    {

        $results = DB::select('
            SELECT 
                p.id,
                p.time AS registerTime,
                u.name AS fullName,
                u.birth_date,
                TIMESTAMPDIFF(YEAR, u.birth_date, CURDATE()) AS userAge,
                u.occupation as userOccupation,
                a.name AS adminManager
            FROM
                punch_clock_logs AS p
            JOIN
                users AS u ON p.user_id = u.id
            LEFT JOIN
                users_admin AS a ON u.admin_id = a.id
        ');

        return $results;
    }
}
