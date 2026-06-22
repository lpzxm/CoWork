<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;

use OwenIt\Auditing\Contracts\Auditable;
use \OwenIt\Auditing\Auditable as AuditableTrait;
use OwenIt\Auditing\Models\Audit;

#[Table('status')]
#[Fillable(['name', 'color', 'active'])]
class Status extends Model implements Auditable
{
    const CREATED = 1;
    const PENDING = 2;
    const IN_PROGRESS = 3;
    const COMPLETED = 4;
    const IN_REVIEW = 5;
    const APPROVED = 6;
    const REJECTED = 7;
    
    use AuditableTrait;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'active' => 'boolean',
        ];
    }


    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'status_id');
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(SubTask::class, 'status_id');
    }
}
