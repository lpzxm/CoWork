<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

use OwenIt\Auditing\Contracts\Auditable;

#[Table('verify_codes')]
#[Fillable(['user_id', 'code', 'type', 'expires_at', 'used_at'])]
class VerifyCode extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    
    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isValid() : bool
    {
        return !$this->used_at && now()->lt($this->expires_at);
    }
}
