<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OwenIt\Auditing\Contracts\Auditable;

#[Table('status')]
#[Fillable(['name', 'color', 'active'])]
class Status extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;


    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'status_id');
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(SubTask::class, 'status_id');
    }
}
