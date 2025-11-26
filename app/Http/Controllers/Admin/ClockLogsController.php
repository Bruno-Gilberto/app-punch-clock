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
        //@dd($request->has('start_date') && !is_null($request->start_date));
        if ($request->has('start_date') && !is_null($request->start_date)) $startDate = Carbon::parse($request->start_date);        
        if ($request->has('end_date') && !is_null($request->end_date)) $endDate = Carbon::parse($request->end_date);
        if ($request->has('page') && $request->page) $page = $request->page;
        if ($request->has('perPage') && $request->perPage) $perPage = $request->perPage;

        $results = PunchClockLogs::listQuery($page ?? 1, $perPage ?? 20, $startDate ?? null, $endDate ?? null);


        if($request->wantsJson()) return response()->json([
            'currentPage' => $results['page'],
            'total_pages' => $results['total_pages'],
            'registers' => $results['data']
        ]);

        return Inertia::render('Admin/RegisterList', [
            'currentPage' => $results['page'],
            'total_pages' => $results['total_pages'],
            'registers' => $results['data']
        ]);
    }
}
