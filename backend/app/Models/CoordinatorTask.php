<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use OwenIt\Auditing\Contracts\Auditable;
use \OwenIt\Auditing\Auditable as AuditableTrait;
use OwenIt\Auditing\Models\Audit;

#[Table('coordinator_tasks')]
#[Fillable(['user_id', 'task_id', 'assigned_at', 'assigned_by'])]
class CoordinatorTask extends Model implements Auditable
{
    use AuditableTrait;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public function assigner() : BelongsTo {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function task() : BelongsTo {
        return $this->belongsTo(Task::class);
    }

    public function user() : BelongsTo {
        return $this->belongsTo(User::class);
    }
}
