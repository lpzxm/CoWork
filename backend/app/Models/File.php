<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\SoftDeletes;


#[Table('files')]
#[Fillable(['task_id', 'sub_task_id', 'file_type', 'file_name', 'url', 'uploaded_by'])] 
class File extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    use SoftDeletes;

    public function task() : BelongsTo {
        return $this->belongsTo(Task::class);
    }

    public function subTask() : BelongsTo {
        return $this->belongsTo(SubTask::class);
    }

    public function uploader() : BelongsTo {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
