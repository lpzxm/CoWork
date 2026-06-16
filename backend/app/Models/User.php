<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\Contracts\OAuthenticatable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use OwenIt\Auditing\Contracts\Auditable;
use \OwenIt\Auditing\Auditable as AuditableTrait;

#[Fillable(['name', 'email', 'password', 'active'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements OAuthenticatable, Auditable
{

    protected $auditExclude = [
        'password',
        'remember_token',
    ];
    
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles, AuditableTrait;

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
            'active' => 'boolean',
        ];
    }

    public static function makeRandomPassword()
    {
        $password = Str::password(9, letters: true, numbers: true, symbols: true); // hashear contraseña generada para almacenamiento seguro en base de datos
        return $password;
    }

    public function verifyAuthCodes () : HasMany
    {
        return $this->hasMany(VerifyCode::class);
    }

    public function assignedTasks() : BelongsToMany{
        return $this->belongsToMany(Task::class, 'coordinator_tasks')->withPivot('assigned_by')->withTimestamps();
    }

    public function createdTasks() : HasMany {
        return $this->hasMany(Task::class, 'created_by');
    }

    public function uploadedFiles() : HasMany {
        return $this->hasMany(File::class, 'uploaded_by');
    }
}
