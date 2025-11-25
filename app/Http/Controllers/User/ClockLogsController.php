<?php

namespace App\Http\Controllers\User;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\User;
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

        $results = PunchClockLogs::listQuery($startDate ?? null, $endDate ?? null, Auth::guard('user')->id());

        if($request->wantsJson()) return response()->json($results);

        return Inertia::render('User/RegisterList', [
            'registers' => $results
        ]);
    }

    public function store(Request $request, User $user){

        DB::beginTransaction();

        try {
            // Último registro do usuário
            $lastLog = $user->punchLogs()->latest()->first();
            $currentType = $lastLog ? $lastLog->type : null;

            // Lógica Inteligente: Alterna entre IN e OUT
            $nextType = $currentType === 'in' ? 'out' : 'in';

            PunchClockLogs::create([
                'user_id' => $user->id,
                'time' => Carbon::now('America/Sao_Paulo'),
                'type' => $nextType,
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Erro ao registrar ponto: ' . $e->getMessage());
        }

        return back()->with('response', [
            'nextType' => $nextType
        ])->with('success', 'Ponto registrado com sucesso.');
    }
}