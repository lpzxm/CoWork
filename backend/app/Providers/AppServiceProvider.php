<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Passport\Passport;
use Carbon\Carbon;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Passport::tokensExpireIn(now()->addHours(1));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));

        RateLimiter::for('api', fn (Request $job) => Limit::perMinute(100)->by($job->user()?->id ?: $job->ip()));

        RateLimiter::for('login', fn (Request $job) => Limit::perMinute(5)->by($job->input('email').'|'.$job->ip()));

        RateLimiter::for('verify', fn (Request $job) => Limit::perMinute(5)->by($job->input('email').'|'.$job->ip()));
    }
}
