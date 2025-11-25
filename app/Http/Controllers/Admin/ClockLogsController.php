<?php

namespace App\Http\Controllers\Admin;

use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PunchClockLogs;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class ClockLogsController extends Controller
{
    public function show(Request $request){
        // Filtrar por data se fornecido
        if ($request->has('start_date') && $request->start_date) $startDate = Carbon::parse($request->start_date);        
        if ($request->has('end_date') && $request->end_date) $endDate = Carbon::parse($request->end_date);

        $results = PunchClockLogs::listQuery($startDate ?? null, $endDate ?? null);

        if($request->wantsJson()) return response()->json($results);

        return Inertia::render('User/RegisterList', [
            'registers' => $results
        ]);
    }
}
