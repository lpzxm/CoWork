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
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use OwenIt\Auditing\Contracts\Auditable;
use \OwenIt\Auditing\Auditable as AuditableTrait;
use OwenIt\Auditing\Models\Audit;

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
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function auditLogin(): void
    {
        $this->logCustomAudit('login', ['action' => 'Usuario autenticado correctamente.']);
    }

    public function auditLogout(): void
    {
        $this->logCustomAudit('logout', ['action' => 'Sesión destruida por el usuario.']);
    }

    public function auditRequestToken(string $tokenType = 'auth_token'): void
    {
        $this->logCustomAudit('requestToken', ['token_type' => $tokenType]);
    }

    private function logCustomAudit(string $event, array $newValues = []): void
    {
        $request = request();

        Audit::create([
            'user_type'      => static::class,
            'user_id'        => $this->id,
            'event'          => $event,
            'auditable_type' => static::class,
            'auditable_id'   => $this->id,
            'old_values'     => [],
            'new_values'     => $newValues,
            'url'            => $request->fullUrl(),
            'ip_address'     => $request->ip(),
            'user_agent'     => $request->userAgent(),
        ]);
    }

    public static function makeRandomPassword(): string
    {
        $lower = 'abcdefghijklmnopqrstuvwxyz';
        $upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $digits = '0123456789';
        $special = '@$!%*?&#^_~()-+={}[]|;:,.<>';

        $password = $lower[random_int(0, 25)] .
            $upper[random_int(0, 25)] .
            $digits[random_int(0, 9)] .
            $special[random_int(0, strlen($special) - 1)];

        $all = $lower . $upper . $digits . $special;
        for ($i = 0; $i < 5; $i++) {
            $password .= $all[random_int(0, strlen($all) - 1)];
        }

        return str_shuffle($password);
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
