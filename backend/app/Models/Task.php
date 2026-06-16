<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

use OwenIt\Auditing\Contracts\Auditable;

#[Table('tasks')]
#[Fillable(['title', 'description', 'status_id', 'created_by', 'accepted_by', 'declined_by', 'updated_by', 'deleted_by', 'dt_delivery_limit'])]
class Task extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    use SoftDeletes;

    public function creator() : BelongsTo {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function acceptor() : BelongsTo {
        return $this->belongsTo(User::class, 'accepted_by');
    }

    public function decliner() : BelongsTo {
        return $this->belongsTo(User::class, 'declined_by');
    }

    public function updater() : BelongsTo {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deleter() : BelongsTo {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    public function subtasks() : HasMany {
        return $this->hasMany(SubTask::class);
    }

    public function coordinators() : BelongsToMany {
        return $this->belongsToMany(User::class, 'coordinator_tasks')->withPivot('assigned_by')->withPivot('assigned_at')->withTimestamps();
    }

    public function files() : HasMany {
        return $this->hasMany(File::class);
    }

    public function status() : BelongsTo
    {
        return $this->belongsTo(Status::class);
    }
}
