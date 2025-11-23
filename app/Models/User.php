<?php

namespace App\Models;

use App\Models\Admin;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'admin_id',
        'name',
        'email',
        'tax_id',
        'birth_date',
        'occupation',
        'zipcode',
        'street',
        'state',
        'city',
        'neighborhood',
        'password',
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

    public function manager()
    {
        return $this->belongsTo(Admin::class);
    }

    public function punchClockLogs()
    {
        return $this->hasMany(PunchClockLogs::class, 'user_id', 'id');
    }
}
