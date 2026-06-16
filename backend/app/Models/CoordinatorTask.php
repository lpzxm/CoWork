<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use OwenIt\Auditing\Contracts\Auditable;

#[Table('coordinator_tasks')]
#[Fillable(['user_id', 'task_id', 'assigned_at', 'assigned_by'])]
class CoordinatorTask extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

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
