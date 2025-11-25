<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $query = User::with(['manager']);
        
        // Filtrar por data se fornecido
        if ($request->has('start_date') && $request->start_date) $query->whereDate('created_at', '>=', $request->start_date);
        
        if ($request->has('end_date') && $request->end_date) $query->whereDate('created_at', '<=', $request->end_date);
        
        // Busca por nome ou cargo
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('occupation', 'like', "%{$search}%");
        }
        
        $users = $query->orderBy('name', 'ASC')->get()->map(function($user){
            $user->userAge = $user->age;
            $user->adminManager = $user->manager->name;
            return $user;
        });
        
        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'tax_id' => 'required|string|unique:users,tax_id|regex:/^\d{3}\.\d{3}\.\d{3}-\d{2}$/',
            'birth_date' => 'required|date|before:today',
            'occupation' => 'required|string|max:255',
            'zipcode' => 'required|numeric|digits_between:8,8',
            'street' => 'required|string|max:255',
            'state' => 'required|string|size:2|uppercase',
            'city' => 'required|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'password' => 'required|string|min:6',
            'admin_id' => 'required|exists:users_admin,id',
        ], [
            'email.unique' => 'Este email já está cadastrado',
            'tax_id.unique' => 'Este CPF já está cadastrado',
            'tax_id.regex' => 'CPF deve estar no formato: 000.000.000-00',
            'zipcode.regex' => 'CEP deve estar no formato: 00000-000',
            'birth_date.before' => 'A data de nascimento deve ser anterior a hoje',
        ]);
    
        DB::beginTransaction();

        try {
            $user = User::create($validated);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Erro ao adicionar funcionário: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Funcionário criado com sucesso!');
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'tax_id' => ['required', 'string', Rule::unique('users', 'tax_id')->ignore($user->id), 'regex:/^\d{3}\.\d{3}\.\d{3}-\d{2}$/'],
            'birth_date' => 'required|date|before:today',
            'occupation' => 'required|string|max:255',
            'zipcode' => 'required|numeric|digits_between:8,8',
            'street' => 'required|string|max:255',
            'state' => 'required|string|size:2|uppercase',
            'city' => 'required|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'password' => 'nullable|string|min:6',
            'admin_id' => 'required|exists:users_admin,id',
        ], [
            'email.unique' => 'Este email já está cadastrado',
            'tax_id.unique' => 'Este CPF já está cadastrado',
            'tax_id.regex' => 'CPF deve estar no formato: 000.000.000-00',
            'zipcode.regex' => 'CEP deve estar no formato: 00000-000',
            'birth_date.before' => 'A data de nascimento deve ser anterior a hoje',
        ]);
        
        // Apenas atualizar senha se fornecida
        if (!empty($validated['password']) && $validated['password'] != '') $validated['password'] = bcrypt($validated['password']);
        else unset($validated['password']);

        DB::beginTransaction();

        try {
            $user->update($validated);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Erro ao atualizar funcionário: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Funcionário atualizado com sucesso.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        DB::beginTransaction();

        try {
            $user->delete();
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Erro ao deletar funcionário: ' . $e->getMessage());
        }
        
        return redirect()->back()->with('success', 'Funcionário removido com sucesso!');
    }
}
