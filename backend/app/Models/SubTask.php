<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

use OwenIt\Auditing\Contracts\Auditable;

#[Table('sub_tasks')]
#[Fillable(['task_id', 'title', 'description', 'status_id', 'created_by', 'accepted_by', 'declined_by', 'updated_by', 'deleted_by', 'dt_delivery_limit'])]
class SubTask extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    use SoftDeletes;
    
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function acceptor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'accepted_by');
    }

    public function decliner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'declined_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function deleter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}
